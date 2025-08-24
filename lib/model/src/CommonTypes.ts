// Common type definitions for request objects and utility functions

/**
 * Request object with params containing an id
 */
export interface RequestWithParams {
  params: {
    id: string
  }
}

/**
 * Request object with a body
 */
export interface RequestWithBody<T = Record<string, unknown>> {
  body: T
}

/**
 * Combined request object with both params and body
 */
export interface RequestWithParamsAndBody<T = Record<string, unknown>> {
  params: {
    id: string
  }
  body: T
}

/**
 * Type guard for checking if a value is a string
 */
export const isString = (value: unknown): value is string => typeof value === 'string'

/**
 * Type guard for checking if a value is an optional string
 */
export const isOptionalString = (value: unknown): value is string | undefined => 
  value === undefined || typeof value === 'string'