import {
  RouteRequest,
  RouteResponse,
  DIDValidationRequest,
  DIDValidationResponse,
  PBXStatus,
  CallLogEntry,
  CallLogFilter
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