import getDbConnection from '@db/connection'
import * as db from '@db/index'
import { CustomerDeviceExcel } from '@model'
import * as XLSX from 'xlsx' // ✨ שינוי: נדרש בשביל כתיבה
import * as path from 'path' // ✨ שינוי: נדרש בשביל כתיבה
import { convertFlatRowToModel } from '@utils/converters/customerDeviceExcelConverter'
import { writeErrorsToExcel } from '@utils/excel'
import { Knex } from 'knex'

interface ExcelRowData {
  [key: string]: unknown
}

interface ProcessError {
  row: number
  error: string
  data: ExcelRowData
}

export { ExcelRowData, ProcessError }
import logger from '../utils/logger'

//גם פה לעדכן לפי השינויים
const processExcelData = async (data: ExcelRowData[]): Promise<{
  totalRows: number;
  errorsCount: number;
  successCount: number;
  errorFilePath?: string;
}> => {
  const knex = getDbConnection()
  const errors: ProcessError[] = []
  let successCount = 0

  for (const item of data) {
    const isCustomer: boolean = [item.first_name, item.last_name, item.phone_number, item.email].some(
      field => typeof field === 'string' && field.trim() !== ''
    );
    let sanitized: CustomerDeviceExcel.Model | null = null

    try {
      sanitized = await CustomerDeviceExcel.sanitize(convertFlatRowToModel(item), isCustomer)
    } catch (err: unknown) {
      errors.push({
        row: data.indexOf(item) + 1,
        error: `Sanitize failed: ${err instanceof Error ? err.message : String(err)}`,
        data: item,
      })
      continue
    }

    if (isCustomer) {
      const trx = await knex.transaction()
      try {
        const existCustomer = await processCustomer(sanitized, trx)
        const existDevice = await processDevice(sanitized, trx)

        let existingRelation = await db.CustomerDevice.findCustomerDevice({
          device_id: existDevice.device_id,
        })

        if (!existingRelation) {
          const date: Date = new Date(sanitized.receivedAt)
          const planEndDate = new Date(date)
          planEndDate.setFullYear(planEndDate.getFullYear() + 5)
          await db.CustomerDevice.createCustomerDevice(
            {
              customerDevice_id: '',
              customer_id: existCustomer.customer_id,
              device_id: existDevice.device_id,
              receivedAt: date,
              planEndDate: planEndDate,
            },
            trx,
          )
        }
        await trx.commit()
        successCount++ // ספירת הצלחה
      } catch (err: unknown) {
        logger.error('Transaction failed:', err)
        errors.push({
          row: data.indexOf(item) + 1,
          error: `Transaction failed: ${err instanceof Error ? err.message : String(err)}`,
          data: item,
        })
        await trx.rollback()
      }
    } else {
      try {
        await processDevice(sanitized, undefined)
        successCount++ // ספירת הצלחה גם ליצירת device בלבד
      } catch (err: unknown) {
        logger.error('Error creating device (no customer):', err)
        errors.push({
          row: data.indexOf(item) + 1,
          error: `Device-only insert failed: ${err instanceof Error ? err.message : String(err)}`,
          data: item,
        })
      }
    }
  }

  // כתיבת השגיאות לקובץ Excel
  const errorFilePath = await writeErrorsToExcel(errors)
  if (errorFilePath) {
    console.log(`📋 Error report generated: ${errorFilePath}`)
  }

  // ✅ החזרת סיכום התוצאות עם הספירה הנכונה
  return {
    totalRows: data.length,
    errorsCount: errors.length,
    successCount,
    ...(errorFilePath && { errorFilePath })
  }
}

const processCustomer = async (sanitized: CustomerDeviceExcel.Model, trx: Knex.Transaction) => {
  if (!sanitized.customer) {
    throw new Error('Customer is undefined in sanitized object.')
  }

  let existCustomer = await db.Customer.findCustomer({
    email: sanitized.customer.email,
    id_number: sanitized.customer.id_number,
  })

  if (!existCustomer) {
    logger.debug('Creating customer...')
    existCustomer = await db.Customer.createCustomer(sanitized.customer, trx)
    logger.debug('Customer created.')
  }

  return existCustomer
}

const processDevice = async (sanitized: CustomerDeviceExcel.Model, trx: Knex.Transaction | null | undefined) => {
  let existDevice = await db.Device.findDevice({
    SIM_number: sanitized.device.SIM_number,
    IMEI_1: sanitized.device.IMEI_1,
    device_number: sanitized.device.device_number,
    serialNumber: sanitized.device.serialNumber,
  })

  if (!existDevice) {
    logger.debug('Creating device...')
    existDevice = await db.Device.createDevice(sanitized.device, trx || undefined)
    logger.debug('Device created.')
  }

  return existDevice
}

export { processExcelData }
