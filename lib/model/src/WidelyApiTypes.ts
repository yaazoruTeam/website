// Type definitions for Widely API responses and related data structures

interface RegistrationInfo {
  mcc_mnc?: string
  imei?: string
  status?: string
  msisdn?: string
}

interface SimData {
  locked_imei?: string
  lock_on_first_imei?: boolean
  msisdn?: string
  iccid?: string
}

interface DeviceInfo {
  brand?: string
  model?: string
  name?: string
}

interface DataUsage {
  usage?: number
}

interface SubscriptionData {
  data?: DataUsage[]
}

interface Subscription {
  data?: DataUsage[]
}

interface WidelyDevice {
  domain_user_id?: number
  endpoint_id?: number | string
  registration_info?: RegistrationInfo
  sim_data?: SimData
  device_info?: DeviceInfo
  subscriptions?: Subscription[]
  data_used?: number
  data_limit?: number
  iccid?: string
  package_id?: number
  active?: boolean
}

interface WidelyUser {
  domain_user_id?: number
  domain_user_name?: string
  name?: string
}

interface WidelySearchResult extends WidelyUser {
  domain_user_name?: string
  name?: string
}

interface WidelyMobileResult extends WidelyDevice {
  endpoint_id?: number | string
}

interface WidelyMobileInfoResult extends WidelyDevice {}

// Request data interfaces
interface WidelyRequestData {
  account_id?: number
  search_string?: string
  domain_user_id?: number | string
  endpoint_id?: number | string
  [key: string]: unknown
}

// Export all types
export {
  RegistrationInfo,
  SimData,
  DeviceInfo,
  DataUsage,
  SubscriptionData,
  Subscription,
  WidelyDevice,
  WidelyUser,
  WidelySearchResult,
  WidelyMobileResult,
  WidelyMobileInfoResult,
  WidelyRequestData
}