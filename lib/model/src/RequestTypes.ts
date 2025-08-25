// Common type definitions for request-like objects used in model validation

export interface RequestWithParams {
  params: {
    id?: string;
  };
}

export interface RequestWithBody<T = unknown> {
  body: T;
}

export interface RequestWithParamsAndBody<T = unknown> extends RequestWithParams, RequestWithBody<T> {}