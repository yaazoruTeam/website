import { AppError, RequestTypes } from '.'

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
    throw new AppError('Invalid or missing "device_id".', 400)
  }
  if (!device.SIM_number) {
    throw new AppError('Invalid or missing "SIM_number".', 400)
  }
  if (!device.IMEI_1) {
    throw new AppError('Invalid or missing "IMEI_1".', 400)
  }
  if (!device.mehalcha_number) {
    throw new AppError('Invalid or missing "mehalcha_number".', 400)
  }
  if (!device.model) {
    throw new AppError('Invalid or missing "model".', 400)
  }
  if (!device.device_number) {
    throw new AppError('Invalid or missing "device_number".', 400)
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
    throw new AppError('SIM_number already exists', 409)
  }
  if (deviceExis.IMEI_1 === device.IMEI_1) {
    throw new AppError('IMEI_1 already exists', 409)
  }
  if (deviceExis.mehalcha_number === device.mehalcha_number) {
    throw new AppError('mehalcha_number already exists', 409)
  }
}

const sanitizeIdExisting = (req: RequestTypes.RequestWithParams) => {
  if (!req.params.id) {
    throw new AppError('No ID provided', 400)
  }
}

const sanitizeBodyExisting = (req: RequestTypes.RequestWithBody) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    throw new AppError('No body provided', 400)
  }
}

export { Model, sanitize, sanitizeExistingDevice, sanitizeIdExisting, sanitizeBodyExisting }
