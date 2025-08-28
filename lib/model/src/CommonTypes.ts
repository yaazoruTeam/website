// Common types for request validation and type safety

/**
 * Express Request object with params containing an id
 */
export interface RequestWithId {
  params: {
    id?: string
    [key: string]: any
  }
}

/**
 * Express Request object with a body
 */
export interface RequestWithBody<T = any> {
  body: T
  [key: string]: any
}

/**
 * Express Request object with both params.id and body
 */
export interface RequestWithIdAndBody<T = any> extends RequestWithId {
  body: T
}

/**
 * Generic value type checker function
 */
export type ValueChecker<T> = (value: unknown) => value is T