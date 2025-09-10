import { HttpError } from '.'

interface Model {
  device_id: string
  device_number: string
  SIM_number: string
  IMEI_1: string
  // mehalcha_number: string
  model: string
  status: string // active, inactive, blocked, lock in imei
  serialNumber: string //במסונג?
  releaseDate: Date  //תאריך הקמה
  purchaseDate: Date | null //תאריך רכישה
  plan: string //מסלול
  //תאריך רישום המכשיר?? כאן או בטבלה של customerDevice
}

function sanitize(device: Model, hasId: boolean): Model {
  if (hasId && !device.device_id) {
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "device_id".',
    }
    throw error
  }
  if (!device.SIM_number) {
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "SIM_number".',
    }
    throw error
  }
  if (!device.IMEI_1) {
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "IMEI_1".',
    }
    throw error
  }
  // if (!device.mehalcha_number) {
  //   const error: HttpError.Model = {
  //     status: 400,
  //     message: 'Invalid or missing "mehalcha_number".',
  //   }
  //   throw error
  // }
  if (!device.model) {
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "model".',
    }
    throw error
  }
  if (!device.device_number) {
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "device_number".',
    }
    throw error
  }
  if (!device.serialNumber) {
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "serialNumber".',
    }
    throw error
  }
  // if (!device.purchaseDate) {
  //   const error: HttpError.Model = {
  //     status: 400,
  //     message: 'Invalid or missing "purchaseDate".',
  //   }
  //   throw error
  // }
  //  if (!device.plan) {
  //   const error: HttpError.Model = {
  //     status: 400,
  //     message: 'Invalid or missing "plan".',
  //   }
  //   throw error
  // }
  // if (!device.releaseDate) {
  //   const error: HttpError.Model = {
  //     status: 400,
  //     message: 'Invalid or missing "releaseDate".',
  //   }
  //   throw error
  // }

  const newDevice: Model = {
    device_id: device.device_id,
    device_number: device.device_number,
    SIM_number: device.SIM_number,
    IMEI_1: device.IMEI_1,
    // mehalcha_number: device.mehalcha_number,
    model: device.model,
    status: device.status || 'active',
    serialNumber: device.serialNumber,
    purchaseDate: device.purchaseDate || null,
    releaseDate: device.releaseDate || new Date(Date.now()),
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
  // if (deviceExis.mehalcha_number === device.mehalcha_number) {
  //   const error: HttpError.Model = {
  //     status: 409,
  //     message: 'mehalcha_number already exists',
  //   }
  //   throw error
  // }
  if (deviceExis.serialNumber === device.serialNumber) {
    const error: HttpError.Model = {
      status: 409,
      message: 'serialNumber already exists',
    }
    throw error
  }
}

const sanitizeIdExisting = (id: any) => {
  if (!id.params.id) {
    const error: HttpError.Model = {
      status: 400,
      message: 'No ID provided',
    }
    throw error
  }
}

const sanitizeBodyExisting = (req: any) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    const error: HttpError.Model = {
      status: 400,
      message: 'No body provided',
    }
    throw error
  }
}

export { Model, sanitize, sanitizeExistingDevice, sanitizeIdExisting, sanitizeBodyExisting }
