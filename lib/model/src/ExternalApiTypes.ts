/**
 * Types for external API integrations
 */

/**
 * Widely API device information
 */
export interface WidelyDeviceInfo {
  endpoint_id: string
  name?: string
  status?: string
  sim_number?: string
  imei?: string
  network?: string
  [key: string]: unknown // For additional properties that may come from the API
}

/**
 * Widely API package information
 */
export interface WidelyPackageInfo {
  package_id: string
  name: string
  price?: number
  description?: string
  [key: string]: unknown
}

/**
 * Widely API response data union type
 */
export type WidelyApiData = WidelyDeviceInfo | WidelyPackageInfo | Record<string, unknown>

/**
 * Tranzila API request data
 */
export interface TranzilaRequestData {
  terminal_name: string
  amount: string
  contact: string
  currency?: string
  [key: string]: unknown
}

/**
 * Tranzila API response data
 */
export interface TranzilaResponseData {
  success: boolean
  transaction_id?: string
  error_message?: string
  [key: string]: unknown
}

/**
 * Tranzila hosted fields options
 */
export interface TranzilaHostedFieldsOptions {
  sandbox: boolean
  fields: {
    credit_card_number: TranzilaFieldOptions
    cvv: TranzilaFieldOptions
    expiry: TranzilaFieldOptions
  }
}

/**
 * Tranzila field options
 */
export interface TranzilaFieldOptions {
  selector: string
  placeholder: string
  tabindex: number
  version?: string
}

/**
 * Tranzila hosted fields instance interface
 */
export interface TranzilaHostedFieldsInstance {
  charge(data: TranzilaRequestData, callback: (error: Error | null, response: TranzilaResponseData | null) => void): void
}

/**
 * Tranzila hosted fields global interface
 */
export interface TranzilaHostedFields {
  create(options: TranzilaHostedFieldsOptions): TranzilaHostedFieldsInstance
  destroy(): void
}