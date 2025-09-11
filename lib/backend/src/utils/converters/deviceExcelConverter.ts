import { Device } from '@model'
import logger from '../../utils/logger'

interface DeviceExcelRow {
  sim_number?: string | number
  SIM_number?: string | number
  מספר_סים?: string | number
  
  imei?: string | number
  IMEI_1?: string | number
  IMEI?: string | number
  מספר_IMEI?: string | number
  
  serial_number?: string | number
  serialNumber?: string | number
  מספר_סידורי?: string | number
  
  device_number?: string | number
  מספר_מכשיר?: string | number
  device_id?: string | number
}

/**
 * ממיר שורה מקובץ Excel למודל Device
 * תומך במגוון שמות עמודות בעברית ובאנגלית
 */
const convertExcelRowToDevice = (row: DeviceExcelRow): Device.Model => {
  logger.debug('Converting Excel row to Device model:', Object.keys(row))

  // מיפוי גמיש של שדות
  const simNumber = extractFieldValue(row, [
    'sim_number', 'SIM_number', 'מספר_סים'
  ])
  
  const imei = extractFieldValue(row, [
    'imei', 'IMEI_1', 'IMEI', 'מספר_IMEI'
  ])
  
  const serialNumber = extractFieldValue(row, [
    'serial_number', 'serialNumber', 'מספר_סידורי'
  ])
  
  const deviceNumber = extractFieldValue(row, [
    'device_number', 'מספר_מכשיר', 'device_id'
  ])

  return {
    device_id: '', // יוגדר ב-DB
    device_number: String(deviceNumber || '').trim(),
    SIM_number: String(simNumber || '').trim(),
    IMEI_1: String(imei || '').trim(),
    model: '', // יתמלא מאימות סמסונג
    status: 'active',
    serialNumber: String(serialNumber || '').trim(),
    releaseDate: new Date(),
    purchaseDate: null,
    plan: ''
  }
}

/**
 * מחלץ ערך שדה לפי רשימת שמות אפשריים
 */
const extractFieldValue = (row: DeviceExcelRow, fieldNames: string[]): string | number | undefined => {
  for (const fieldName of fieldNames) {
    const value = (row as any)[fieldName]
    if (value !== undefined && value !== null && String(value).trim() !== '') {
      return value
    }
  }
  return undefined
}

/**
 * בודק שכל השדות הנדרשים קיימים
 */
const validateRequiredFields = (device: Device.Model): string[] => {
  const errors: string[] = []
  
  if (!device.SIM_number || device.SIM_number.trim() === '') {
    errors.push('מספר SIM חסר או ריק')
  }
  
  if (!device.IMEI_1 || device.IMEI_1.trim() === '') {
    errors.push('מספר IMEI חסר או ריק')
  }
  
  if (!device.serialNumber || device.serialNumber.trim() === '') {
    errors.push('מספר סידורי חסר או ריק')
  }
  
  if (!device.device_number || device.device_number.trim() === '') {
    errors.push('מספר מכשיר חסר או ריק')
  }
  
  return errors
}

export { 
  convertExcelRowToDevice, 
  validateRequiredFields,
  DeviceExcelRow 
}
