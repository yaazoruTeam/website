/**
 * Error types and error handling structures for consistent error management
 */

/**
 * Base error interface that extends the standard Error
 */
export interface BaseError extends Error {
  status?: number
  code?: string
}

/**
 * HTTP Error structure used throughout the application
 */
export interface HttpErrorModel {
  status: number
  message: string
}

/**
 * Validation error with field-specific details
 */
export interface ValidationError extends BaseError {
  status: 400
  field?: string
  value?: unknown
}

/**
 * Database error with query context
 */
export interface DatabaseError extends BaseError {
  status: 500
  query?: string
  table?: string
}

/**
 * Authentication error
 */
export interface AuthenticationError extends BaseError {
  status: 401
}

/**
 * Authorization error
 */
export interface AuthorizationError extends BaseError {
  status: 403
}

/**
 * Not found error
 */
export interface NotFoundError extends BaseError {
  status: 404
  resource?: string
}

/**
 * Conflict error (e.g., duplicate resources)
 */
export interface ConflictError extends BaseError {
  status: 409
  conflictingField?: string
}

/**
 * External API error
 */
export interface ExternalApiError extends BaseError {
  status: number
  apiName?: string
  externalMessage?: string
}

/**
 * Excel processing error
 */
export interface ExcelProcessingError extends BaseError {
  status: 400
  row?: number
  column?: string
  fileName?: string
}

/**
 * File upload error
 */
export interface FileUploadError extends BaseError {
  status: 400
  fileName?: string
  fileSize?: number
  mimeType?: string
}

/**
 * Union type of all possible application errors
 */
export type ApplicationError = 
  | ValidationError
  | DatabaseError
  | AuthenticationError
  | AuthorizationError
  | NotFoundError
  | ConflictError
  | ExternalApiError
  | ExcelProcessingError
  | FileUploadError