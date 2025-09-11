import getDbConnection from '@db/connection'
import * as db from '@db/index'
import { DeviceOnlyExcel } from '@model'
import { convertFlatRowToDeviceModel } from '@utils/converters/deviceOnlyExcelConverter'
import { writeErrorsToExcel } from '@utils/excel'
import { SamsungDeviceValidator } from '../services/samsungDeviceValidator'
import logger from '../utils/logger'

const processDevicesOnlyExcelData = async (data: any[]): Promise<{
  totalRows: number;
  errorsCount: number;
  successCount: number;
  errorFilePath?: string;
}> => {
  const knex = getDbConnection()
  const errors: any[] = []
  let successCount = 0
  const samsungValidator = new SamsungDeviceValidator()

  logger.info(`🔄 Starting to process ${data.length} device records...`)

  for (let i = 0; i < data.length; i++) {
    const item = data[i]
    const rowNumber = i + 1
    
    logger.debug(`📱 Processing device ${rowNumber}/${data.length}`)

    let sanitized: DeviceOnlyExcel.Model | null = null

    try {
      // המרת השורה למודל
      const converted = convertFlatRowToDeviceModel(item)
      
      // וידוא שדות
      sanitized = DeviceOnlyExcel.sanitize(converted)
      
      logger.debug(`✅ Device ${rowNumber} converted and sanitized successfully`)
    } catch (err: any) {
      logger.error(`❌ Row ${rowNumber} failed sanitization:`, err.message)
      errors.push({
        row: rowNumber,
        ...item,
        error: `בעיה בנתונים: ${err.message || err.toString()}`,
        errorType: 'VALIDATION_ERROR'
      })
      continue
    }

    // אימות מול סמסונג
    try {
      logger.debug(`🔍 Validating device ${rowNumber} with Samsung...`)
      
      const samsungValidation = await samsungValidator.validateDevice(
        sanitized.device.IMEI_1,
        sanitized.device.serialNumber
      )

      if (!samsungValidation.isValid) {
        logger.error(`❌ Samsung validation failed for device ${rowNumber}: ${samsungValidation.message}`)
        errors.push({
          row: rowNumber,
          ...item,
          error: samsungValidation.message || 'אימות סמסונג נכשל',
          errorType: 'SAMSUNG_VALIDATION_ERROR'
        })
        continue
      }
      
      logger.debug(`✅ Device ${rowNumber} Samsung validation passed`)
    } catch (err: any) {
      logger.error(`❌ Samsung validation error for device ${rowNumber}:`, err)
      errors.push({
        row: rowNumber,
        ...item,
        error: `שגיאה באימות סמסונג: ${err.message || err.toString()}`,
        errorType: 'SAMSUNG_API_ERROR'
      })
      continue
    }

    // בדיקה אם המכשיר כבר קיים במסד הנתונים
    try {
      const existingDevice = await db.Device.findDevice({
        SIM_number: sanitized.device.SIM_number,
        IMEI_1: sanitized.device.IMEI_1,
        device_number: sanitized.device.device_number,
        serialNumber: sanitized.device.serialNumber,
      })

      if (existingDevice) {
        logger.warn(`⚠️ Device ${rowNumber} already exists in database`)
        errors.push({
          row: rowNumber,
          ...item,
          error: 'המכשיר כבר קיים במערכת',
          errorType: 'DUPLICATE_DEVICE'
        })
        continue
      }
    } catch (err: any) {
      logger.error(`❌ Database check failed for device ${rowNumber}:`, err)
      errors.push({
        row: rowNumber,
        ...item,
        error: `שגיאה בבדיקת מסד נתונים: ${err.message || err.toString()}`,
        errorType: 'DATABASE_CHECK_ERROR'
      })
      continue
    }

    // יצירת המכשיר במסד הנתונים
    const trx = await knex.transaction()
    try {
      logger.debug(`💾 Creating device ${rowNumber} in database...`)
      
      await db.Device.createDevice(sanitized.device, trx)
      await trx.commit()
      
      successCount++
      logger.debug(`✅ Device ${rowNumber} created successfully`)
    } catch (err: any) {
      logger.error(`❌ Database creation failed for device ${rowNumber}:`, err)
      await trx.rollback()
      errors.push({
        row: rowNumber,
        ...item,
        error: `שגיאה ביצירת המכשיר: ${err.message || err.toString()}`,
        errorType: 'DATABASE_CREATE_ERROR'
      })
    }
  }

  // כתיבת השגיאות לקובץ Excel
  const errorFilePath = await writeErrorsToExcel(errors)
  if (errorFilePath) {
    logger.info(`📋 Error report generated: ${errorFilePath}`)
  }

  // סיכום התוצאות
  logger.info(`📊 Processing completed:`)
  logger.info(`   Total rows: ${data.length}`)
  logger.info(`   ✅ Success: ${successCount}`)
  logger.info(`   ❌ Errors: ${errors.length}`)

  return {
    totalRows: data.length,
    errorsCount: errors.length,
    successCount,
    ...(errorFilePath && { errorFilePath })
  }
}

export { processDevicesOnlyExcelData }
