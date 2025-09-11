import { DeviceOnlyExcel } from '@model'

const convertFlatRowToDeviceModel = (row: any): DeviceOnlyExcel.Model => {
  return {
    device: {
      device_id: '',
      device_number: row.device_number || row['מספר מכשיר'] || '',
      SIM_number: row.SIM_number || row['מספר סים'] || '',
      IMEI_1: row.IMEI_1 || row['מספר IMEI'] || row.IMEI || '',
      serialNumber: row.serialNumber || row['מספר סידורי'] || row.serial_number || '',
      model: '', // לא נדרש בקובץ הזה
      status: 'active',
      purchaseDate: null,
      releaseDate: new Date(),
      plan: '', // לא נדרש בקובץ הזה
    }
  }
}

export { convertFlatRowToDeviceModel }
