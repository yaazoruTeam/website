import {
  RouteRequest,
  RouteResponse,
  OriginateRequest,
  OriginateResponse,
  DIDValidationRequest,
  DIDValidationResponse,
  PBXStatus,
  CallLogEntry,
  CallLogFilter,
  CallSession
} from '@model'
import { 
  apiGet,
  apiPost
} from './core/apiHelpers'

const ENDPOINT = '/pbx'

// ===============================
// Health and Status
// ===============================

/**
 * Check PBX health status
 */
export const healthCheck = async (): Promise<{ success: boolean; data?: PBXStatus; error?: unknown }> => {
  return apiGet(`${ENDPOINT}/health`)
}

/**
 * Get PBX status
 */
export const getStatus = async (): Promise<{ success: boolean; data?: PBXStatus; error?: unknown }> => {
  return apiGet(`${ENDPOINT}/status`)
}

/**
 * Initialize PBX connection
 */
export const initialize = async (): Promise<{ success: boolean; data?: PBXStatus; error?: unknown }> => {
  return apiPost(`${ENDPOINT}/initialize`, {})
}

// ===============================
// Call Management
// ===============================

/**
 * Route a call through the PBX
 */
export const routeCall = async (request: RouteRequest): Promise<RouteResponse> => {
  return apiPost(`${ENDPOINT}/route`, request)
}

/**
 * Enhanced route call with validation
 */
export const routeCallEnhanced = async (request: RouteRequest): Promise<RouteResponse & { didValidation?: DIDValidationResponse; enhanced?: boolean }> => {
  return apiPost(`${ENDPOINT}/route-enhanced`, request)
}

/**
 * Originate a new call
 */
export const originateCall = async (request: OriginateRequest): Promise<OriginateResponse> => {
  return apiPost(`${ENDPOINT}/originate`, request)
}

/**
 * Hangup a call
 */
export const hangupCall = async (callId: string, cause?: string): Promise<{ success: boolean; message?: string }> => {
  return apiPost(`${ENDPOINT}/hangup`, { callId, cause })
}

/**
 * Transfer a call
 */
export const transferCall = async (request: { callId: string; destination: string; type?: 'blind' | 'attended' }): Promise<{ success: boolean; message?: string }> => {
  return apiPost(`${ENDPOINT}/transfer`, request)
}

// ===============================
// DID Validation
// ===============================

/**
 * Validate DID number
 */
export const validateDID = async (request: DIDValidationRequest): Promise<DIDValidationResponse> => {
  return apiPost(`${ENDPOINT}/validate-did`, request)
}

/**
 * Quick DID format validation
 */
export const validateDIDFormat = async (did: string): Promise<DIDValidationResponse> => {
  return validateDID({ did, format: 'quick' })
}

// ===============================
// Call Information
// ===============================

/**
 * Get active calls
 */
export const getActiveCalls = async (): Promise<{ success: boolean; data?: CallSession[]; count?: number }> => {
  return apiGet(`${ENDPOINT}/active-calls`)
}

/**
 * Get specific call session
 */
export const getCallSession = async (callId: string): Promise<{ success: boolean; data?: CallSession }> => {
  return apiGet(`${ENDPOINT}/call/${callId}`)
}

/**
 * Get call logs with filtering
 */
export const getCallLogs = async (filter?: CallLogFilter): Promise<{ success: boolean; data?: CallLogEntry[]; count?: number }> => {
  const queryParams = new URLSearchParams()
  
  if (filter?.startDate) queryParams.append('startDate', filter.startDate.toISOString())
  if (filter?.endDate) queryParams.append('endDate', filter.endDate.toISOString())
  if (filter?.callerNumber) queryParams.append('callerNumber', filter.callerNumber)
  if (filter?.calledNumber) queryParams.append('calledNumber', filter.calledNumber)
  if (filter?.direction) queryParams.append('direction', filter.direction)
  if (filter?.customerId) queryParams.append('customerId', filter.customerId.toString())
  if (filter?.limit) queryParams.append('limit', filter.limit.toString())
  if (filter?.offset) queryParams.append('offset', filter.offset.toString())
  
  const query = queryParams.toString()
  return apiGet(`${ENDPOINT}/call-logs${query ? '?' + query : ''}`)
}