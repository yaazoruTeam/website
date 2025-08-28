/**
 * Sanitization utility functions with proper type safety
 */

import { Request } from 'express'
import { RequestWithId, RequestWithBody } from './RequestTypes'
import { HttpErrorModel } from './ErrorTypes'

/**
 * Type guard to check if request has id in params
 */
function hasIdParam(req: Request): req is RequestWithId {
  return req.params && typeof req.params.id === 'string'
}

/**
 * Validates that a request has an ID parameter
 * @param req - Express request that may have ID params
 * @throws HttpErrorModel if ID is missing
 */
export function sanitizeIdExisting(req: Request): void {
  if (!hasIdParam(req) || !req.params.id) {
    const error: HttpErrorModel = {
      status: 400,
      message: 'No ID provided',
    }
    throw error
  }
}

/**
 * Validates that a request has a non-empty body
 * @param req - Express request with body
 * @throws HttpErrorModel if body is missing or empty
 */
export function sanitizeBodyExisting<T = Record<string, unknown>>(req: Request): void {
  if (!req.body || Object.keys(req.body).length === 0) {
    const error: HttpErrorModel = {
      status: 400,
      message: 'No body provided',
    }
    throw error
  }
}

/**
 * Validates that required fields are present in an object
 * @param obj - Object to validate
 * @param requiredFields - Array of required field names
 * @param entityName - Name of the entity for error messages
 * @throws HttpErrorModel if any required field is missing
 */
export function validateRequiredFields(
  obj: Record<string, unknown>,
  requiredFields: string[],
  entityName: string = 'entity'
): void {
  for (const field of requiredFields) {
    if (!(field in obj) || obj[field] === undefined || obj[field] === null) {
      const error: HttpErrorModel = {
        status: 400,
        message: `Invalid or missing "${field}" in ${entityName}.`,
      }
      throw error
    }
  }
}

/**
 * Validates that a string field is non-empty
 * @param value - Value to validate
 * @param fieldName - Name of the field for error messages
 * @throws HttpErrorModel if value is not a non-empty string
 */
export function validateNonEmptyString(value: unknown, fieldName: string): asserts value is string {
  if (typeof value !== 'string' || value.trim() === '') {
    const error: HttpErrorModel = {
      status: 400,
      message: `Invalid or missing "${fieldName}".`,
    }
    throw error
  }
}