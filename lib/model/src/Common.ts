// Common types used across the application

// Type guard function type
export type TypeGuard<T> = (value: unknown) => value is T

// String type checker
export const isString = (value: unknown): value is string => typeof value === 'string'

// Number type checker  
export const isNumber = (value: unknown): value is number => typeof value === 'number'

// Boolean type checker
export const isBoolean = (value: unknown): value is boolean => typeof value === 'boolean'

// Date type checker
export const isDate = (value: unknown): value is Date => value instanceof Date

// Object type checker
export const isObject = (value: unknown): value is Record<string, unknown> => 
  typeof value === 'object' && value !== null && !Array.isArray(value)

// Array type checker
export const isArray = (value: unknown): value is unknown[] => Array.isArray(value)

// Express request interfaces for type safety
export interface ExpressRequestWithParams {
  params: {
    id?: string
    [key: string]: string | undefined
  }
}

export interface ExpressRequestWithBody {
  body?: Record<string, unknown>
}