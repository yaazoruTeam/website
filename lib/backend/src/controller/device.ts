import { NextFunction, Request, Response } from 'express'
import { deviceRepository } from '@repositories'
import { Device, HttpError, DeviceStatus } from '@model'
import config from '@config/index'
import { handleError } from './err'
import logger from '@/src/utils/logger'

const limit = config.database.limit

/**
 * Create a new device
 * POST /devices
 */
const createDevice = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    logger.info('[Controller] Creating a new device')
    Device.sanitizeBodyExisting(req)

    const deviceData = req.body
    const sanitized = Device.sanitize(deviceData, false)

    // Check for existing device with duplicate unique fields
    await checkExistingDevice(sanitized, false)

    logger.debug(`[Controller] Sanitized device data:`, sanitized)

    const device = await deviceRepository.createDevice(sanitized as any)

    logger.info(`[Controller] Device created with ID: ${device.device_id}`)
    res.status(201).json(device)
  } catch (error: unknown) {
    handleError(error, next)
  }
}

/**
 * Get all devices with pagination
 * GET /devices?page=1
 */
const getDevices = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    logger.debug('[Controller] Fetching devices with pagination')

    const page = parseInt(req.params.page as string, 10) || 1
    if (page < 1) {
      throw { status: 400, message: 'Page must be greater than 0' }
    }

    const offset = (page - 1) * limit
    const { devices, total } = await deviceRepository.getDevices(offset)

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

/**
 * Get device by ID
 * GET /devices/:id
 */
const getDeviceById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    logger.debug('[Controller] Fetching device by ID', { device_id: req.params.id })

    Device.sanitizeIdExisting(req)

    const device_id = parseInt(req.params.id, 10)
    if (isNaN(device_id)) {
      throw { status: 400, message: 'Invalid device ID' }
    }

    const existDevice = await deviceRepository.doesDeviceExist(device_id)
    if (!existDevice) {
      const error: HttpError.Model = {
        status: 404,
        message: 'Device does not exist.',
      }
      throw error
    }

    const device = await deviceRepository.getDeviceById(device_id)
    res.status(200).json(device)
  } catch (error: unknown) {
    handleError(error, next)
  }
}

/**
 * Get devices by status with pagination
 * GET /devices/status/:status?page=1
 */
const getDevicesByStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { status } = req.params
    logger.debug('[Controller] Fetching devices by status', { status })

    // Validate status
    const validStatuses = Object.values(DeviceStatus)
    if (!validStatuses.includes(status as DeviceStatus)) {
      const error: HttpError.Model = {
        status: 400,
        message: `Invalid status. Allowed values: ${validStatuses.join(', ')}.`,
      }
      throw error
    }

    const page = parseInt(req.params.page as string, 10) || 1
    if (page < 1) {
      throw { status: 400, message: 'Page must be greater than 0' }
    }

    const offset = (page - 1) * limit
    const { devices, total } = await deviceRepository.getDevicesByStatus(
      status as DeviceStatus,
      offset,
    )

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

/**
 * Update device
 * PATCH /devices/:id
 */
const updateDevice = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    logger.debug('[Controller] Updating device', { device_id: req.params.id })

    Device.sanitizeIdExisting(req)
    Device.sanitizeBodyExisting(req)

    const device_id = parseInt(req.params.id, 10)
    if (isNaN(device_id)) {
      throw { status: 400, message: 'Invalid device ID' }
    }

    const sanitized = Device.sanitize(req.body, true)

    // Check for existing device with duplicate unique fields
    await checkExistingDevice({ ...sanitized, device_id }, false)

    const updatedDevice = await deviceRepository.updateDevice(device_id, sanitized as any)
    res.status(200).json(updatedDevice)
  } catch (error: unknown) {
    handleError(error, next)
  }
}

/**
 * Delete device (soft delete - marks as inactive)
 * DELETE /devices/:id
 */
const deleteDevice = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    logger.debug('[Controller] Deleting device', { device_id: req.params.id })

    Device.sanitizeIdExisting(req)

    const device_id = parseInt(req.params.id, 10)
    if (isNaN(device_id)) {
      throw { status: 400, message: 'Invalid device ID' }
    }

    const existDevice = await deviceRepository.doesDeviceExist(device_id)
    if (!existDevice) {
      const error: HttpError.Model = {
        status: 404,
        message: 'Device does not exist.',
      }
      throw error
    }

    const deletedDevice = await deviceRepository.deleteDevice(device_id)
    res.status(200).json(deletedDevice)
  } catch (error: unknown) {
    handleError(error, next)
  }
}

/**
 * Check if device with same unique fields already exists
 * Used before create/update to prevent duplicate constraint violations
 */
const checkExistingDevice = async (device: Device.Model, isUpdate: boolean) => {
  try {
    logger.debug('[Controller] Checking for existing device with duplicate fields', {
      isUpdate,
      IMEI_1: device.IMEI_1,
    })

    const existingDevice = await deviceRepository.findExistingDevice({
      device_id: isUpdate ? device.device_id : undefined,
      SIM_number: device.SIM_number,
      IMEI_1: device.IMEI_1,
      device_number: device.device_number,
      serialNumber: device.serialNumber,
    })

    if (existingDevice) {
      logger.warn('[Controller] Found existing device with duplicate unique fields', {
        existing_id: existingDevice.device_id,
      })

      // Use the Device model validation function
      try {
        Device.sanitizeExistingDevice(existingDevice, device)
      } catch (err) {
        throw err
      }
    }
  } catch (err) {
    throw err
  }
}

export { createDevice, getDevices, getDeviceById, getDevicesByStatus, updateDevice, deleteDevice }
