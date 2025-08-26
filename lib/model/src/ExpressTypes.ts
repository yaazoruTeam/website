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

interface RequestWithParams {
  params: {
    id?: RequestId
    [key: string]: unknown
  }
}

interface RequestWithBody {
  body: object
}

// Export types
export {
  RequestWithAuth,
  StringOrNumber,
  RequestId,
  RequestWithParams,
  RequestWithBody
}