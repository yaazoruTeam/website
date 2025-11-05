/**
 * DeviceExcelService - שירות עיבוד קבצי Excel למכשירים בלבד
 * אחראי על כל הלוגיקה הספציפית לעיבוד נתוני מכשירים
 */

import { Device } from '@model'
import { convertFlatRowToDeviceModel } from '@utils/converters/deviceExcelConverter'
import { writeErrorsToExcel } from '@utils/excel'
import { formatErrorMessage } from '@utils/errorHelpers'
import logger from '../../utils/logger'
import { 
  ExcelRowData, 
  ProcessError, 
  ProcessingResult,
  buildProcessingResult,
  validateRowData,
  createDeviceIfNotExists,
  createCommentForEntity
} from './BaseExcelService'

/**
 * פונקציה עזר להמרת ערכים ל-string בטוח (כמו ב-converter)
 * מטפלת גם ב-null/undefined ובמספרים מ-Excel
 */
const toSafeString = (value: unknown): string => {
  if (value === undefined || value === null) return ''
  return String(value).trim()
}

/**
 * השדות הנדרשים במכשיר
 */
const REQUIRED_DEVICE_FIELDS = ['SIM_number', 'IMEI_1', 'serialNumber', 'device_number']

/**
 * וולידציה מפורטת לשדות מכשיר
 * מחזירה מידע מפורט על מה חסר או לא תקין
 * מקבלת גם numbers מ-Excel וממירה אותם ל-strings
 */
const validateDeviceFields = (rowData: ExcelRowData, rowIndex: number) => {
  const errors: string[] = []
  
  // בדיקה מפורטת של כל שדה
  for (const field of REQUIRED_DEVICE_FIELDS) {
    const value = rowData[field]
    
    if (value === undefined || value === null) {
      errors.push(`${field} is missing (undefined/null)`)
    } else if (typeof value !== 'string' && typeof value !== 'number') {
      errors.push(`${field} is not a string or number (type: ${typeof value}, value: ${value})`)
    } else {
      // המרה ל-string ובדיקה שאינו ריק
      const stringValue = String(value).trim()
      if (stringValue === '' || stringValue === 'undefined' || stringValue === 'null') {
        errors.push(`${field} is empty or invalid after conversion to string`)
      }
    }
  }
  
  // לוג מפורט
  logger.debug(`Row ${rowIndex} validation:`, {
    availableFields: Object.keys(rowData),
    requiredFields: REQUIRED_DEVICE_FIELDS,
    fieldValues: REQUIRED_DEVICE_FIELDS.reduce((acc, field) => {
      acc[field] = { 
        originalValue: rowData[field], 
        originalType: typeof rowData[field],
        convertedValue: String(rowData[field]).trim()
      }
      return acc
    }, {} as Record<string, { originalValue: unknown, originalType: string, convertedValue: string }>)
  })
  
  return {
    isValid: errors.length === 0,
    errorMessage: errors.length > 0 ? `Validation errors: ${errors.join(', ')}` : ''
  }
}

/**
 * עיבוד נתוני Excel ספציפיים למכשירים בלבד
 * פונקציה זו אחראית על פילטור ועיבוד נתונים של מכשירים בלבד
 */
const processDeviceExcelData = async (data: ExcelRowData[]): Promise<ProcessingResult> => {
  // const knex = getDbConnection()
  const errors: ProcessError[] = []
  let successCount = 0

  logger.info(`Starting to process ${data.length} rows of device-only data`)
  
  // הדפסת מידע על מבנה הקובץ לצורך דיבוג
  if (data.length > 0) {
    logger.info('📊 Excel file structure analysis:')
    logger.info(`- Total rows: ${data.length}`)
    logger.info(`- Available columns in first row: ${Object.keys(data[0]).join(', ')}`)
    logger.info(`- Required columns: ${REQUIRED_DEVICE_FIELDS.join(', ')}`)
    logger.info(`- First row sample:`, JSON.stringify(data[0], null, 2))
    
    // בדיקת כפילויות בקובץ
    const deviceSignatures = new Map<string, number[]>()
    data.forEach((item, index) => {
      const signature = `${item.SIM_number}-${item.IMEI_1}-${item.device_number}-${item.serialNumber}`
      if (!deviceSignatures.has(signature)) {
        deviceSignatures.set(signature, [])
      }
      deviceSignatures.get(signature)!.push(index + 1)
    })
    
    const duplicates = Array.from(deviceSignatures.entries()).filter(([_, rows]) => rows.length > 1)
    if (duplicates.length > 0) {
      logger.warn(`⚠️  Found ${duplicates.length} sets of duplicate devices in Excel file:`)
      duplicates.forEach(([signature, rows]) => {
        logger.warn(`   Duplicate device ${signature} appears in rows: ${rows.join(', ')}`)
      })
    } else {
      logger.info('✅ No duplicates found in Excel file')
    }
  }

  for (const item of data) {
    const rowIndex = data.indexOf(item) + 1
    
    // יצירת טרנזקציה לכל מכשיר
    // const trx = await knex.transaction()
    
    try {
      logger.info(`🔄 Processing row ${rowIndex}/${data.length}`)
      
      // דיבוג: בואי נראה מה יש בשורה
      logger.debug(`Row ${rowIndex} data:`, JSON.stringify(item, null, 2))
      
      // וולידציה מפורטת של השדות הנדרשים
      const validationResult = validateDeviceFields(item, rowIndex)
      if (!validationResult.isValid) {
        logger.error(`❌ Row ${rowIndex} validation failed: ${validationResult.errorMessage}`)
        throw new Error(validationResult.errorMessage)
      }
      
      logger.info(`✅ Row ${rowIndex} validation passed`)

      // המרת הנתונים למודל מכשיר
      const deviceModel: Device.Model = convertFlatRowToDeviceModel(item)
      logger.info(`📝 Row ${rowIndex} converted to device model:`, {
        device_number: deviceModel.device_number,
        SIM_number: deviceModel.SIM_number,
        IMEI_1: deviceModel.IMEI_1,
        serialNumber: deviceModel.serialNumber
      })

      // עיבוד המכשיר באמצעות הפונקציה המשותפת עם טרנזקציה
      logger.info(`💾 Row ${rowIndex} - Starting device processing...`)
      const processedDevice = await createDeviceIfNotExists(deviceModel/*, trx*/)
      
      // יצירת הערה למכשיר אם יש תוכן הערה (עם טרנזקציה)
      // await createCommentForEntity(
      //   String(processedDevice.device_id),
      //   'device',
      //   item.comment as string,
      //   trx
      // )
      
      // await trx.commit()
      
      logger.info(`🎉 Row ${rowIndex} - Device processed successfully! Device ID: ${processedDevice.device_id}`)
      
      successCount++
      logger.info(`📊 Row ${rowIndex}: SUCCESS! Total successful so far: ${successCount}`)
      
    } catch (err: unknown) {
      try {
        // await trx.rollback()
      } catch (rollbackErr) {
        logger.error(`Row ${rowIndex}: Transaction rollback failed:`, rollbackErr)
      }
      
      logger.error(`❌ Row ${rowIndex}: Device processing failed:`, err)
      
      const errorMessage = formatErrorMessage(err)
      
      errors.push({
        row: rowIndex,
        error: `Device processing failed: ${errorMessage}`,
        data: item,
      })
    }
  }

  // כתיבת השגיאות לקובץ Excel עבור devices
  const errorFilePath = await writeErrorsToExcel(errors, 'devices')
  if (errorFilePath) {
    logger.info(`📋 Device error report generated: ${errorFilePath}`)
  }

  logger.info(`🏁 Device processing completed:`)
  logger.info(`📊 Final Results:`)
  logger.info(`   - Total rows processed: ${data.length}`)
  logger.info(`   - Successful operations: ${successCount}`)
  logger.info(`   - Failed operations: ${errors.length}`)
  logger.info(`   - Success rate: ${Math.round((successCount / data.length) * 100)}%`)

  return buildProcessingResult(data.length, successCount, errors, errorFilePath || undefined)
}

export { processDeviceExcelData, REQUIRED_DEVICE_FIELDS }