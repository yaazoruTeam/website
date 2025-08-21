// Common types for request validation and type safety

/**
 * Express Request object with params containing an id
 */
export interface RequestWithId {
  params: {
    id: string
  }
}

/**
 * Express Request object with a body
 */
export interface RequestWithBody<T = unknown> {
  body: T
}

/**
 * Express Request object with both params.id and body
 */
export interface RequestWithIdAndBody<T = unknown> extends RequestWithId {
  body: T
}

/**
 * Generic value type checker function
 */
export type ValueChecker<T> = (value: unknown) => value is T

/**
 * Database transaction type (for Knex)
 */
export interface DatabaseTransaction {
  // Basic transaction interface - can be extended with Knex-specific types later
  commit(): Promise<void>
  rollback(error?: any): Promise<void>
}