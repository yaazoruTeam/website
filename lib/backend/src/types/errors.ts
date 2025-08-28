// Error handling types for backend

/**
 * Standard Error interface that can be thrown
 */
export interface AppError extends Error {
  status?: number
  statusCode?: number
}

/**
 * Type guard to check if error is an AppError
 */
export function isAppError(error: unknown): error is AppError {
  return error instanceof Error && ('status' in error || 'statusCode' in error)
}

/**
 * Type guard to check if error is a standard Error
 */
export function isError(error: unknown): error is Error {
  return error instanceof Error
}

/**
 * Safe way to get error message from unknown error
 */
export function getErrorMessage(error: unknown): string {
  if (isError(error)) {
    return error.message
  }
  if (typeof error === 'string') {
    return error
  }
  return 'Unknown error occurred'
}

/**
 * Safe way to get error status from unknown error
 */
export function getErrorStatus(error: unknown): number {
  if (isAppError(error)) {
    return error.status || error.statusCode || 500
  }
  return 500
}