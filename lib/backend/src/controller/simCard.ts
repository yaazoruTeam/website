import { NextFunction, Request, Response } from 'express'
import { simCardRepository, deviceRepository } from '@repositories'
import { SimCard, Device, HttpError } from '@model'
import config from '@config/index'
import { handleError } from './err'
import logger from '@/src/utils/logger'
import { AppDataSource } from '@/src/data-source'

const limit = config.database.limit

/**
 * Create a new SIM card
 * POST /sim-cards
 * Body: {simNumber, customer_id?, device_id?, receivedAt?, planEndDate?}
 * Note: receivedAt will be set only when linking device to customer
 */
const createSimCard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    logger.info('[Controller] Creating a new SIM card')
    SimCard.sanitizeBodyExisting(req)

    const simCardData = req.body
    const sanitized = SimCard.sanitize(simCardData, false)

    // Check for existing SIM card with duplicate unique fields
    await checkExistingSimCard(sanitized, false)

    logger.debug('[Controller] Sanitized SIM card data:', sanitized)
logger.debug('Sanitized SIM card data:', sanitized);
    const simCard = await simCardRepository.createSimCard(sanitized as any)

    logger.info(`[Controller] SIM card created with ID: ${simCard.simCard_id}`)
    res.status(201).json(simCard)
  } catch (error: unknown) {
    handleError(error, next)
  }
}

/**
 * Get all SIM cards with pagination
 * GET /sim-cards?page=1
 */
const getSimCards = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    logger.debug('[Controller] Fetching SIM cards with pagination')

    const page = parseInt(req.params.page as string, 10) || 1
    if (page < 1) {
      throw { status: 400, message: 'Page must be greater than 0' }
    }

    const offset = (page - 1) * limit
    const { simCards, total } = await simCardRepository.getSimCards(offset, {
      customer: true,
      device: true,
    })

    res.status(200).json({
      data: simCards,
      page,
      totalPages: Math.ceil(total / limit),
      total,
    })
  } catch (error: unknown) {
    handleError(error, next)
  }
}

/**
 * Get all SIM cards with joined device information and pagination
 * GET /sim-cards/with-devices/page/:page
 */
const getSimCardsWithDevices = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    logger.debug('[Controller] Fetching SIM cards with joined devices')

    const page = parseInt(req.params.page as string, 10) || 1
    if (page < 1) {
      throw { status: 400, message: 'Page must be greater than 0' }
    }

    const offset = (page - 1) * limit
    const { simCards, total } = await simCardRepository.getSimCardsWithDevices(offset)

    res.status(200).json({
      data: simCards,
      page,
      totalPages: Math.ceil(total / limit),
      total,
    })
  } catch (error: unknown) {
    handleError(error, next)
  }
}

/**
 * Get SIM card by ID
 * GET /sim-cards/:id
 */
const getSimCardById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    logger.debug('[Controller] Fetching SIM card by ID', { simCard_id: req.params.id })

    SimCard.sanitizeIdExisting(req)

    const simCard_id = req.params.id

    const existSimCard = await simCardRepository.doesSimCardExist(Number(simCard_id))
    if (!existSimCard) {
      const error: HttpError.Model = {
        status: 404,
        message: 'SIM card does not exist.',
      }
      throw error
    }

    const simCard = await simCardRepository.getSimCardById(Number(simCard_id), {
      customer: true,
      device: true,
    })

    res.status(200).json(simCard)
  } catch (error: unknown) {
    handleError(error, next)
  }
}

/**
 * Get SIM card by SIM number
 * GET /sim-cards/number/:simNumber
 */
const getSimCardByNumber = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    logger.debug('[Controller] Fetching SIM card by number', { simNumber: req.params.simNumber })

    const simNumber = req.params.simNumber as string

    if (!simNumber || simNumber.trim() === '') {
      throw { status: 400, message: 'SIM number is required' }
    }

    const simCard = await simCardRepository.getSimCardByNumber(simNumber, {
      customer: true,
      device: true,
    })

    if (!simCard) {
      const error: HttpError.Model = {
        status: 404,
        message: 'SIM card with this number does not exist.',
      }
      throw error
    }

    res.status(200).json(simCard)
  } catch (error: unknown) {
    handleError(error, next)
  }
}

/**
 * Get all SIM cards for a specific customer
 * GET /sim-cards/customer/:customer_id?page=1
 */
const getSimCardsByCustomerId = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    logger.debug('[Controller] Fetching SIM cards by customer ID', { customer_id: req.params.customer_id })

    const customer_id = parseInt(req.params.customer_id as string, 10)
    const page = parseInt(req.params.page as string, 10) || 1

    if (isNaN(customer_id)) {
      throw { status: 400, message: 'Customer ID must be a valid number' }
    }

    if (page < 1) {
      throw { status: 400, message: 'Page must be greater than 0' }
    }

    const offset = (page - 1) * limit
    const { simCards, total } = await simCardRepository.getSimCardsByCustomerId(customer_id, offset, {
      device: true,
    })

    res.status(200).json({
      data: simCards,
      page,
      totalPages: Math.ceil(total / limit),
      total,
      customer_id,
    })
  } catch (error: unknown) {
    handleError(error, next)
  }
}

/**
 * Get SIM card by device ID (one-to-one relationship)
 * GET /sim-cards/device/:device_id
 */
const getSimCardByDeviceId = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    logger.debug('[Controller] Fetching SIM card by device ID', { device_id: req.params.device_id })

    const device_id = parseInt(req.params.device_id as string, 10)

    if (isNaN(device_id)) {
      throw { status: 400, message: 'Device ID must be a valid number' }
    }

    const simCard = await simCardRepository.getSimCardByDeviceId(device_id, {
      customer: true,
    })

    if (!simCard) {
      const error: HttpError.Model = {
        status: 404,
        message: 'SIM card for this device does not exist.',
      }
      throw error
    }

    res.status(200).json(simCard)
  } catch (error: unknown) {
    handleError(error, next)
  }
}

/**
 * Update SIM card
 * PATCH /sim-cards/:id
 */
const updateSimCard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    logger.debug('[Controller] Updating SIM card', { simCard_id: req.params.id })

    SimCard.sanitizeIdExisting(req)
    SimCard.sanitizeBodyExisting(req)

    const simCard_id = Number(req.params.id)
    // Add simCard_id to body for sanitization
    const bodyWithId = { ...req.body, simCard_id }
    const sanitized: SimCard.Model = SimCard.sanitize(bodyWithId, true)

    // Check for existing SIM card with duplicate unique fields
    await checkExistingSimCard({ ...sanitized, simCard_id }, true)

    const updatedSimCard = await simCardRepository.updateSimCard(simCard_id, sanitized as any)
    res.status(200).json(updatedSimCard)
  } catch (error: unknown) {
    handleError(error, next)
  }
}

/**
 * Update SIM card plan end date only
 * PATCH /sim-cards/:id/plan-end-date
 * Body: {planEndDate: Date}
 */
const updatePlanEndDate = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    logger.debug('[Controller] Updating plan end date for SIM card', {
      simCard_id: req.params.id,
    })

    SimCard.sanitizeIdExisting(req)

    const simCard_id = req.params.id
    const { planEndDate } = req.body

    if (!planEndDate) {
      throw { status: 400, message: 'planEndDate is required' }
    }

    const dateObj = new Date(planEndDate)
    if (isNaN(dateObj.getTime())) {
      throw { status: 400, message: 'Invalid date format for planEndDate' }
    }

    const updatedSimCard = await simCardRepository.updatePlanEndDate(Number(simCard_id), dateObj)
    res.status(200).json(updatedSimCard)
  } catch (error: unknown) {
    handleError(error, next)
  }
}

/**
 * Delete (soft delete) SIM card - marks as inactive
 * DELETE /sim-cards/:id
 * Does not remove record, only changes status to INACTIVE
 */
const deleteSimCard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    logger.debug('[Controller] Deleting SIM card', { simCard_id: req.params.id })

    SimCard.sanitizeIdExisting(req)

    const simCard_id = req.params.id

    const existSimCard = await simCardRepository.doesSimCardExist(Number(simCard_id))
    if (!existSimCard) {
      const error: HttpError.Model = {
        status: 404,
        message: 'SIM card does not exist.',
      }
      throw error
    }

    const deletedSimCard = await simCardRepository.deleteSimCard(Number(simCard_id))
    res.status(200).json(deletedSimCard)
  } catch (error: unknown) {
    handleError(error, next)
  }
}

/**
 * Get SIM cards expiring soon
 * GET /sim-cards/expiring?days=30&page=1
 */
const getExpiringSimCards = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    logger.debug('[Controller] Fetching expiring SIM cards')

    const daysFromNow = parseInt(req.query.days as string, 10) || 30
    const page = parseInt(req.params.page as string, 10) || 1

    if (daysFromNow < 1) {
      throw { status: 400, message: 'Days must be greater than 0' }
    }

    if (page < 1) {
      throw { status: 400, message: 'Page must be greater than 0' }
    }

    const offset = (page - 1) * limit
    const { simCards, total } = await simCardRepository.getExpiringSimCards(
      daysFromNow,
      offset,
      { customer: true, device: true },
    )

    res.status(200).json({
      data: simCards,
      page,
      totalPages: Math.ceil(total / limit),
      total,
      daysFromNow,
    })
  } catch (error: unknown) {
    handleError(error, next)
  }
}

/**
 * Get SIM cards by date range
 * GET /sim-cards/date-range?startDate=2024-01-01&endDate=2024-12-31&page=1
 */
const getSimCardsByDateRange = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    logger.debug('[Controller] Fetching SIM cards by date range')

    const { startDate, endDate } = req.query
    const page = parseInt(req.params.page as string, 10) || 1

    if (!startDate || !endDate) {
      throw { status: 400, message: 'startDate and endDate are required' }
    }

    const start = new Date(startDate as string)
    const end = new Date(endDate as string)

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw { status: 400, message: 'Invalid date format' }
    }

    if (page < 1) {
      throw { status: 400, message: 'Page must be greater than 0' }
    }

    const offset = (page - 1) * limit
    const { simCards, total } = await simCardRepository.getSimCardsByDateRange(
      start,
      end,
      offset,
      { customer: true, device: true },
    )

    res.status(200).json({
      data: simCards,
      page,
      totalPages: Math.ceil(total / limit),
      total,
      startDate,
      endDate,
    })
  } catch (error: unknown) {
    handleError(error, next)
  }
}

/**
 * Get SIM cards count
 * GET /sim-cards/count
 */
const getSimCardsCount = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    logger.debug('[Controller] Fetching SIM cards count')

    const total = await simCardRepository.countSimCards()

    res.status(200).json({
      total,
    })
  } catch (error: unknown) {
    handleError(error, next)
  }
}

/**
 * Get SIM cards count for a specific customer
 * GET /sim-cards/customer/:customer_id/count
 */
const getSimCardsCountByCustomerId = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    logger.debug('[Controller] Fetching SIM cards count for customer', { customer_id: req.params.customer_id })

    const customer_id = parseInt(req.params.customer_id as string, 10)

    if (isNaN(customer_id)) {
      throw { status: 400, message: 'Customer ID must be a valid number' }
    }

    const total = await simCardRepository.countSimCardsByCustomerId(customer_id)

    res.status(200).json({
      total,
      customer_id,
    })
  } catch (error: unknown) {
    handleError(error, next)
  }
}

/**
 * Get SIM cards without customer but with device
 * GET /sim-cards/without-customer/page/:page
 * Fetches SIM cards that have a device assigned but no customer linked
 * Useful for finding devices awaiting customer assignment
 */
const getSimCardsWithoutCustomerButWithDevice = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    logger.debug('[Controller] Fetching SIM cards without customer but with device')

    const page = parseInt(req.params.page as string, 10) || 1
    if (page < 1) {
      throw { status: 400, message: 'Page must be greater than 0' }
    }

    const offset = (page - 1) * limit
    const { simCards, total } = await simCardRepository.getSimCardsWithoutCustomerButWithDevice(offset, {
      device: true,
    })

    res.status(200).json({
      data: simCards,
      page,
      totalPages: Math.ceil(total / limit),
      total,
      message: 'SIM cards without customer but with device',
    })
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
      IMEI_1: device.IMEI_1,
      device_number: device.device_number,
      serialNumber: device.serialNumber,
    })

    if (existingDevice) {
      logger.warn('[Controller] Found existing device with duplicate unique fields', {
        existing_id: existingDevice.device_id,
      })

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

/**
 * Check if SIM card with same unique fields already exists
 * Used before create/update to prevent duplicate constraint violations
 */
const checkExistingSimCard = async (simCard: SimCard.Model, isUpdate: boolean) => {
  try {
    logger.debug('[Controller] Checking for existing SIM card with duplicate fields', {
      isUpdate,
      simNumber: simCard.simNumber,
      device_id: simCard.device_id,
    })

    const existingSimCard = await simCardRepository.findExistingSimCard({
      simCard_id: isUpdate ? Number(simCard.simCard_id) : undefined,
      simNumber: simCard.simNumber,
      device_id: simCard.device_id ? simCard.device_id.toString() : undefined,
    })

    if (existingSimCard) {
      logger.warn('[Controller] Found existing SIM card with duplicate unique fields', {
        existing_id: existingSimCard.simCard_id,
      })

      // Use the SimCards model validation function
      try {
        SimCard.sanitizeExistingSimCard(existingSimCard as any, simCard)
      } catch (err) {
        throw err
      }
    }
  } catch (err) {
    throw err
  }
}

/**
 * Create Device with SIM Card in a single transaction
 * POST /sim-cards/device-with-sim
 * Body: {
 *   device?: {device_number, IMEI_1, model, serialNumber, plan?, purchaseDate?},
 *   simCard: {simNumber, customer_id, receivedAt?, planEndDate?}
 * }
 * 
 * If device data is provided: creates both device and simCard and links them
 * If device data is not provided: creates only simCard
 * 
 * Uses transaction to ensure data consistency
 */
const createDeviceWithSimCard = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const queryRunner = AppDataSource.createQueryRunner()
  
  try {
    logger.info('[Controller] Creating device with SIM card in transaction')
    SimCard.sanitizeBodyExisting(req)

    const { device: deviceData, simCard: simCardData } = req.body

    // Validate that at least simCard data is provided
    if (!simCardData) {
      throw { status: 400, message: 'SIM card data is required' }
    }

    // Start transaction
    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {
      let createdDevice: any = null
      let device_id = 0

      // If device data is provided, create it
      if (deviceData && Object.keys(deviceData).length > 0) {
        logger.debug('[Controller] Device data provided, creating device')
        
        // Sanitize device data
        const sanitizedDevice = Device.sanitize(deviceData, false)
        await checkExistingDevice(sanitizedDevice, false)

        // Create device using the transaction query runner
        const deviceRepository = queryRunner.manager.getRepository('Device')
        createdDevice = deviceRepository.create(sanitizedDevice as any)
        const savedDevice = await queryRunner.manager.save(createdDevice)
        device_id = savedDevice.device_id
        
        logger.debug('[Controller] Device created successfully', { device_id })
      }

      // Create simCard
      logger.debug('[Controller] Creating SIM card')
      const sanitizedSimCard = SimCard.sanitize(simCardData, false)
      
      // Update device_id if device was created
      sanitizedSimCard.device_id = device_id

      // Check for existing simCard only if it will be used
      await checkExistingSimCard(sanitizedSimCard, false)

      const simCardRepository = queryRunner.manager.getRepository('SimCards')
      const simCard = simCardRepository.create(sanitizedSimCard as any)
      const savedSimCard = await queryRunner.manager.save(simCard)

      logger.debug('[Controller] SIM card created successfully', {
        simCard_id: (savedSimCard as any).simCard_id,
        simNumber: (savedSimCard as any).simNumber,
      })

      // Commit transaction
      await queryRunner.commitTransaction()

      const response = {
        device: createdDevice,
        simCard: savedSimCard,
      }

      logger.info('[Controller] Device and SIM card created successfully in transaction')
      res.status(201).json(response)
    } catch (err) {
      // Rollback transaction on error
      await queryRunner.rollbackTransaction()
      logger.error('[Controller] Transaction rolled back due to error:', err)
      throw err
    }
  } catch (error: unknown) {
    handleError(error, next)
  } finally {
    // Release the query runner
    await queryRunner.release()
  }
}

export {
  createSimCard,
  getSimCards,
  getSimCardsWithDevices,
  getSimCardById,
  getSimCardByNumber,
  getSimCardsByCustomerId,
  getSimCardByDeviceId,
  updateSimCard,
  updatePlanEndDate,
  deleteSimCard,
  getExpiringSimCards,
  getSimCardsByDateRange,
  getSimCardsCount,
  getSimCardsCountByCustomerId,
  getSimCardsWithoutCustomerButWithDevice,
  createDeviceWithSimCard,
}
