import { HttpError, Request } from '.'

interface Model {
  device_id: string
  device_number: string
  SIM_number: string
  IMEI_1: string
  // mehalcha_number: string
  model: string
  status: string // active, inactive, blocked, lock in imei
  serialNumber: string //במסונג?
  registrationDate: Date  //תאריך רישום
  purchaseDate: Date | null //תאריך רכישה
  plan: string //מסלול
  //תאריך רישום המכשיר?? כאן או בטבלה של customerDevice
}

function sanitize(device: Model, hasId: boolean): Model {
  console.log('Sanitizing Device:', device.IMEI_1, 'hasId:', hasId);
  
  if (hasId && !device.device_id) {
    console.log('Device missing device_id');
    
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "device_id".',
    }
    throw error
  }
  if (!device.SIM_number) {
    console.log('Device missing SIM_number');
    
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "SIM_number".',
    }
    throw error
  }
  if (!device.IMEI_1) {
    console.log('Device missing IMEI_1');
    
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "IMEI_1".',
    }
    throw error
  }
  if (!device.model) {
    console.log('Device missing model');
    
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "model".',
    }
    throw error
  }
  if (!device.device_number) {
    console.log('Device missing device_number');
    
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "device_number".',
    }
    throw error
  }
  if (!device.serialNumber) {
    console.log('Device missing serialNumber');
    
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "serialNumber".',
    }
    throw error
  }

  const newDevice: Model = {
    device_id: device.device_id,
    device_number: device.device_number,
    SIM_number: device.SIM_number,
    IMEI_1: device.IMEI_1,
    model: device.model,
    status: device.status || 'active',
    serialNumber: device.serialNumber,
    purchaseDate: device.purchaseDate || null,
    registrationDate: device.registrationDate || new Date(Date.now()),
    plan: device.plan,
  }

  return newDevice
}

const sanitizeExistingDevice = (deviceExis: Model, device: Model) => {
  if (deviceExis.SIM_number === device.SIM_number) {
    const error: HttpError.Model = {
      status: 409,
      message: 'SIM_number already exists',
    }
    throw error
  }
  if (deviceExis.IMEI_1 === device.IMEI_1) {
    const error: HttpError.Model = {
      status: 409,
      message: 'IMEI_1 already exists',
    }
    throw error
  }
  if (deviceExis.serialNumber === device.serialNumber) {
    const error: HttpError.Model = {
      status: 409,
      message: 'serialNumber already exists',
    }
    throw error
  }
}

const sanitizeIdExisting = (req: Request.RequestWithParams) => {
  if (!req.params.id) {
    const error: HttpError.Model = {
      status: 400,
      message: 'No ID provided',
    }
    throw error
  }
}

const sanitizeBodyExisting = (req: Request.RequestWithBody) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    const error: HttpError.Model = {
      status: 400,
      message: 'No body provided',
    }
    throw error
  }
}

export { Model, sanitize, sanitizeExistingDevice, sanitizeIdExisting, sanitizeBodyExisting }
