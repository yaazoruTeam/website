/**
 * Backend-specific database types extending the model layer types
 */

import { Knex } from 'knex'
import { DatabaseTypes } from '@model'

/**
 * Knex transaction type for backend database operations
 */
export type KnexTransaction = Knex.Transaction

/**
 * Knex query builder type - simplified for compatibility
 */
export type KnexQueryBuilder = Knex.QueryBuilder

/**
 * Database query where clause builder
 */
export type WhereClauseBuilder = (qb: Knex.QueryBuilder) => void

/**
 * Excel data processing types
 */
export interface ExcelRowData {
  [key: string]: string | number | boolean | Date | null | undefined
}

export interface ExcelProcessingResult<T> {
  success: T[]
  errors: ExcelProcessingError[]
}

export interface ExcelProcessingError {
  row: number
  message: string
  error?: string
  data?: Record<string, unknown>
}

/**
 * File upload types
 */
export interface UploadedFile {
  fieldname: string
  originalname: string
  encoding: string
  mimetype: string
  size: number
  destination: string
  filename: string
  path: string
  buffer?: Buffer
}

export interface FileUploadError extends Error {
  code?: string
  field?: string
  file?: UploadedFile
}

/**
 * API integration types
 */
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface WidelyApiResponse<T = unknown> extends ApiResponse<T> {
  status: string
  error_code: number
}

/**
 * Database pagination options
 */
export interface PaginationOptions {
  page?: number
  limit?: number
  orderBy?: string
  direction?: 'asc' | 'desc'
}