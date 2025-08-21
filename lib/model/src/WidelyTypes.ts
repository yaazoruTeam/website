// Specific types for Widely API responses to replace generic unknown types

interface WidelyEndpoint {
  endpoint_id: string;
  [key: string]: unknown;
}

interface WidelyUserData {
  domain_user_name?: string;
  name?: string;
  [key: string]: unknown;
}

interface WidelyCreationResult {
  data?: WidelyEndpoint[];
  [key: string]: unknown;
}

interface WidelyDeviceData {
  [key: string]: unknown;
}

interface WidelyContactData {
  [key: string]: unknown;
}

interface WidelyErrorData {
  error_code?: number;
  message?: string;
  [key: string]: unknown;
}

export {
  WidelyEndpoint,
  WidelyUserData,
  WidelyCreationResult,
  WidelyDeviceData,
  WidelyContactData,
  WidelyErrorData
};