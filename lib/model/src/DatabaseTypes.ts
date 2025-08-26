// Database and utility type definitions

import { Knex } from 'knex'

// Transaction type for database operations
type Transaction = Knex.Transaction

// Excel row data interface
interface ExcelRowData {
  [key: string]: string | number | boolean | null | undefined
}

// Error with optional properties that might exist on different error types
interface ErrorWithMessage {
  message?: string
  status?: number
  response?: {
    data?: {
      message?: string
    }
  }
}

// Export types
export {
  Transaction,
  ExcelRowData,
  ErrorWithMessage
}