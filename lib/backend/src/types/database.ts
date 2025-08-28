// Database-specific types for backend
import { Knex } from 'knex'

/**
 * Knex database transaction type
 */
export type DatabaseTransaction = Knex.Transaction

/**
 * Query builder type for searches with filters
 */
export type QueryBuilder = Knex.QueryBuilder

/**
 * Database connection type  
 */
export type DatabaseConnection = Knex