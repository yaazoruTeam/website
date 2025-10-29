import { NextFunction, Request, Response } from 'express'
import config from '@config/index'
import * as db from '@db/index'
import { CustomerDevice, HttpError } from '@model'
import { handleError } from './err'

const limit = config.database.limit


const createCustomerDevice = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    CustomerDevice.sanitizeBodyExisting(req)
    const customerDeviceData: CustomerDevice.Model = req.body
    const sanitized: CustomerDevice.Model = CustomerDevice.sanitize(customerDeviceData, false)
    await existingCustomerDevice(sanitized, false)
    const customerDevice = await db.CustomerDevice.createCustomerDevice(sanitized)
    res.status(201).json(customerDevice)
  } catch (error: unknown) {
    handleError(error, next)
  }
}

const getCustomersDevices = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const page = parseInt(req.params.page as string, 10) || 1
    const offset = (page - 1) * limit

    const { customerDevices, total } = await db.CustomerDevice.getCustomersDevices(offset)

    res.status(200).json({
      data: customerDevices,
      page,
      totalPages: Math.ceil(total / limit),
      total,
    })
  } catch (error: unknown) {
    handleError(error, next)
  }
}

const getCustomerDeviceById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    CustomerDevice.sanitizeIdExisting(req)
    const existCustomerDevice = await db.CustomerDevice.doesCustomerDeviceExist(req.params.id)
    if (!existCustomerDevice) {
      const error: HttpError.Model = {
        status: 404,
        message: 'CustomerDevice does not exist.',
      }
      throw error
    }
    const customerDevice = await db.CustomerDevice.getCustomerDeviceById(req.params.id)
    res.status(200).json(customerDevice)
  } catch (error: unknown) {
    handleError(error, next)
  }
}

const getAllDevicesByCustomerId = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const page = parseInt(req.params.page as string, 10) || 1
    const offset = (page - 1) * limit

    CustomerDevice.sanitizeIdExisting(req)
    const existCustomer = await db.Customer.doesCustomerExist(req.params.id)
    if (!existCustomer) {
      const error: HttpError.Model = {
        status: 404,
        message: 'Customer does not exist.',
      }
      throw error
    }
    const { customerDevices, total } = await db.CustomerDevice.getCustomerDeviceByCustomerId(
      req.params.id,
      offset,
    )
    res.status(200).json({
      data: customerDevices,
      page,
      totalPages: Math.ceil(total / limit),
      total,
    })
  } catch (error: unknown) {
    handleError(error, next)
  }
}

const getCustomerIdByDeviceId = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const page = parseInt(req.params.page as string, 10) || 1
    const offset = (page - 1) * limit

    CustomerDevice.sanitizeIdExisting(req)
    const device_id = req.params.id
    const deviceExist = await db.Device.doesDeviceExist(device_id)
    if (!deviceExist) {
      const error: HttpError.Model = {
        status: 404,
        message: 'device does not exist.',
      }
      throw error
    }
    const { customerDevices, total } = await db.CustomerDevice.getCustomerDeviceByDeviceId(
      device_id,
      offset,
    )
    res.status(200).json({
      data: customerDevices,
      page,
      totalPages: Math.ceil(total / limit),
      total,
    })
  } catch (error: unknown) {
    handleError(error, next)
  }
}

const updateCustomerDevice = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    CustomerDevice.sanitizeIdExisting(req)
    CustomerDevice.sanitizeBodyExisting(req)
    const sanitized = CustomerDevice.sanitize(req.body, true)
    await existingCustomerDevice(sanitized, true)
    const updateCustomerDevice = await db.CustomerDevice.updateCustomerDevice(
      req.params.id,
      sanitized,
    )
    res.status(200).json(updateCustomerDevice)
  } catch (error: unknown) {
    handleError(error, next)
  }
}

const deleteCustomerDevice = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    CustomerDevice.sanitizeIdExisting(req)
    const existCustomerDevice = await db.CustomerDevice.doesCustomerDeviceExist(req.params.id)
    if (!existCustomerDevice) {
      const error: HttpError.Model = {
        status: 404,
        message: 'CustomerDevice does not exist.',
      }
      throw error
    }
    const deleteCustomerDevice = await db.CustomerDevice.deleteCustomerDevice(req.params.id)
    res.status(200).json(deleteCustomerDevice)
  } catch (error: unknown) {
    handleError(error, next)
  }
}

const existingCustomerDevice = async (customerDevice: CustomerDevice.Model, hasId: boolean) => {
  try {
    const customerExist = await db.Customer.doesCustomerExist(customerDevice.customer_id)
    if (!customerExist) {
      const error: HttpError.Model = {
        status: 404,
        message: 'customer does not exist.',
      }
      throw error
    }
    const deviceExist = await db.Device.doesDeviceExist(customerDevice.device_id)
    if (!deviceExist) {
      const error: HttpError.Model = {
        status: 404,
        message: 'device does not exist.',
      }
      throw error
    }
    let customerDeviceEx
    if (hasId) {
      customerDeviceEx = await db.CustomerDevice.findCustomerDevice({
        customerDevice_id: customerDevice.customerDevice_id,
        device_id: customerDevice.device_id,
      })
    } else {
      customerDeviceEx = await db.CustomerDevice.findCustomerDevice({
        device_id: customerDevice.device_id,
      })
    }
    if (customerDeviceEx) {
      try {
        CustomerDevice.sanitizeExistingCustomerDevice(customerDeviceEx, customerDevice)
      } catch (err) {
        throw err
      }
    }
  } catch (err) {
    throw err
  }
}

export {
  createCustomerDevice,
  getCustomersDevices,
  getCustomerDeviceById,
  updateCustomerDevice,
  deleteCustomerDevice,
  getAllDevicesByCustomerId,
  getCustomerIdByDeviceId,
}
