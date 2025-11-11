/**
 * PBX Error Types and Handling
 * 
 * This module contains TypeScript types and classes for PBX error handling
 */

export enum PBXErrorCode {
  CONNECTION_FAILED = 'CONNECTION_FAILED',
  AUTHENTICATION_FAILED = 'AUTHENTICATION_FAILED',
  INVALID_REQUEST = 'INVALID_REQUEST',
  TIMEOUT = 'TIMEOUT',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  CALL_NOT_FOUND = 'CALL_NOT_FOUND',
  ROUTE_NOT_FOUND = 'ROUTE_NOT_FOUND',
  ROUTING_FAILED = 'ROUTING_FAILED'
}

export class PBXError extends Error {
  public code: PBXErrorCode
  public details: any

  constructor(message: string, code: PBXErrorCode, details?: any) {
    super(message)
    this.name = 'PBXError'
    this.code = code
    this.details = details || {}
  }
}
