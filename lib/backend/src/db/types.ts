// Shared database types for backend operations
import { Knex } from 'knex'

export type DatabaseTransaction = Knex.Transaction
export type QueryBuilder<T extends Record<string, unknown> = Record<string, unknown>> = Knex.QueryBuilder<T, T[]>