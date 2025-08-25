/**
 * Database operation types for type-safe database interactions
 */

/**
 * Database transaction type (generic to avoid direct dependency on Knex)
 */
export interface DatabaseTransaction {
  commit(): Promise<void>
  rollback(): Promise<void>
}

/**
 * Database query builder type (generic)
 */
export interface QueryBuilder<T = unknown> {
  where(column: string, value: unknown): QueryBuilder<T>
  select(...columns: string[]): QueryBuilder<T>
  insert(data: Record<string, unknown>): QueryBuilder<T>
  update(data: Record<string, unknown>): QueryBuilder<T>
  delete(): QueryBuilder<T>
}

/**
 * Base database model interface that all models should extend
 */
export interface BaseModel {
  created_at?: Date
  updated_at?: Date
}

/**
 * Database insert result
 */
export interface InsertResult {
  insertId: number
  affectedRows: number
}

/**
 * Database update result
 */
export interface UpdateResult {
  affectedRows: number
  changedRows: number
}

/**
 * Database delete result
 */
export interface DeleteResult {
  affectedRows: number
}

/**
 * Pagination result wrapper
 */
export interface PaginatedResult<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

/**
 * Database connection configuration
 */
export interface DatabaseConfig {
  host: string
  port: number
  user: string
  name: string
  password: string
}