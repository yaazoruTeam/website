// Shared types for model validation and sanitization

export interface RequestWithParams {
  params: {
    id?: string;
    [key: string]: any;
  };
}

export interface RequestWithBody {
  body: {
    [key: string]: any;
  };
}

export type ValidationFunction<T = unknown> = (value: T) => boolean;

export type StringOrNumber = string | number;
export type StringOrUndefined = string | undefined;
export type UnknownValue = unknown;