/**
 * PBX Controller - API Endpoints for FreeSWITCH Integration
 * 
 * This controller provides REST API endpoints for PBX functionality
 * including call management, routing, and status monitoring.
 */

import { Request, Response } from 'express'
import { pbxService } from '../services/pbxService'
import logger from '@utils/logger'
import {
  RouteRequest,
  DIDValidationRequest,
  CallLogFilter,
  CreateRoutingRuleRequest,
  UpdateRoutingRuleRequest,
} from '@model'

/**
 * Health check endpoint for PBX service
 * GET /controller/pbx/health
 */
export const healthCheck = async (req: Request, res: Response): Promise<void> => {
  try {
    logger.info('PBX health check requested')
    
    const result = await pbxService.healthCheck()
    
    if (result.success) {
      res.status(200).json({
        success: true,
        data: result.data,
        timestamp: result.timestamp
      })
    } else {
      res.status(503).json({
        success: false,
        error: result.error,
        timestamp: result.timestamp
      })
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    logger.error('Health check error:', errorMessage)
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Health check failed',
        details: { originalError: error instanceof Error ? error.message : 'Unknown error' }
      },
      timestamp: new Date()
    })
  }
}

/**
 * Initialize PBX service connection
 * POST /controller/pbx/initialize
 */
export const initializePBX = async (req: Request, res: Response): Promise<void> => {
  try {
    logger.info('PBX initialization requested')
    
    const result = await pbxService.initialize()
    
    if (result.success) {
      res.status(200).json({
        success: true,
        message: 'PBX service initialized successfully',
        data: result.data,
        timestamp: result.timestamp
      })
    } else {
      res.status(503).json({
        success: false,
        error: result.error,
        timestamp: result.timestamp
      })
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    logger.error('PBX initialization error:', errorMessage)
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'PBX initialization failed',
        details: { originalError: errorMessage }
      },
      timestamp: new Date()
    })
  }
}

/**
 * Route a call through PBX
 * POST /controller/pbx/route
 * Body: { did: string, cid: string, variables?: Record<string, string> }
 */
export const routeCall = async (req: Request, res: Response): Promise<void> => {
  try {
    const { did, cid, variables } = req.body
    
    // Validation
    if (!did || !cid) {
      res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_REQUEST',
          message: 'Missing required fields: did and cid are required'
        },
        timestamp: new Date()
      })
      return
    }

    logger.info(`PBX route call requested: ${did} <- ${cid}`)
    
    const request: RouteRequest = {
      did,
      cid,
      variables
    }
    
    const result = await pbxService.routeCall(request)
    
    if (result.success) {
      res.status(200).json({
        success: true,
        data: result.data,
        timestamp: result.timestamp
      })
    } else {
      res.status(404).json({
        success: false,
        error: result.error,
        timestamp: result.timestamp
      })
    }
  } catch (error) {
    logger.error('Route call error:', error)
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Call routing failed',
        details: { originalError: error instanceof Error ? error.message : 'Unknown error' }
      },
      timestamp: new Date()
    })
  }
}

/**
 * Validate DID number
 * POST /controller/pbx/validate-did
 * Body: { did: string, format?: 'full' | 'quick' }
 */
export const validateDID = async (req: Request, res: Response): Promise<void> => {
  try {
    const { did, format } = req.body
    
    // Validation
    if (!did) {
      res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_REQUEST',
          message: 'Missing required field: did'
        },
        timestamp: new Date()
      })
      return
    }

    logger.info(`PBX DID validation requested: ${did}`)
    
    const request: DIDValidationRequest = {
      did,
      format: format || 'detailed'
    }
    
    const result = await pbxService.validateDID(request)
    
    if (result.success) {
      res.status(200).json({
        success: true,
        data: result.data,
        timestamp: result.timestamp
      })
    } else {
      res.status(400).json({
        success: false,
        error: result.error,
        timestamp: result.timestamp
      })
    }
  } catch (error) {
    logger.error('DID validation error:', error)
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'DID validation failed',
        details: { originalError: error instanceof Error ? error.message : 'Unknown error' }
      },
      timestamp: new Date()
    })
  }
}


/**
 * Get call logs
 * GET /controller/pbx/call-logs
 * Query params: startDate, endDate, callerNumber, calledNumber, direction, limit, offset
 */
export const getCallLogs = async (req: Request, res: Response): Promise<void> => {
  try {
    logger.info('PBX call logs requested')
    
    // Build filter from query parameters
    const filter: CallLogFilter = {}
    
    if (req.query.startDate) {
      filter.startDate = new Date(req.query.startDate as string)
    }
    
    if (req.query.endDate) {
      filter.endDate = new Date(req.query.endDate as string)
    }
    
    if (req.query.callerNumber) {
      filter.callerNumber = req.query.callerNumber as string
    }
    
    if (req.query.calledNumber) {
      filter.calledNumber = req.query.calledNumber as string
    }
    
    if (req.query.direction) {
      filter.direction = req.query.direction as any // CallDirection type
    }
    
    if (req.query.customerId) {
      filter.customerId = parseInt(req.query.customerId as string, 10)
    }
    
    if (req.query.limit) {
      filter.limit = parseInt(req.query.limit as string, 10)
    }
    
    if (req.query.offset) {
      filter.offset = parseInt(req.query.offset as string, 10)
    }
    
    const result = await pbxService.getCallLogs(filter)
    
    if (result.success) {
      res.status(200).json({
        success: true,
        data: result.data,
        count: result.data?.length || 0,
        timestamp: result.timestamp
      })
    } else {
      res.status(500).json({
        success: false,
        error: result.error,
        timestamp: result.timestamp
      })
    }
  } catch (error) {
    logger.error('Get call logs error:', error)
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to retrieve call logs',
        details: { originalError: error instanceof Error ? error.message : 'Unknown error' }
      },
      timestamp: new Date()
    })
  }
}

// ===============================
// Routing Rule Management
// ===============================

/**
 * Create a new routing rule
 * POST /controller/pbx/routing-rules
 * Body: { customerId, dialedNumber, callerPattern, destination, outgoingCid, provider, promptForDestination?, rulePriority?, active? }
 */
export const createRoutingRule = async (req: Request, res: Response): Promise<void> => {
  try {
    const { customerId, dialedNumber, callerPattern, destination, outgoingCid, provider, promptForDestination, rulePriority, active } = req.body
    
    // Validation
    const requiredFields = ['customerId', 'dialedNumber', 'callerPattern', 'destination', 'outgoingCid', 'provider']
    const missingFields = requiredFields.filter(field => !req.body[field])
    
    if (missingFields.length > 0) {
      res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_REQUEST',
          message: `Missing required fields: ${missingFields.join(', ')}`
        },
        timestamp: new Date()
      })
      return
    }

    logger.info(`Creating routing rule for customer ${customerId}: ${dialedNumber} -> ${destination}`)
    
    const request: CreateRoutingRuleRequest = {
      customerId: parseInt(customerId),
      dialedNumber,
      callerPattern,
      destination,
      outgoingCid,
      provider,
      promptForDestination,
      rulePriority,
      active
    }
    
    const result = await pbxService.createRoutingRule(request)
    
    if (result.success) {
      res.status(201).json({
        success: true,
        message: 'Routing rule created successfully',
        data: result.data,
        timestamp: result.timestamp
      })
    } else {
      res.status(500).json({
        success: false,
        error: result.error,
        timestamp: result.timestamp
      })
    }
  } catch (error) {
    logger.error('Create routing rule error:', error)
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to create routing rule',
        details: { originalError: error instanceof Error ? error.message : 'Unknown error' }
      },
      timestamp: new Date()
    })
  }
}

/**
 * Get all routing rules for a customer
 * GET /controller/pbx/routing-rules/:customerId
 */
export const getCustomerRoutingRules = async (req: Request, res: Response): Promise<void> => {
  try {
    const { customerId } = req.params
    
    if (!customerId) {
      res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_REQUEST',
          message: 'Customer ID is required'
        },
        timestamp: new Date()
      })
      return
    }

    logger.info(`Getting routing rules for customer ${customerId}`)
    
    const result = await pbxService.getCustomerRules(parseInt(customerId))
    
    if (result.success) {
      res.status(200).json({
        success: true,
        data: result.data?.data || [],
        count: result.data?.count || 0,
        timestamp: result.timestamp
      })
    } else {
      res.status(500).json({
        success: false,
        error: result.error,
        timestamp: result.timestamp
      })
    }
  } catch (error) {
    logger.error('Get customer routing rules error:', error)
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to get customer routing rules',
        details: { originalError: error instanceof Error ? error.message : 'Unknown error' }
      },
      timestamp: new Date()
    })
  }
}

/**
 * Update a routing rule
 * PUT /controller/pbx/routing-rules/:ruleId
 * Body: { customerId?, dialedNumber?, callerPattern?, destination?, outgoingCid?, provider?, promptForDestination?, rulePriority?, active? }
 */
export const updateRoutingRule = async (req: Request, res: Response): Promise<void> => {
  try {
    const { ruleId } = req.params
    
    if (!ruleId) {
      res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_REQUEST',
          message: 'Rule ID is required'
        },
        timestamp: new Date()
      })
      return
    }

    logger.info(`Updating routing rule ${ruleId}`)
    
    const request: UpdateRoutingRuleRequest = req.body
    
    const result = await pbxService.updateRoutingRule(parseInt(ruleId), request)
    
    if (result.success) {
      res.status(200).json({
        success: true,
        message: 'Routing rule updated successfully',
        data: result.data,
        timestamp: result.timestamp
      })
    } else {
      res.status(404).json({
        success: false,
        error: result.error,
        timestamp: result.timestamp
      })
    }
  } catch (error) {
    logger.error('Update routing rule error:', error)
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to update routing rule',
        details: { originalError: error instanceof Error ? error.message : 'Unknown error' }
      },
      timestamp: new Date()
    })
  }
}

/**
 * Delete a routing rule
 * DELETE /controller/pbx/routing-rules/:ruleId
 */
export const deleteRoutingRule = async (req: Request, res: Response): Promise<void> => {
  try {
    const { ruleId } = req.params
    
    if (!ruleId) {
      res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_REQUEST',
          message: 'Rule ID is required'
        },
        timestamp: new Date()
      })
      return
    }

    logger.info(`Deleting routing rule ${ruleId}`)
    
    const result = await pbxService.deleteRoutingRule(parseInt(ruleId))
    
    if (result.success) {
      res.status(200).json({
        success: true,
        message: 'Routing rule deleted successfully',
        timestamp: result.timestamp
      })
    } else {
      res.status(404).json({
        success: false,
        error: result.error,
        timestamp: result.timestamp
      })
    }
  } catch (error) {
    logger.error('Delete routing rule error:', error)
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to delete routing rule',
        details: { originalError: error instanceof Error ? error.message : 'Unknown error' }
      },
      timestamp: new Date()
    })
  }
}