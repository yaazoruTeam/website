/**
 * BaseExcelService - פונקציות בסיס לעיבוד קבצי Excel
 * מכיל פונקציות משותפות שיכולות להיות בשימוש על ידי כל שירותי Excel
 */

import getDbConnection from '@db/connection'
import * as db from '@db/index'
import { Device } from '@model'
import { Knex } from 'knex'
import logger from '../../utils/logger'

export interface ExcelRowData {
  [key: string]: unknown
}

export interface ProcessError {
  row: number
  error: string
  data: ExcelRowData
}

export interface ProcessingResult {
  totalRows: number
  errorsCount: number
  successCount: number
  errorFilePath?: string
}

/**
 * פונקציה בסיסית לוולידציה של שורת נתונים
 * מקבלת גם numbers מ-Excel בנוסף ל-strings
 */
export const validateRowData = (rowData: ExcelRowData, requiredFields: string[]): boolean => {
  return requiredFields.every(field => {
    const value = rowData[field]
    
    // בדיקה שהערך קיים ואינו null/undefined
    if (value === undefined || value === null) return false
    
    // מקבל גם strings וגם numbers (נפוץ ב-Excel)
    if (typeof value !== 'string' && typeof value !== 'number') return false
    
    // המרה ל-string ובדיקה שאינו ריק
    const stringValue = String(value).trim()
    return stringValue !== '' && stringValue !== 'undefined' && stringValue !== 'null'
  })
}

/**
 * פונקציה בסיסית לחישוב אחוז הצלחה
 */
export const calculateSuccessRate = (successCount: number, totalRows: number): string => {
  if (totalRows === 0) return '0%'
  return `${Math.round((successCount / totalRows) * 100)}%`
}

/**
 * פונקציה בסיסית לבניית תוצאות עיבוד
 */
export const buildProcessingResult = (
  totalRows: number,
  successCount: number,
  errors: ProcessError[],
  errorFilePath?: string
): ProcessingResult => {
  return {
    totalRows,
    errorsCount: errors.length,
    successCount,
    ...(errorFilePath && { errorFilePath })
  }
}

/**
 * פונקציה לכתיבת שגיאות לקובץ Excel - מוגדרת כאן לשימוש עתידי
 * @param errors - מערך שגיאות
 * @param routeName - שם המסלול לשם הקובץ
 */
export const createErrorFileName = (routeName: string): string => {
  const timestamp = new Date().toISOString().split('T')[0] // YYYY-MM-DD
  const timeStamp = new Date().toISOString().replace(/[:.]/g, '-')
  return `errors_${routeName}_${timestamp}_${timeStamp}.xlsx`
}

/**
 * יוצר מכשיר חדש במסד הנתונים אם הוא לא קיים
 * זורק שגיאה אם המכשיר כבר קיים - להימנעות מכפילויות
 * @param deviceModel - מודל המכשיר ליצירה
 * @param trx - טרנזקציה אופציונלית
 * @returns המכשיר החדש שנוצר
 * @throws Error אם המכשיר כבר קיים (עם פרטי השדות הכפולים)
 */
export const createDeviceIfNotExists = async (deviceModel: Device.Model, trx?: Knex.Transaction): Promise<Device.Model> => {
  logger.info(`🔍 Checking if device exists:`, {
    SIM_number: deviceModel.SIM_number,
    IMEI_1: deviceModel.IMEI_1,
    device_number: deviceModel.device_number,
    serialNumber: deviceModel.serialNumber
  })

  let existDevice = await db.Device.findDevice({
    SIM_number: deviceModel.SIM_number,
    IMEI_1: deviceModel.IMEI_1,
    device_number: deviceModel.device_number,
    serialNumber: deviceModel.serialNumber,
  })

  if (existDevice) {
    // אם המכשיר קיים - זו שגיאה!
    logger.error(`❌ Device already exists in database!`)
    logger.error('Existing device details:', existDevice)
    
    // בדיקה איזה שדה גורם לכפילות
    let conflictFields = []
    if (existDevice.SIM_number === deviceModel.SIM_number) {
      conflictFields.push(`SIM_number: ${deviceModel.SIM_number}`)
    }
    if (existDevice.IMEI_1 === deviceModel.IMEI_1) {
      conflictFields.push(`IMEI_1: ${deviceModel.IMEI_1}`)
    }
    if (existDevice.device_number === deviceModel.device_number) {
      conflictFields.push(`device_number: ${deviceModel.device_number}`)
    }
    if (existDevice.serialNumber === deviceModel.serialNumber) {
      conflictFields.push(`serialNumber: ${deviceModel.serialNumber}`)
    }
    
    throw new Error(`Device already exists with duplicate unique fields: ${conflictFields.join(', ')}. Existing device ID: ${existDevice.device_id}`)
  }

  // המכשיר לא קיים - ניצור חדש
  logger.info('📱 Device not found in DB - creating new device...')
  try {
    existDevice = await db.Device.createDevice(deviceModel, trx)
    logger.info(`✅ Device created successfully with ID: ${existDevice.device_id}`)
    return existDevice
  } catch (createError) {
    logger.error(`❌ Failed to create device:`, createError)
    throw createError
  }
}