import { NextFunction, Request, Response } from 'express'
import config from '@config/index'
import { CustomerDevice, HttpError } from '@model'
import { customerRepository } from '@repositories/CustomerRepository'
import { handleError } from './err'
import { customerDeviceRepository, deviceRepository } from '../repositories'
import logger from '../utils/logger'

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
    const customerDevice = await customerDeviceRepository.createCustomerDevice(sanitized)
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

    const { customerDevices, total } = await customerDeviceRepository.getCustomerDevices(offset)

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
    const customerDevice = await customerDeviceRepository.getCustomerDeviceById(Number(req.params.id))
    if (!customerDevice) {
      const error: HttpError.Model = {
        status: 404,
        message: 'CustomerDevice does not exist.',
      }
      throw error
    }
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
    logger.debug(`Getting devices for customer ID: ${req.params.id} with offset: ${offset}`)
    CustomerDevice.sanitizeIdExisting(req)
    const customer = await customerRepository.getCustomerById(parseInt(req.params.id))
    logger.debug(`Customer fetched: ${JSON.stringify(customer)}`)
    if (!customer) {
      const error: HttpError.Model = {
        status: 404,
        message: 'Customer does not exist.',
      }
      throw error
    }
    const { customerDevices, total } = await customerDeviceRepository.getCustomerDeviceByCustomerId(
      Number(req.params.id),
      offset,
    )
    logger.debug(`Devices fetched: ${JSON.stringify(customerDevices)}`)
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
    const deviceExist = await deviceRepository.doesDeviceExist(Number(device_id))
    if (!deviceExist) {
      const error: HttpError.Model = {
        status: 404,
        message: 'device does not exist.',
      }
      throw error
    }
    const { customerDevices, total } = await customerDeviceRepository.getCustomerDeviceByDeviceId(
      Number(device_id),
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
    const updateCustomerDevice = await customerDeviceRepository.updateCustomerDevice(
      Number(req.params.id),
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
    const existCustomerDevice = await customerDeviceRepository.getCustomerDeviceById(Number(req.params.id))
    if (!existCustomerDevice) {
      const error: HttpError.Model = {
        status: 404,
        message: 'CustomerDevice does not exist.',
      }
      throw error
    }
    const deleteCustomerDevice = await customerDeviceRepository.deleteCustomerDevice(Number(req.params.id))
    res.status(200).json(deleteCustomerDevice)
  } catch (error: unknown) {
    handleError(error, next)
  }
}

const existingCustomerDevice = async (customerDevice: CustomerDevice.Model, hasId: boolean) => {
  try {
    const customer = await customerRepository.getCustomerById(Number(customerDevice.customer_id))
    if (!customer) {
      const error: HttpError.Model = {
        status: 404,
        message: 'customer does not exist.',
      }
      throw error
    }
    const deviceExist = await deviceRepository.doesDeviceExist(Number(customerDevice.device_id))
    if (!deviceExist) {
      const error: HttpError.Model = {
        status: 404,
        message: 'device does not exist.',
      }
      throw error
    }
    let customerDeviceEx
    if (hasId) {
      customerDeviceEx = await customerDeviceRepository.findExistingCustomerDevice ({
        customerDevice_id: customerDevice.customerDevice_id,
        device_id: customerDevice.device_id,
      })
    } else {
      customerDeviceEx = await customerDeviceRepository.findExistingCustomerDevice ({
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
