import { HttpError } from '.'
import { Request } from 'express'

interface Model {
  device_id: string
  device_number: string
  SIM_number: string
  IMEI_1: string
  mehalcha_number: string
  model: string
  status: string
  isDonator: boolean
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
  if (!device.mehalcha_number) {
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "mehalcha_number".',
    }
    throw error
  }
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

  const newDevice: Model = {
    device_id: device.device_id,
    device_number: device.device_number,
    SIM_number: device.SIM_number,
    IMEI_1: device.IMEI_1,
    mehalcha_number: device.mehalcha_number,
    model: device.model,
    status: device.status || 'active',
    isDonator: device.isDonator,
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
  if (deviceExis.mehalcha_number === device.mehalcha_number) {
    const error: HttpError.Model = {
      status: 409,
      message: 'mehalcha_number already exists',
    }
    throw error
  }
}

const sanitizeIdExisting = (req: Request): void => {
  if (!req.params.id) {
    const error: HttpError.Model = {
      status: 400,
      message: 'No ID provided',
    }
    throw error
  }
}

const sanitizeBodyExisting = (req: Request): void => {
  if (!req.body || Object.keys(req.body).length === 0) {
    const error: HttpError.Model = {
      status: 400,
      message: 'No body provided',
    }
    throw error
  }
}

export { Model, sanitize, sanitizeExistingDevice, sanitizeIdExisting, sanitizeBodyExisting }
