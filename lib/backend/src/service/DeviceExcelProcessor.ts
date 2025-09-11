import getDbConnection from '@db/connection'
import * as db from '@db/index'
import { Device } from '@model'
import { convertExcelRowToDevice, validateRequiredFields, DeviceExcelRow } from '@utils/converters/deviceExcelConverter'
import { SamsungApiService } from '@integration/samsung/samsungApi'
import { writeErrorsToExcel } from '@utils/excel'
import logger from '../utils/logger'

interface ProcessingResult {
  totalRows: number
  successCount: number
  errorsCount: number
  duplicatesCount: number
  samsungValidationFailures: number
  errorFilePath?: string
}

interface ProcessingError {
  row: DeviceExcelRow & { rowNumber?: number }
  error: string
  errorType: 'validation' | 'samsung' | 'database' | 'duplicate'
}

class DeviceExcelProcessor {
  private samsungApi: SamsungApiService
  private knex: any

  constructor() {
    this.samsungApi = new SamsungApiService()
    this.knex = getDbConnection()
  }

  async processExcelData(data: DeviceExcelRow[]): Promise<ProcessingResult> {
    logger.info(`📋 Starting device processing for ${data.length} rows`)
    
    const errors: ProcessingError[] = []
    let successCount = 0
    let duplicatesCount = 0
    let samsungValidationFailures = 0

    for (let i = 0; i < data.length; i++) {
      const rowIndex = i + 2 // +2 because Excel rows start from 1 and we skip header
      const item = data[i]

      try {
        logger.debug(`🔄 Processing row ${rowIndex}`)
        
        // שלב 1: המרה לדגם מכשיר
        const deviceModel = convertExcelRowToDevice(item)
        
        // שלב 2: אימות שדות נדרשים
        const validationErrors = validateRequiredFields(deviceModel)
        if (validationErrors.length > 0) {
          errors.push({
            row: { ...item, rowNumber: rowIndex },
            error: `שדות חסרים: ${validationErrors.join(', ')}`,
            errorType: 'validation'
          })
          continue
        }

        // שלב 3: בדיקת כפילויות
        const existingDevice = await this.findExistingDevice(deviceModel)
        if (existingDevice) {
          duplicatesCount++
          errors.push({
            row: { ...item, rowNumber: rowIndex },
            error: `מכשיר כבר קיים במערכת - IMEI: ${deviceModel.IMEI_1}`,
            errorType: 'duplicate'
          })
          continue
        }

        // שלב 4: אימות מול סמסונג
        const samsungValidation = await this.samsungApi.validateDevice({
          imei: deviceModel.IMEI_1,
          serialNumber: deviceModel.serialNumber
        })

        if (!samsungValidation.isValid) {
          samsungValidationFailures++
          errors.push({
            row: { ...item, rowNumber: rowIndex },
            error: `אימות סמסונג נכשל: ${samsungValidation.errorMessage}`,
            errorType: 'samsung'
          })
          continue
        }

        // שלב 5: עדכון מודל עם נתוני סמסונג
        if (samsungValidation.model) {
          deviceModel.model = samsungValidation.model
        }

        // שלב 6: אימות סופי של המודל
        const sanitizedDevice = Device.sanitize(deviceModel, false)

        // שלב 7: שמירה במסד נתונים
        await this.saveDeviceToDatabase(sanitizedDevice)
        successCount++
        
        logger.debug(`✅ Row ${rowIndex} processed successfully`)

      } catch (error: any) {
        logger.error(`💥 Error processing row ${rowIndex}:`, error)
        errors.push({
          row: { ...item, rowNumber: rowIndex },
          error: `שגיאת מערכת: ${error.message}`,
          errorType: 'database'
        })
      }
    }

    // כתיבת דוח שגיאות
    const errorFilePath = await this.generateErrorReport(errors)

    const result: ProcessingResult = {
      totalRows: data.length,
      successCount,
      errorsCount: errors.length,
      duplicatesCount,
      samsungValidationFailures,
      ...(errorFilePath && { errorFilePath })
    }

    logger.info(`📊 Processing completed: ${JSON.stringify(result)}`)
    return result
  }

  private async findExistingDevice(device: Device.Model): Promise<any> {
    return await db.Device.findDevice({
      SIM_number: device.SIM_number,
      IMEI_1: device.IMEI_1,
      device_number: device.device_number,
      serialNumber: device.serialNumber
    })
  }

  private async saveDeviceToDatabase(device: Device.Model): Promise<void> {
    const trx = await this.knex.transaction()
    try {
      await db.Device.createDevice(device, trx)
      await trx.commit()
      logger.debug('Device saved to database successfully')
    } catch (error) {
      await trx.rollback()
      throw error
    }
  }

  private async generateErrorReport(errors: ProcessingError[]): Promise<string | null> {
    if (errors.length === 0) {
      logger.info('✅ No errors to report')
      return null
    }

    const errorRows = errors.map(error => ({
      'מספר שורה': (error.row as any).rowNumber || 'לא ידוע',
      'סוג שגיאה': this.getErrorTypeInHebrew(error.errorType),
      'תיאור השגיאה': error.error,
      'מספר SIM': (error.row as any).sim_number || (error.row as any).SIM_number || (error.row as any).מספר_סים || '',
      'מספר IMEI': (error.row as any).imei || (error.row as any).IMEI_1 || (error.row as any).מספר_IMEI || '',
      'מספר סידורי': (error.row as any).serial_number || (error.row as any).serialNumber || (error.row as any).מספר_סידורי || '',
      'מספר מכשיר': (error.row as any).device_number || (error.row as any).מספר_מכשיר || '',
      ...error.row
    }))

    return await writeErrorsToExcel(errorRows)
  }

  private getErrorTypeInHebrew(errorType: string): string {
    const typeMap: Record<string, string> = {
      'validation': 'שדות חסרים',
      'samsung': 'אימות סמסונג',
      'database': 'שגיאת מסד נתונים',
      'duplicate': 'כפילות'
    }
    return typeMap[errorType] || 'לא ידוע'
  }
}

export { DeviceExcelProcessor, ProcessingResult }
