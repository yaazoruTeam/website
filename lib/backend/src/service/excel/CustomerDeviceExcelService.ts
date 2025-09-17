/**
 * CustomerDeviceExcelService - שירות עיבוד קבצי Excel ללקוחות ומכשירים
 * אחראי על כל הלוגיקה הספציפית לעיבוד נתוני לקוחות ומכשירים
 */

import getDbConnection from '@db/connection'
import * as db from '@db/index'
import { CustomerDeviceExcel } from '@model'
import { convertFlatRowToModel } from '@utils/converters/customerDeviceExcelConverter'
import { writeErrorsToExcel } from '@utils/excel'
import { Knex } from 'knex'
import logger from '../../utils/logger'
import { 
  ExcelRowData, 
  ProcessError, 
  ProcessingResult,
  buildProcessingResult 
} from './BaseExcelService'

/**
 * עיבוד נתוני Excel ספציפיים ללקוחות ומכשירים
 * פונקציה זו אחראית על פילטור ועיבוד נתונים של לקוחות ומכשירים בלבד
 */
const processCustomerDeviceExcelData = async (data: ExcelRowData[]): Promise<ProcessingResult> => {
  const knex = getDbConnection()
  const errors: ProcessError[] = []
  let successCount = 0

  logger.info(`Starting to process ${data.length} rows of customer-device data`)

  for (const item of data) {
    const rowIndex = data.indexOf(item) + 1
    
    // בדיקה אם השורה מכילה נתוני לקוח
    const isCustomer: boolean = [item.first_name, item.last_name, item.phone_number, item.email].some(
      field => typeof field === 'string' && field.trim() !== ''
    )
    
    let sanitized: CustomerDeviceExcel.Model | null = null

    try {
      sanitized = await CustomerDeviceExcel.sanitize(convertFlatRowToModel(item), isCustomer)
    } catch (err: unknown) {
      let errorMessage = 'Unknown error'
      if (err instanceof Error) {
        errorMessage = err.message
      } else if (typeof err === 'string') {
        errorMessage = err
      } else if (err && typeof err === 'object') {
        errorMessage = JSON.stringify(err)
      } else {
        errorMessage = String(err)
      }
      
      errors.push({
        row: rowIndex,
        error: `Sanitize failed: ${errorMessage}`,
        data: item,
      })
      continue
    }

    if (isCustomer) {
      // עיבוד עם לקוח ומכשיר
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
        successCount++
        logger.debug(`Row ${rowIndex}: Customer-Device processed successfully`)
      } catch (err: unknown) {
        logger.error(`Row ${rowIndex}: Transaction failed:`, err)
        
        let errorMessage = 'Unknown error'
        if (err instanceof Error) {
          errorMessage = err.message
        } else if (typeof err === 'string') {
          errorMessage = err
        } else if (err && typeof err === 'object') {
          errorMessage = JSON.stringify(err)
        } else {
          errorMessage = String(err)
        }
        
        errors.push({
          row: rowIndex,
          error: `Transaction failed: ${errorMessage}`,
          data: item,
        })
        await trx.rollback()
      }
    } else {
      // עיבוד מכשיר בלבד
      try {
        await processDevice(sanitized, undefined)
        successCount++
        logger.debug(`Row ${rowIndex}: Device-only processed successfully`)
      } catch (err: unknown) {
        logger.error(`Row ${rowIndex}: Error creating device (no customer):`, err)
        
        let errorMessage = 'Unknown error'
        if (err instanceof Error) {
          errorMessage = err.message
        } else if (typeof err === 'string') {
          errorMessage = err
        } else if (err && typeof err === 'object') {
          errorMessage = JSON.stringify(err)
        } else {
          errorMessage = String(err)
        }
        
        errors.push({
          row: rowIndex,
          error: `Device-only insert failed: ${errorMessage}`,
          data: item,
        })
      }
    }
  }

  // כתיבת השגיאות לקובץ Excel עבור customerDevice
  const errorFilePath = await writeErrorsToExcel(errors, 'customerDevice')
  if (errorFilePath) {
    logger.info(`📋 Customer-Device error report generated: ${errorFilePath}`)
  }

  logger.info(`Customer-Device processing completed: ${successCount}/${data.length} successful`)

  return buildProcessingResult(data.length, successCount, errors, errorFilePath || undefined)
}

/**
 * עיבוד נתוני לקוח
 */
const processCustomer = async (sanitized: CustomerDeviceExcel.Model, trx: Knex.Transaction) => {
  if (!sanitized.customer) {
    throw new Error('Customer is undefined in sanitized object.')
  }

  let existCustomer = await db.Customer.findCustomer({
    email: sanitized.customer.email,
    id_number: sanitized.customer.id_number,
  })

  if (!existCustomer) {
    logger.debug('Creating new customer...')
    existCustomer = await db.Customer.createCustomer(sanitized.customer, trx)
    logger.debug('Customer created successfully')
  } else {
    logger.debug('Customer already exists, using existing record')
  }

  return existCustomer
}

/**
 * עיבוד נתוני מכשיר
 */
const processDevice = async (sanitized: CustomerDeviceExcel.Model, trx: Knex.Transaction | null | undefined) => {
  let existDevice = await db.Device.findDevice({
    SIM_number: sanitized.device.SIM_number,
    IMEI_1: sanitized.device.IMEI_1,
    device_number: sanitized.device.device_number,
    serialNumber: sanitized.device.serialNumber,
  })

  if (!existDevice) {
    logger.debug('Creating new device...')
    existDevice = await db.Device.createDevice(sanitized.device, trx || undefined)
    logger.debug('Device created successfully')
  } else {
    logger.debug('Device already exists, using existing record')
  }

  return existDevice
}

export { processCustomerDeviceExcelData, ExcelRowData, ProcessError }