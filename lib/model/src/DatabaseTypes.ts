import { Knex } from 'knex'

// Database transaction types
export type DatabaseTransaction = Knex.Transaction
export type DatabaseQuery = Knex.QueryBuilder

// Database schema types - we can expand this as needed
export interface DatabaseSchema {
  customers: any // This would ideally be Customer.Model but requires circular imports
  devices: any
  users: any
  // Add more table types as needed
}

export type TypedKnex = Knex<DatabaseSchema, unknown[]>
export type TypedDbConnection = TypedKnex