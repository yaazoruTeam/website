import { Request } from 'express';

// Common request parameter patterns
interface RequestWithId {
  params: {
    id: string;
    [key: string]: string; // Allow other params too
  }
}

interface RequestWithBody<T = unknown> {
  body: T;
}

interface RequestWithIdAndBody<T = unknown> extends RequestWithId, RequestWithBody<T> {}

// Type guard for request with ID parameters - use assertion functions instead
export function assertRequestHasId(req: Request): asserts req is Request & RequestWithId {
  if (!req.params.id) {
    throw new Error('No ID provided');
  }
}

export function assertRequestHasBody(req: Request): asserts req is Request & RequestWithBody {
  if (!req.body || Object.keys(req.body).length === 0) {
    throw new Error('No body provided');
  }
}

// Type guard for request with ID parameters
type ExpressRequestWithId = Request & RequestWithId;

// Type guard for request with body
type ExpressRequestWithBody<T = unknown> = Request & RequestWithBody<T>;

// Type guard for request with both ID and body
type ExpressRequestWithIdAndBody<T = unknown> = Request & RequestWithIdAndBody<T>;

export {
  RequestWithId,
  RequestWithBody,
  RequestWithIdAndBody,
  ExpressRequestWithId,
  ExpressRequestWithBody,
  ExpressRequestWithIdAndBody
};