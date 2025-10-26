/**
 * CustomerExcelService - שירות עיבוד קבצי Excel ללקוחות בלבד
 * אחראי על כל הלוגיקה הספציפית לעיבוד נתוני לקוחות
 */

import getDbConnection from '@db/connection'
import * as db from '@db/index'
import { Customer } from '@model'
import { writeErrorsToExcel } from '@utils/excel'
import { formatErrorMessage } from '@utils/errorHelpers'
import { Knex } from 'knex'
import logger from '../../utils/logger'
import {
  ExcelRowData,
  ProcessError,
  ProcessingResult,
  buildProcessingResult,
  validateRowData
} from './BaseExcelService'

/**
 * ממיר נתוני שורה גולמיים למודל לקוח
 */
const convertFlatRowToCustomerModel = (item: ExcelRowData): Customer.Model => {
  return {
    customer_id: '', 
    first_name: String(item.first_name || '').trim(),
    last_name: String(item.last_name || '').trim(),
    id_number: String(item.id_number || '').trim(),
    phone_number: String(item.phone_number || '').trim(),
    additional_phone: item.additional_phone ? String(item.additional_phone).trim() : '',
    email: String(item.email || '').trim().toLowerCase(),
    city: String(item.city || '').trim(),
    address: String(item.address || '').trim(),
    status: 'active', // סטטוס ברירת מחדל
    created_at: new Date(),
    updated_at: new Date()
  }
}

/**
 * עיבוד נתוני Excel ספציפיים ללקוחות בלבד
 * פונקציה זו אחראית על פילטור ועיבוד נתונים של לקוחות בלבד
 */
const processCustomerExcelData = async (data: ExcelRowData[]): Promise<ProcessingResult> => {
  const knex = getDbConnection()
  const errors: ProcessError[] = []
  let successCount = 0

  // השדות הנדרשים לקובץ לקוחות
  const requiredFields = [
    'first_name',
    'last_name', 
    'city',
    'address',
    'phone_number',
    'email',
    'id_number'
  ]

  logger.info(`Starting to process ${data.length} rows of customer data`)

  for (const item of data) {
    const rowIndex = data.indexOf(item) + 1

    // בדיקת תקינות השדות הנדרשים
    if (!validateRowData(item, requiredFields)) {
      const missingFields = requiredFields.filter(field => {
        const value = item[field]
        if (value === undefined || value === null) return true
        const stringValue = String(value).trim()
        return stringValue === '' || stringValue === 'undefined' || stringValue === 'null'
      })

      errors.push({
        row: rowIndex,
        error: `Missing or invalid required fields: ${missingFields.join(', ')}`,
        data: item,
      })
      continue
    }

    let sanitizedCustomer: Customer.Model | null = null

    try {
      // המרת הנתונים למודל לקוח
      const customerModel = convertFlatRowToCustomerModel(item)
      
      // וולידציה של המודל
      sanitizedCustomer = Customer.sanitize(customerModel, false) // false כי זה לקוח חדש ללא ID
      
    } catch (err: unknown) {
      const errorMessage = formatErrorMessage(err)

      errors.push({
        row: rowIndex,
        error: `Customer validation failed: ${errorMessage}`,
        data: item,
      })
      continue
    }

    // עיבוד הלקוח
    const trx = await knex.transaction()
    try {
      // בדיקה אם הלקוח כבר קיים במערכת
      let existingCustomer = await db.Customer.findCustomer({
        email: sanitizedCustomer.email,
        id_number: sanitizedCustomer.id_number,
      }, trx)

      if (existingCustomer) {
        // הלקוח כבר קיים - זו שגיאה או עדכון?
        // נבחר להתייחס לזה כשגיאה כדי למנוע כפילויות
        await trx.rollback()
        
        errors.push({
          row: rowIndex,
          error: `Customer already exists with email: ${sanitizedCustomer.email} or ID: ${sanitizedCustomer.id_number}`,
          data: item,
        })
        continue
      }

      // יצירת לקוח חדש
      existingCustomer = await db.Customer.createCustomer(sanitizedCustomer, trx)
      
      await trx.commit()
      successCount++
      logger.debug(`Row ${rowIndex}: Customer processed successfully (ID: ${existingCustomer.customer_id})`)
      
    } catch (err: unknown) {
      try {
        await trx.rollback()
      } catch (rollbackErr) {
        logger.error(`Row ${rowIndex}: Transaction rollback failed:`, rollbackErr)
      }

      const errorMessage = formatErrorMessage(err)

      errors.push({
        row: rowIndex,
        error: `Customer creation failed: ${errorMessage}`,
        data: item,
      })
    }
  }

  // כתיבת השגיאות לקובץ Excel עבור customers
  const errorFilePath = await writeErrorsToExcel(errors, 'customer')
  if (errorFilePath) {
    logger.info(`📋 Customer error report generated: ${errorFilePath}`)
  }

  logger.info(`Customer processing completed: ${successCount}/${data.length} successful`)

  return buildProcessingResult(data.length, successCount, errors, errorFilePath || undefined)
}

export { processCustomerExcelData, ExcelRowData, ProcessError }