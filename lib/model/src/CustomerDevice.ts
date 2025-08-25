import { AppError, RequestTypes } from '.'

interface Model {
  customerDevice_id: string
  customer_id: string
  device_id: string
  receivedAt: Date
  planEndDate?: Date
  filterVersion?: '1.7' | '1.8'
  deviceProgram?: '0' | '2'
}

function sanitize(customerDevice: Model, hasId: boolean): Model {
  const isString = (value: unknown): value is string => typeof value === 'string'

  if (hasId && !customerDevice.customerDevice_id) {
    throw new AppError('Invalid or missing "customerDevice_id".', 400)
  }
  if (!isString(customerDevice.customer_id) || customerDevice.customer_id.trim() === '') {
    throw new AppError('Invalid or missing "customer_id".', 400)
  }
  if (!isString(customerDevice.device_id) || customerDevice.device_id.trim() === '') {
    throw new AppError('Invalid or missing "device_id".', 400)
  }
  if (!customerDevice.receivedAt) {
    throw new AppError('Invalid or missing "receivedAt".', 400)
  }

  const newCustomerDevice: Model = {
    customerDevice_id: customerDevice.customerDevice_id,
    customer_id: customerDevice.customer_id,
    device_id: customerDevice.device_id,
    receivedAt: customerDevice.receivedAt,
    planEndDate: customerDevice.planEndDate,
    filterVersion: customerDevice.filterVersion,
    deviceProgram: customerDevice.deviceProgram,
  }

  return newCustomerDevice
}

const sanitizeExistingCustomerDevice = (customerDeviceExis: Model, customerDevice: Model) => {
  if (customerDeviceExis.device_id === customerDevice.device_id) {
    throw new AppError('device_id already exists', 409)
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

export { Model, sanitize, sanitizeExistingCustomerDevice, sanitizeIdExisting, sanitizeBodyExisting }
