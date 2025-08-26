// Common types for sanitization and validation functions

export interface RequestWithParams {
  params: {
    id?: string
    [key: string]: string | undefined
  }
}

export interface RequestWithBody {
  body?: object | null
}

export interface RequestWithParamsAndBody extends RequestWithParams, RequestWithBody {}

// Type guard functions
export function hasId(obj: unknown): obj is RequestWithParams {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'params' in obj &&
    typeof (obj as any).params === 'object' &&
    (obj as any).params !== null
  )
}

export function hasBody(obj: unknown): obj is RequestWithBody {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'body' in obj
  )
}

export function isStringValue(value: unknown): value is string {
  return typeof value === 'string'
}

export function isOptionalStringValue(value: unknown): value is string | undefined | null {
  return value === undefined || value === null || typeof value === 'string'
}