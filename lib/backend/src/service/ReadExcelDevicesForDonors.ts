import getDbConnection from '@db/connection'
import * as db from '@db/index'
import { CustomerDeviceExcel } from '@model'
import * as XLSX from 'xlsx' // ✨ שינוי: נדרש בשביל כתיבה
import * as path from 'path' // ✨ שינוי: נדרש בשביל כתיבה
import { convertFlatRowToModel } from '@utils/converters/customerDeviceExcelConverter'
import { writeErrorsToExcel } from '@utils/excel'
import { ExcelRowData, ExcelProcessingError, KnexTransaction } from '../types'

const processExcelData = async (data: ExcelRowData[]): Promise<{
  totalRows: number;
  errorsCount: number;
  successCount: number;
  errorFilePath?: string;
}> => {
  const knex = getDbConnection()
  const errors: ExcelProcessingError[] = []
  let successCount = 0

  for (const item of data) {
    const isCustomer: boolean =
      !!(typeof item.first_name === 'string' && item.first_name.trim()) ||
      !!(typeof item.last_name === 'string' && item.last_name.trim())

    let sanitized: CustomerDeviceExcel.Model | null = null

    try {
      sanitized = await CustomerDeviceExcel.sanitize(convertFlatRowToModel(item), isCustomer)
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err)
      errors.push({
        row: data.indexOf(item) + 1,
        message: 'Sanitization failed',
        error: `Sanitize failed: ${errorMessage}`,
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
              filterVersion: '1.7',
              deviceProgram: '0',
            },
            trx,
          )
        }
        await trx.commit()
        successCount++ // ספירת הצלחה
      } catch (err: unknown) {
        console.error('Transaction failed:', err)
        const errorMessage = err instanceof Error ? err.message : String(err)
        errors.push({
          row: data.indexOf(item) + 1,
          message: 'Transaction failed',
          error: `Transaction failed: ${errorMessage}`,
          data: item,
        })
        await trx.rollback()
      }
    } else {
      try {
        await processDevice(sanitized, null)
        successCount++ // ספירת הצלחה גם ליצירת device בלבד
      } catch (err: unknown) {
        console.error('Error creating device (no customer):', err)
        const errorMessage = err instanceof Error ? err.message : String(err)
        errors.push({
          row: data.indexOf(item) + 1,
          message: 'Device-only insert failed',
          error: `Device-only insert failed: ${errorMessage}`,
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

const processCustomer = async (sanitized: CustomerDeviceExcel.Model, trx: KnexTransaction) => {
  if (!sanitized.customer) {
    throw new Error('Customer is undefined in sanitized object.')
  }

  let existCustomer = await db.Customer.findCustomer({
    email: sanitized.customer.email,
    id_number: sanitized.customer.id_number,
  })

  if (!existCustomer) {
    console.log('Creating customer...')
    existCustomer = await db.Customer.createCustomer(sanitized.customer, trx)
    console.log('Customer created.')
  }

  return existCustomer
}

const processDevice = async (sanitized: CustomerDeviceExcel.Model, trx?: KnexTransaction | null) => {
  let existDevice = await db.Device.findDevice({
    SIM_number: sanitized.device.SIM_number,
    IMEI_1: sanitized.device.IMEI_1,
    mehalcha_number: sanitized.device.mehalcha_number,
    device_number: sanitized.device.device_number,
  })

  if (!existDevice) {
    console.log('Creating device...')
    existDevice = await db.Device.createDevice(sanitized.device, trx || undefined)
    console.log('Device created.')
  }

  return existDevice
}

export { processExcelData }
