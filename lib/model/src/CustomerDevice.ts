import { HttpError, Request } from '.'

interface Model {
  customerDevice_id: number
  customer_id: number
  device_id: number
  receivedAt: Date
  planEndDate?: Date | null
}

function sanitize(customerDevice: Model, hasId: boolean): Model {
  const isNumber = (value: unknown) => typeof value === 'number' && !isNaN(value)

  if (hasId && !customerDevice.customerDevice_id) {
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "customerDevice_id".',
    }
    throw error
  }
  if (!isNumber(customerDevice.customer_id)) {
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "customer_id".',
    }
    throw error
  }
  if (!isNumber(customerDevice.device_id)) {
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "device_id".',
    }
    throw error
  }
  if (!customerDevice.receivedAt) {
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "receivedAt".',
    }
    throw error
  }

  const newCustomerDevice: Model = {
    customerDevice_id: customerDevice.customerDevice_id,
    customer_id: customerDevice.customer_id,
    device_id: customerDevice.device_id,
    receivedAt: customerDevice.receivedAt,
    planEndDate: customerDevice.planEndDate,
  }

  return newCustomerDevice
}

const sanitizeExistingCustomerDevice = (customerDeviceExis: Model, customerDevice: Model) => {
  if (customerDeviceExis.customer_id === customerDevice.customer_id && 
      customerDeviceExis.device_id === customerDevice.device_id) {
    const error: HttpError.Model = {
      status: 409,
      message: 'Customer device assignment already exists',
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

export { Model, sanitize, sanitizeExistingCustomerDevice, sanitizeIdExisting, sanitizeBodyExisting }
