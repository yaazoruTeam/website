// Express-related type definitions for the application

interface RequestWithAuth {
  user?: {
    user_id: number
    role: string
  }
}

interface StringOrNumber {
  toString(): string
}

interface RequestId extends StringOrNumber {}

// Export types
export {
  RequestWithAuth,
  StringOrNumber,
  RequestId
}