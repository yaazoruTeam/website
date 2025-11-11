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
  OriginateRequest,
  HangupRequest,
  TransferRequest,
  DIDValidationRequest,
  CallLogFilter,
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
 * Originate a new call
 * POST /controller/pbx/originate
 * Body: { callerNumber: string, calledNumber: string, timeout?: number, variables?: Record<string, string>, earlyMedia?: boolean }
 */
export const originateCall = async (req: Request, res: Response): Promise<void> => {
  try {
    const { callerNumber, calledNumber, timeout, variables, earlyMedia } = req.body
    
    // Validation
    if (!callerNumber || !calledNumber) {
      res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_REQUEST',
          message: 'Missing required fields: callerNumber and calledNumber are required'
        },
        timestamp: new Date()
      })
      return
    }

    logger.info(`PBX originate call requested: ${callerNumber} -> ${calledNumber}`)
    
    const request: OriginateRequest = {
      callerNumber,
      calledNumber,
      destinationNumber: calledNumber, // Use calledNumber as destinationNumber
      direction: 'outbound', // Default to outbound for originate calls
      timeout,
      variables,
      earlyMedia
    }
    
    const result = await pbxService.originateCall(request)
    
    if (result.success) {
      res.status(201).json({
        success: true,
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
    logger.error('Originate call error:', error)
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Call origination failed',
        details: { originalError: error instanceof Error ? error.message : 'Unknown error' }
      },
      timestamp: new Date()
    })
  }
}

/**
 * Hangup a call
 * POST /controller/pbx/hangup
 * Body: { callId?: string, sessionId?: string, cause?: string }
 */
export const hangupCall = async (req: Request, res: Response): Promise<void> => {
  try {
    const { callId, sessionId, cause } = req.body
    
    // Validation
    if (!callId && !sessionId) {
      res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_REQUEST',
          message: 'Either callId or sessionId is required'
        },
        timestamp: new Date()
      })
      return
    }

    logger.info(`PBX hangup call requested: ${callId || sessionId}`)
    
    const request: HangupRequest = {
      callId,
      sessionId,
      cause
    }
    
    const result = await pbxService.hangupCall(request)
    
    if (result.success) {
      res.status(200).json({
        success: true,
        message: 'Call hung up successfully',
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
    logger.error('Hangup call error:', error)
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Call hangup failed',
        details: { originalError: error instanceof Error ? error.message : 'Unknown error' }
      },
      timestamp: new Date()
    })
  }
}

/**
 * Transfer a call
 * POST /controller/pbx/transfer
 * Body: { callId: string, destination: string, type?: 'blind' | 'attended' }
 */
export const transferCall = async (req: Request, res: Response): Promise<void> => {
  try {
    const { callId, destination, type } = req.body
    
    // Validation
    if (!callId || !destination) {
      res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_REQUEST',
          message: 'Missing required fields: callId and destination are required'
        },
        timestamp: new Date()
      })
      return
    }

    logger.info(`PBX transfer call requested: ${callId} -> ${destination}`)
    
    const request: TransferRequest = {
      callId,
      destination,
      type: type || 'blind'
    }
    
    const result = await pbxService.transferCall(request)
    
    if (result.success) {
      res.status(200).json({
        success: true,
        message: 'Call transferred successfully',
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
    logger.error('Transfer call error:', error)
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Call transfer failed',
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

/**
 * Get active calls
 * GET /controller/pbx/active-calls
 */
export const getActiveCalls = async (req: Request, res: Response): Promise<void> => {
  try {
    logger.info('PBX active calls requested')
    
    const activeCalls = pbxService.getActiveCalls()
    
    res.status(200).json({
      success: true,
      data: activeCalls,
      count: activeCalls.length,
      timestamp: new Date()
    })
  } catch (error) {
    logger.error('Get active calls error:', error)
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to retrieve active calls',
        details: { originalError: error instanceof Error ? error.message : 'Unknown error' }
      },
      timestamp: new Date()
    })
  }
}

/**
 * Get specific call session
 * GET /controller/pbx/call/:callId
 */
export const getCallSession = async (req: Request, res: Response): Promise<void> => {
  try {
    const { callId } = req.params
    
    if (!callId) {
      res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_REQUEST',
          message: 'Call ID is required'
        },
        timestamp: new Date()
      })
      return
    }

    logger.info(`PBX call session requested: ${callId}`)
    
    const callSession = pbxService.getCallSession(callId)
    
    if (callSession) {
      res.status(200).json({
        success: true,
        data: callSession,
        timestamp: new Date()
      })
    } else {
      res.status(404).json({
        success: false,
        error: {
          code: 'CALL_NOT_FOUND',
          message: 'Call session not found'
        },
        timestamp: new Date()
      })
    }
  } catch (error) {
    logger.error('Get call session error:', error)
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to retrieve call session',
        details: { originalError: error instanceof Error ? error.message : 'Unknown error' }
      },
      timestamp: new Date()
    })
  }
}

/**
 * Get PBX status
 * GET /controller/pbx/status
 */
export const getStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    logger.info('PBX status requested')
    
    const status = pbxService.getStatus()
    
    res.status(200).json({
      success: true,
      data: status,
      timestamp: new Date()
    })
  } catch (error) {
    logger.error('Get PBX status error:', error)
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to retrieve PBX status',
        details: { originalError: error instanceof Error ? error.message : 'Unknown error' }
      },
      timestamp: new Date()
    })
  }
}

/**
 * Enhanced route call with additional validation and mapping
 * This maps to the existing FreeSWITCH routing system documented in the integration guide
 * POST /controller/pbx/route-enhanced
 */
export const routeCallEnhanced = async (req: Request, res: Response): Promise<void> => {
  try {
    const { did, cid, variables } = req.body
    
    // Enhanced validation with detailed error messages
    const validationErrors: string[] = []
    
    if (!did) {
      validationErrors.push('DID (Dialed Number) is required')
    }
    
    if (!cid) {
      validationErrors.push('CID (Caller ID) is required')
    }
    
    // Basic format validation
    if (did && !/^\+?[\d-\s()]+$/.test(did)) {
      validationErrors.push('DID format is invalid')
    }
    
    if (cid && !/^\+?[\d-\s()]+$/.test(cid)) {
      validationErrors.push('CID format is invalid')
    }
    
    if (validationErrors.length > 0) {
      res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Validation failed',
          details: { validationErrors }
        },
        timestamp: new Date()
      })
      return
    }

    logger.info(`Enhanced PBX route call requested: DID=${did}, CID=${cid}`)
    
    // First validate the DID
    const didValidation = await pbxService.validateDID({ did, format: 'detailed' })
    
    if (!didValidation.success || !didValidation.data?.data?.valid) {
      res.status(404).json({
        success: false,
        error: {
          code: 'INVALID_DID',
          message: 'DID number is not valid or not found',
          details: { did, validation: didValidation.data }
        },
        timestamp: new Date()
      })
      return
    }
    
    // Proceed with routing
    const request: RouteRequest = {
      did,
      cid,
      variables: {
        ...variables,
        enhanced_routing: 'true',
        validation_performed: 'true',
        request_timestamp: new Date().toISOString()
      }
    }
    
    const result = await pbxService.routeCall(request)
    
    if (result.success) {
      res.status(200).json({
        success: true,
        data: {
          ...result.data,
          didValidation: didValidation.data,
          enhanced: true
        },
        timestamp: result.timestamp
      })
    } else {
      res.status(404).json({
        success: false,
        error: {
          ...result.error,
          details: {
            ...result.error?.details,
            didValidation: didValidation.data
          }
        },
        timestamp: result.timestamp
      })
    }
  } catch (error) {
    logger.error('Enhanced route call error:', error)
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Enhanced call routing failed',
        details: { originalError: error instanceof Error ? error.message : 'Unknown error' }
      },
      timestamp: new Date()
    })
  }
}