/**
 * Error handling utility functions
 * Provides consistent error message formatting across the application
 */

/**
 * Formats an unknown error into a readable string message
 * @param err - The error to format (can be Error, string, object, or any other type)
 * @returns A formatted error message string
 */
export const formatErrorMessage = (err: unknown): string => {
  if (err instanceof Error) {
    return err.message
  } else if (typeof err === 'string') {
    return err
  } else if (err && typeof err === 'object') {
    return JSON.stringify(err)
  } else {
    return String(err)
  }
}