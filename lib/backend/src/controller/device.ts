import { NextFunction, Request, Response } from 'express'
import * as db from '@db/index'
import { Device, HttpError } from '@model'
import config from '@config/index'
import { handleError } from './err'
import logger from '@/src/utils/logger'

const limit = config.database.limit

const createDevice = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    logger.info('Creating a new device')
    Device.sanitizeBodyExisting(req)
    const deviceData = req.body
    const sanitized = Device.sanitize(deviceData, false)
    await existingDevice(sanitized, false)
    logger.debug(`Sanitized device data: ${JSON.stringify(sanitized)}`)
    const device = await db.Device.createDevice(sanitized)
    logger.info(`Device created with ID: ${device.device_id}`)
    res.status(201).json(device)
  } catch (error: unknown) {
    handleError(error, next)
  }
}

const getDevices = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = parseInt(req.params.page as string, 10) || 1
    const offset = (page - 1) * limit

    const { devices, total } = await db.Device.getDevices(offset)

    res.status(200).json({
      data: devices,
      page,
      totalPages: Math.ceil(total / limit),
      total,
    })
  } catch (error: unknown) {
    handleError(error, next)
  }
}

const getDeviceById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    Device.sanitizeIdExisting(req)
    const existDevice = await db.Device.doesDeviceExist(req.params.id)
    if (!existDevice) {
      const error: HttpError.Model = {
        status: 404,
        message: 'Device does not exist.',
      }
      throw error
    }
    const device = await db.Device.getDeviceById(req.params.id)
    res.status(200).json(device)
  } catch (error: unknown) {
    handleError(error, next)
  }
}

const getDevicesByStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { status } = req.params
    if (status !== 'active' && status !== 'inactive') {
      const error: HttpError.Model = {
        status: 400,
        message: "Invalid status. Allowed values: 'active' or 'inactive'.",
      }
      throw error
    }
    const page = parseInt(req.params.page as string, 10) || 1
    const offset = (page - 1) * limit

    const { devices, total } = await db.Device.getDevicesByStatus(status, offset)

    res.status(200).json({
      data: devices,
      page,
      totalPages: Math.ceil(total / limit),
      total,
    })
  } catch (error: unknown) {
    handleError(error, next)
  }
}

const updateDevice = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    Device.sanitizeIdExisting(req)
    Device.sanitizeBodyExisting(req)
    const sanitized = Device.sanitize(req.body, true)
    await existingDevice(sanitized, true)
    const updateDevice = await db.Device.updateDevice(req.params.id, sanitized)
    res.status(200).json(updateDevice)
  } catch (error: unknown) {
    handleError(error, next)
  }
}

const deleteDevice = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    Device.sanitizeIdExisting(req)
    const existDevice = await db.Device.doesDeviceExist(req.params.id)
    if (!existDevice) {
      const error: HttpError.Model = {
        status: 404,
        message: 'Device does not exist.',
      }
      throw error
    }
    const deleteDevice = await db.Device.deleteDevice(req.params.id)
    res.status(200).json(deleteDevice)
  } catch (error: unknown) {
    handleError(error, next)
  }
}

const existingDevice = async (device: Device.Model, hasId: boolean) => {
  try {
    let deviceEx
    if (hasId) {
      deviceEx = await db.Device.findDevice({
        device_id: device.device_id,
        SIM_number: device.SIM_number,
        IMEI_1: device.IMEI_1,
        device_number: device.device_number,
        serialNumber: device.serialNumber,
      })
    } else {
      deviceEx = await db.Device.findDevice({
        SIM_number: device.SIM_number,
        IMEI_1: device.IMEI_1,
        device_number: device.device_number,
        serialNumber: device.serialNumber,
      })
    }
    if (deviceEx) {
      try {
        Device.sanitizeExistingDevice(deviceEx, device)
      } catch (err) {
        throw err
      }
    }
  } catch (err) {
    throw err
  }
}

export { createDevice, getDevices, getDeviceById, getDevicesByStatus, updateDevice, deleteDevice }
