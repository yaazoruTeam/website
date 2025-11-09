/**
 * CustomerDeviceExcelService - שירות עיבוד קבצי Excel ללקוחות ומכשירים
 * אחראי על כל הלוגיקה הספציפית לעיבוד נתוני לקוחות ומכשירים
 */
//to do: לטפל בטרנזקציה
import { customerRepository } from '@repositories/CustomerRepository'
import { CustomerDeviceExcel } from '@model'
import { convertFlatRowToModel } from '@utils/converters/customerDeviceExcelConverter'
import { writeErrorsToExcel } from '@utils/excel'
import { formatErrorMessage } from '@utils/errorHelpers'
import { Knex } from 'knex'
import logger from '../../utils/logger'
import {
  ExcelRowData,
  ProcessError,
  ProcessingResult,
  buildProcessingResult,
  createDeviceIfNotExists,
  createCommentForEntity
} from './BaseExcelService'
import { customerDeviceRepository } from '@/src/repositories'

/**
 * עיבוד נתוני Excel ספציפיים ללקוחות ומכשירים
 * פונקציה זו אחראית על פילטור ועיבוד נתונים של לקוחות ומכשירים בלבד
 */
const processCustomerDeviceExcelData = async (data: ExcelRowData[]): Promise<ProcessingResult> => {
  // const knex = getDbConnection()
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
      const errorMessage = formatErrorMessage(err)

      errors.push({
        row: rowIndex,
        error: `Sanitize failed: ${errorMessage}`,
        data: item,
      })
      continue
    }

    if (isCustomer) {
      // עיבוד עם לקוח ומכשיר
      // const trx = await knex.transaction()
      try {
        const existCustomer = await processCustomer(sanitized/*, trx*/)
        const existDevice = await createDeviceIfNotExists(sanitized.device/*, trx*/)

        let existingRelation = await customerDeviceRepository.findExistingCustomerDevice({
          device_id:existDevice.device_id,
        })

        // if (!existingRelation) {
        //   const date: Date = new Date(sanitized.receivedAt)
        //   const planEndDate = new Date(date)
        //   planEndDate.setFullYear(planEndDate.getFullYear() + 5)

          await customerDeviceRepository.createCustomerDevice(
            {
              customerDevice_id: 0,
              customer_id: existCustomer.customer_id,
              device_id: existDevice.device_id!,
              receivedAt: date,
              planEndDate: planEndDate,
            },
            //trx,
          )
        }

        // יצירת הערה ללקוח בלבד (לא למכשיר) בטבלת לקוחות-מכשירים
        // await createCommentForEntity(
        //   String(existCustomer.customer_id),
        //   'customer',
        //   item.comment as string,
        //   trx
        // )

        // await trx.commit()
        successCount++
        logger.debug(`Row ${rowIndex}: Customer-Device processed successfully`)
      } catch (err: unknown) {
        try {
          // await trx.rollback()
        } catch (rollbackErr) {
          logger.error(`Row ${rowIndex}: Transaction rollback failed:`, rollbackErr)
        }

        const errorMessage = formatErrorMessage(err)

        errors.push({
          row: rowIndex,
          error: `Transaction failed: ${errorMessage}`,
          data: item,
        })
      }
    } else {
      // עיבוד מכשיר בלבד
      try {
        await createDeviceIfNotExists(sanitized.device)
        successCount++
        logger.debug(`Row ${rowIndex}: Device-only processed successfully`)
      } catch (err: unknown) {
        logger.error(`Row ${rowIndex}: Error creating device (no customer):`, err)

        const errorMessage = formatErrorMessage(err)

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
 * עיבוד נתוני לקוח - מטפל בכל השגיאות האפשריות
 */
const processCustomer = async (sanitized: CustomerDeviceExcel.Model, trx?: Knex.Transaction) => {
  try {
    if (!sanitized.customer) {
      throw new Error('Customer is undefined in sanitized object.')
    }

    let existCustomer = await customerRepository.findExistingCustomer({
      email: sanitized.customer.email,
      id_number: sanitized.customer.id_number,
    })

    if (!existCustomer) {
      logger.debug('Creating new customer...')
      existCustomer = await customerRepository.createCustomer({
        first_name: sanitized.customer.first_name,
        last_name: sanitized.customer.last_name,
        id_number: sanitized.customer.id_number,
        phone_number: sanitized.customer.phone_number,
        additional_phone: sanitized.customer.additional_phone || null,
        email: sanitized.customer.email,
        city: sanitized.customer.city,
        address: sanitized.customer.address,
      })
      logger.debug('Customer created successfully')
    } else {
      logger.debug('Customer already exists, using existing record')
    }

    return existCustomer
  } catch (error) {
    logger.error('Error in processCustomer:', error)
    // זורק השגיאה כדי שהיא תטופל ברמה הגבוהה יותר
    throw error
  }
}

export { processCustomerDeviceExcelData, ExcelRowData, ProcessError }