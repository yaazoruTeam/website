import { NextFunction, Request, Response } from 'express'
import { simCardRepository } from '@repositories'
import { SimCards, HttpError } from '@model'
import config from '@config/index'
import { handleError } from './err'
import logger from '@/src/utils/logger'

const limit = config.database.limit

/**
 * Create a new SIM card
 * POST /sim-cards
 * Body: {simNumber, user_id, device_id, receivedAt, planEndDate}
 */
const createSimCard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    logger.info('[Controller] Creating a new SIM card')
    SimCards.sanitizeBodyExisting(req)

    const simCardData = req.body
    const sanitized = SimCards.sanitize(simCardData, false)

    // Check for existing SIM card with duplicate unique fields
    await checkExistingSimCard(sanitized, false)

    logger.debug('[Controller] Sanitized SIM card data:', sanitized)

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
      user: true,
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
 * Get SIM card by ID
 * GET /sim-cards/:id
 */
const getSimCardById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    logger.debug('[Controller] Fetching SIM card by ID', { simCard_id: req.params.id })

    SimCards.sanitizeIdExisting(req)

    const simCard_id = req.params.id as string

    const existSimCard = await simCardRepository.doesSimCardExist(simCard_id)
    if (!existSimCard) {
      const error: HttpError.Model = {
        status: 404,
        message: 'SIM card does not exist.',
      }
      throw error
    }

    const simCard = await simCardRepository.getSimCardById(simCard_id, {
      user: true,
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
      user: true,
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
 * Get all SIM cards for a specific user
 * GET /sim-cards/user/:user_id?page=1
 */
const getSimCardsByUserId = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    logger.debug('[Controller] Fetching SIM cards by user ID', { user_id: req.params.user_id })

    const user_id = parseInt(req.params.user_id as string, 10)
    const page = parseInt(req.params.page as string, 10) || 1

    if (isNaN(user_id)) {
      throw { status: 400, message: 'User ID must be a valid number' }
    }

    if (page < 1) {
      throw { status: 400, message: 'Page must be greater than 0' }
    }

    const offset = (page - 1) * limit
    const { simCards, total } = await simCardRepository.getSimCardsByUserId(user_id, offset, {
      device: true,
    })

    res.status(200).json({
      data: simCards,
      page,
      totalPages: Math.ceil(total / limit),
      total,
      user_id,
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
      user: true,
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

    SimCards.sanitizeIdExisting(req)
    SimCards.sanitizeBodyExisting(req)

    const simCard_id = req.params.id as string
    const sanitized = SimCards.sanitize(req.body, true)

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

    SimCards.sanitizeIdExisting(req)

    const simCard_id = req.params.id as string
    const { planEndDate } = req.body

    if (!planEndDate) {
      throw { status: 400, message: 'planEndDate is required' }
    }

    const dateObj = new Date(planEndDate)
    if (isNaN(dateObj.getTime())) {
      throw { status: 400, message: 'Invalid date format for planEndDate' }
    }

    const updatedSimCard = await simCardRepository.updatePlanEndDate(simCard_id, dateObj)
    res.status(200).json(updatedSimCard)
  } catch (error: unknown) {
    handleError(error, next)
  }
}

/**
 * Delete SIM card
 * DELETE /sim-cards/:id
 */
const deleteSimCard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    logger.debug('[Controller] Deleting SIM card', { simCard_id: req.params.id })

    SimCards.sanitizeIdExisting(req)

    const simCard_id = req.params.id as string

    const existSimCard = await simCardRepository.doesSimCardExist(simCard_id)
    if (!existSimCard) {
      const error: HttpError.Model = {
        status: 404,
        message: 'SIM card does not exist.',
      }
      throw error
    }

    const deletedSimCard = await simCardRepository.deleteSimCard(simCard_id)
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
      { user: true, device: true },
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
      { user: true, device: true },
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
 * Get SIM cards count for a specific user
 * GET /sim-cards/user/:user_id/count
 */
const getSimCardsCountByUserId = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    logger.debug('[Controller] Fetching SIM cards count for user', { user_id: req.params.user_id })

    const user_id = parseInt(req.params.user_id as string, 10)

    if (isNaN(user_id)) {
      throw { status: 400, message: 'User ID must be a valid number' }
    }

    const total = await simCardRepository.countSimCardsByUserId(user_id)

    res.status(200).json({
      total,
      user_id,
    })
  } catch (error: unknown) {
    handleError(error, next)
  }
}

/**
 * Check if SIM card with same unique fields already exists
 * Used before create/update to prevent duplicate constraint violations
 */
const checkExistingSimCard = async (simCard: SimCards.Model, isUpdate: boolean) => {
  try {
    logger.debug('[Controller] Checking for existing SIM card with duplicate fields', {
      isUpdate,
      simNumber: simCard.simNumber,
      device_id: simCard.device_id,
    })

    const existingSimCard = await simCardRepository.findExistingSimCard({
      simCard_id: isUpdate ? simCard.simCard_id : undefined,
      simNumber: simCard.simNumber,
      device_id: simCard.device_id.toString(),
    })

    if (existingSimCard) {
      logger.warn('[Controller] Found existing SIM card with duplicate unique fields', {
        existing_id: existingSimCard.simCard_id,
      })

      // Use the SimCards model validation function
      try {
        SimCards.sanitizeExistingSimCard(existingSimCard, simCard)
      } catch (err) {
        throw err
      }
    }
  } catch (err) {
    throw err
  }
}

export {
  createSimCard,
  getSimCards,
  getSimCardById,
  getSimCardByNumber,
  getSimCardsByUserId,
  getSimCardByDeviceId,
  updateSimCard,
  updatePlanEndDate,
  deleteSimCard,
  getExpiringSimCards,
  getSimCardsByDateRange,
  getSimCardsCount,
  getSimCardsCountByUserId,
}
