import { Device, HttpError } from '.'

interface Model {
  device: Device.Model
}

const sanitize = (deviceOnlyExcel: Model): Model => {
  try {
    // בדיקה שיש מכשיר
    if (!deviceOnlyExcel.device) {
      const error: HttpError.Model = {
        status: 400,
        message: 'Device is undefined in the input object.',
      }
      throw error
    }

    // בדיקת שדות חובה למכשיר
    const device = deviceOnlyExcel.device
    
    if (!device.SIM_number || device.SIM_number.toString().trim() === '') {
      const error: HttpError.Model = {
        status: 400,
        message: 'SIM number is required and cannot be empty.',
      }
      throw error
    }

    if (!device.IMEI_1 || device.IMEI_1.toString().trim() === '') {
      const error: HttpError.Model = {
        status: 400,
        message: 'IMEI number is required and cannot be empty.',
      }
      throw error
    }

    if (!device.serialNumber || device.serialNumber.toString().trim() === '') {
      const error: HttpError.Model = {
        status: 400,
        message: 'Serial number is required and cannot be empty.',
      }
      throw error
    }

    if (!device.device_number || device.device_number.toString().trim() === '') {
      const error: HttpError.Model = {
        status: 400,
        message: 'Device number is required and cannot be empty.',
      }
      throw error
    }

    return {
      ...deviceOnlyExcel,
      device: Device.sanitize(deviceOnlyExcel.device, false),
    }
  } catch (error: any) {
    console.error('Device sanitize failed:', error.message)
    throw error
  }
}

export { Model, sanitize }
