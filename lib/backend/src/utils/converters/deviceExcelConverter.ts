import { DeviceStatus } from '@/src/entities'
import { Device } from '@model'

/**
 * ממיר נתוני שורה שטוחה למודל מכשיר
 * מטפל גם במספרים שמגיעים מ-Excel וממיר אותם ל-strings
 * @param row - שורה מ-Excel עם נתוני מכשיר
 * @returns אובייקט מכשיר במבנה הנדרש למסד הנתונים
 */
const convertFlatRowToDeviceModel = (row: Record<string, unknown>): Device.Model => {
  // פונקציה עזר להמרת ערכים ל-string (מטפלת גם ב-numbers מ-Excel)
  const toSafeString = (value: unknown): string => {
    if (value === undefined || value === null) return ''
    return String(value).trim()
  }

  return {
    device_number: toSafeString(row.device_number),
    // SIM_number: toSafeString(row.SIM_number),
    IMEI_1: toSafeString(row.IMEI_1),
    model: toSafeString(row.model),
    // status: (row.status as DeviceStatus) || DeviceStatus.ACTIVE,
    serialNumber: toSafeString(row.serialNumber),
    // purchaseDate: null,
    // registrationDate: new Date(),
    // plan: toSafeString(row.plan),
  }
}

export { convertFlatRowToDeviceModel }