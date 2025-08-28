// Generic request interface for sanitization functions
interface RequestWithParams {
  params: {
    id?: string
    [key: string]: unknown
  }
}

interface RequestWithBody {
  body: {
    [key: string]: unknown
  }
}

export { RequestWithParams, RequestWithBody }