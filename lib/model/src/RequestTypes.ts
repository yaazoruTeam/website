/**
 * Express.js request and response types for proper type safety
 */

import { Request } from 'express'

/**
 * Express Request with typed params containing an id
 */
export interface RequestWithId extends Request {
  params: Request['params'] & {
    id: string
  }
}

/**
 * Express Request with typed body
 */
export interface RequestWithBody<T = Record<string, unknown>> extends Request {
  body: T
}

/**
 * Express Request with both typed params and body
 */
export interface RequestWithIdAndBody<T = Record<string, unknown>> extends Request {
  params: Request['params'] & {
    id: string
  }
  body: T
}

/**
 * Basic request parameter structure for ID validation
 */
export interface IdParams {
  id: string
}

/**
 * Request query parameters for pagination
 */
export interface PaginationQuery {
  page?: string
  limit?: string
}

/**
 * Request with pagination query parameters
 */
export interface RequestWithPagination extends Request {
  query: PaginationQuery & Request['query']
}