// Base Widely API response structure
interface Model {
  status: string
  error_code: number
  message: string
  data: WidelyData[]
}

// Data types that can be returned by Widely API
interface WidelyUserData {
  domain_user_id: number
  domain_user_name?: string
  name?: string
  [key: string]: unknown
}

interface WidelyMobileData {
  endpoint_id: number
  domain_user_id: number
  network_connection?: string
  data_usage_gb?: number
  max_data_gb?: number
  imei1?: string
  status?: string
  imei_lock?: string
  msisdn?: string
  iccid?: string
  package_id?: string
  service_id?: string | number
  active?: boolean
  dids?: Array<{
    purchase_type: string
    type: string
    country: string
    sms_to_mail?: string
  }>
  // Additional fields found in API responses
  subscriptions?: Array<{
    data?: Array<{
      usage?: number
    }>
  }>
  data_used?: number
  data_limit?: number
  registration_info?: {
    plmn_name?: string
    imei?: string
    status?: string
    msisdn?: string
  }
  sim_data?: {
    locked_imei?: string
    lock_on_first_imei?: boolean
    msisdn?: string
    iccid?: string
  }
  device_info?: {
    brand?: string
    model?: string
    name?: string
  }
  [key: string]: unknown
}

interface WidelyPackageData {
  package_id: number
  package_name: string
  package_type: string
  price?: number
  description?: string
  [key: string]: unknown
}

// Union type for all possible data types
type WidelyData = WidelyUserData | WidelyMobileData | WidelyPackageData | Record<string, unknown>

// Interface for creating a new DID (Direct Inward Dialing)
interface CreateDidRequest {
  purchase_type: 'new' | 'port'
  number?: string // Required for port operations
  number_type?: string | null // For port operations, can be null or "U"
  auth_id?: string // Required for port operations
  type?: 'mobile' | 'landline' | 'kosher' // Required for new purchases
  country?: string // Required for new purchases, ISO2 format like 'IL'
  ring_to?: Array<{ endpoint_id: number }> // Array of mobile IDs to ring
  assign_to_package?: boolean // Whether to assign to subscription
  domain_user_id?: number // Optional domain user ID
  sms_to_mail?: string // Email address for SMS forwarding
}

// Interface for the API request payload to WIDELY (extends CreateDidRequest with system fields)
interface WidelyCreateDidPayload extends CreateDidRequest {
  fake: boolean // System field for WIDELY API
  [key: string]: unknown // Allow additional properties
}

export { Model, WidelyUserData, WidelyMobileData, WidelyPackageData, WidelyData, CreateDidRequest, WidelyCreateDidPayload }
