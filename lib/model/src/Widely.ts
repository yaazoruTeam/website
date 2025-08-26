// Base API response interface
interface Model {
  status: string
  error_code: number
  message: string
  data: UserData[] | MobileData[] | PackageData[] | Record<string, unknown>[] | Record<string, unknown> | unknown[]
}

// Specific data types for different API responses
interface UserData {
  domain_user_name?: string
  name?: string
  domain_user_id?: string | number
  [key: string]: unknown
}

interface MobileData {
  endpoint_id?: string | number
  imei?: string
  status?: string
  device_info?: {
    brand?: string
    model?: string
    name?: string
  }
  sim_data?: {
    msisdn?: string
    iccid?: string
    lock_on_first_imei?: boolean
  }
  registration_info?: {
    msisdn?: string
  }
  package_id?: string | number
  service_id?: string | number
  active?: boolean
  domain_user_id?: string | number
  iccid?: string
  dids?: Array<{
    purchase_type: string
    type: string
    country: string
    sms_to_mail?: string
  }>
  [key: string]: unknown
}

interface PackageData {
  package_id?: string | number
  name?: string
  [key: string]: unknown
}

// Type guards for specific data types
function isUserDataArray(data: unknown): data is UserData[] {
  return Array.isArray(data) && (data.length === 0 || (typeof data[0] === 'object' && data[0] !== null))
}

function isMobileDataArray(data: unknown): data is MobileData[] {
  return Array.isArray(data) && (data.length === 0 || (typeof data[0] === 'object' && data[0] !== null))
}

export { Model, UserData, MobileData, PackageData, isUserDataArray, isMobileDataArray }
