import { HttpError, ValidationTypes, SanitizationUtils } from '.'
import { Request } from 'express'

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

  if (hasId && !customerDevice.customerDevice_id) {
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "customerDevice_id".',
    }
    throw error
  }
  if (!ValidationTypes.isNonEmptyString(customerDevice.customer_id)) {
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "customer_id".',
    }
    throw error
  }
  if (!ValidationTypes.isNonEmptyString(customerDevice.device_id)) {
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
    filterVersion: customerDevice.filterVersion,
    deviceProgram: customerDevice.deviceProgram,
  }

  return newCustomerDevice
}

const sanitizeExistingCustomerDevice = (customerDeviceExis: Model, customerDevice: Model) => {
  if (customerDeviceExis.device_id === customerDevice.device_id) {
    const error: HttpError.Model = {
      status: 409,
      message: 'device_id already exists',
    }
    throw error
  }
}

const sanitizeIdExisting = (req: Request): void => {
  SanitizationUtils.sanitizeIdExisting(req)
}

const sanitizeBodyExisting = (req: Request): void => {
  SanitizationUtils.sanitizeBodyExisting(req)
}

export { Model, sanitize, sanitizeExistingCustomerDevice, sanitizeIdExisting, sanitizeBodyExisting }
