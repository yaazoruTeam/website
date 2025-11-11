/**
 * PBX Utilities - Helper functions for PBX operations
 * 
 * This module provides utility functions for formatting, validation,
 * and general PBX-related operations.
 */

// ===============================
// Phone Number Formatting
// ===============================

/**
 * Format phone number for display
 */
export const formatPhoneNumber = (number: string): string => {
  // Basic phone number formatting
  const cleaned = number.replace(/\D/g, '')
  
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
  } else if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`
  }
  
  return number // Return original if no format matches
}

/**
 * Clean phone number (remove all non-digits)
 */
export const cleanPhoneNumber = (number: string): string => {
  return number.replace(/\D/g, '')
}

/**
 * Validate phone number format
 */
export const isValidPhoneNumber = (number: string): boolean => {
  const cleaned = cleanPhoneNumber(number)
  return cleaned.length >= 10 && cleaned.length <= 15
}

// ===============================
// Time and Duration Formatting
// ===============================

/**
 * Calculate call duration in human-readable format
 */
export const formatDuration = (durationSeconds: number): string => {
  const hours = Math.floor(durationSeconds / 3600)
  const minutes = Math.floor((durationSeconds % 3600) / 60)
  const seconds = durationSeconds % 60

  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`
  } else {
    return `${seconds}s`
  }
}

/**
 * Format timestamp for display
 */
export const formatCallTime = (timestamp: Date | string): string => {
  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp
  return date.toLocaleString()
}

/**
 * Calculate time ago from timestamp
 */
export const timeAgo = (timestamp: Date | string): string => {
  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return 'Just now'
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes} minute${minutes === 1 ? '' : 's'} ago`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours} hour${hours === 1 ? '' : 's'} ago`
  } else {
    const days = Math.floor(diffInSeconds / 86400)
    return `${days} day${days === 1 ? '' : 's'} ago`
  }
}

// ===============================
// Call State and Status
// ===============================

/**
 * Get call state color for UI
 */
export const getCallStateColor = (state: string): string => {
  const colors: Record<string, string> = {
    idle: '#6b7280',
    ringing: '#fbbf24',
    answered: '#10b981',
    bridge: '#3b82f6',
    hangup: '#ef4444',
    failed: '#ef4444',
    busy: '#f59e0b',
    no_answer: '#9ca3af'
  }
  
  return colors[state] || '#6b7280'
}

/**
 * Get call direction icon or text
 */
export const getCallDirectionDisplay = (direction: string): { icon: string; text: string; color: string } => {
  const directions: Record<string, { icon: string; text: string; color: string }> = {
    inbound: { icon: '📞', text: 'Incoming', color: '#10b981' },
    outbound: { icon: '📲', text: 'Outgoing', color: '#3b82f6' },
    internal: { icon: '🔄', text: 'Internal', color: '#8b5cf6' }
  }
  
  return directions[direction] || { icon: '❓', text: 'Unknown', color: '#6b7280' }
}

/**
 * Get call status display information
 */
export const getCallStatusDisplay = (status: string): { text: string; color: string; badge: string } => {
  const statuses: Record<string, { text: string; color: string; badge: string }> = {
    active: { text: 'Active', color: '#10b981', badge: '🟢' },
    ringing: { text: 'Ringing', color: '#fbbf24', badge: '🟡' },
    on_hold: { text: 'On Hold', color: '#8b5cf6', badge: '🟣' },
    transferring: { text: 'Transferring', color: '#3b82f6', badge: '🔄' },
    ended: { text: 'Ended', color: '#6b7280', badge: '⚫' },
    failed: { text: 'Failed', color: '#ef4444', badge: '🔴' }
  }
  
  return statuses[status] || { text: 'Unknown', color: '#6b7280', badge: '❓' }
}

// ===============================
// Data Validation
// ===============================

/**
 * Validate DID format (basic validation)
 */
export const isValidDID = (did: string): boolean => {
  // Basic DID validation - should be a valid phone number
  return isValidPhoneNumber(did)
}

/**
 * Validate call ID format
 */
export const isValidCallId = (callId: string): boolean => {
  // Call IDs should be non-empty strings
  return typeof callId === 'string' && callId.trim().length > 0
}

// ===============================
// URL and Query Helpers
// ===============================

/**
 * Build query string from filter object
 */
export const buildCallLogsQuery = (filter?: {
  startDate?: Date
  endDate?: Date
  callerNumber?: string
  calledNumber?: string
  direction?: string
  customerId?: number
  limit?: number
  offset?: number
}): string => {
  if (!filter) return ''
  
  const params = new URLSearchParams()
  
  if (filter.startDate) params.append('startDate', filter.startDate.toISOString())
  if (filter.endDate) params.append('endDate', filter.endDate.toISOString())
  if (filter.callerNumber) params.append('callerNumber', filter.callerNumber)
  if (filter.calledNumber) params.append('calledNumber', filter.calledNumber)
  if (filter.direction) params.append('direction', filter.direction)
  if (filter.customerId) params.append('customerId', filter.customerId.toString())
  if (filter.limit) params.append('limit', filter.limit.toString())
  if (filter.offset) params.append('offset', filter.offset.toString())
  
  const query = params.toString()
  return query ? `?${query}` : ''
}

// ===============================
// Error Handling
// ===============================

/**
 * Format API error for display
 */
export const formatApiError = (error: unknown): string => {
  if (typeof error === 'string') {
    return error
  } else if (error && typeof error === 'object' && 'message' in error) {
    return (error as { message: string }).message
  } else if (error && typeof error === 'object' && 'error' in error) {
    return String((error as { error: unknown }).error)
  } else {
    return 'Unknown error occurred'
  }
}

/**
 * Check if error is network-related
 */
export const isNetworkError = (error: unknown): boolean => {
  const errorMessage = formatApiError(error).toLowerCase()
  return errorMessage.includes('network') || 
         errorMessage.includes('fetch') || 
         errorMessage.includes('connection') ||
         errorMessage.includes('timeout')
}

// ===============================
// Constants
// ===============================

export const PBX_CONSTANTS = {
  DEFAULT_TIMEOUT: 30000,
  DEFAULT_RETRY_ATTEMPTS: 3,
  POLLING_INTERVALS: {
    STATUS: 30000,
    CALLS: 10000,
    LOGS: 60000
  },
  CALL_STATES: ['idle', 'ringing', 'answered', 'bridge', 'hangup', 'failed', 'busy', 'no_answer'],
  CALL_DIRECTIONS: ['inbound', 'outbound', 'internal'],
  TRANSFER_TYPES: ['blind', 'attended']
} as const

export type CallState = typeof PBX_CONSTANTS.CALL_STATES[number]
export type CallDirection = typeof PBX_CONSTANTS.CALL_DIRECTIONS[number]
export type TransferType = typeof PBX_CONSTANTS.TRANSFER_TYPES[number]