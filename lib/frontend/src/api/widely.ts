import { Widely, WidelyDeviceDetails } from '@model'
import { 
  apiPost,
  safeApiGet,
  // PaginatedResponse 
} from './core/apiHelpers'

const ENDPOINT = '/widely'

export const getWidelyDetails = async (simNumber: string): Promise<WidelyDeviceDetails.Model> => {
  return safeApiGet<WidelyDeviceDetails.Model>(
    `${ENDPOINT}/get_all_user_data`,
    { simNumber } as WidelyDeviceDetails.Model
  )
}

export const terminateMobile = async (endpoint_id: number): Promise<Widely.Model> => {
  return apiPost<Widely.Model>(`${ENDPOINT}/terminate_mobile`, { endpoint_id })
}

export const terminateLine = async (endpoint_id: number): Promise<Widely.Model> => {
  return apiPost<Widely.Model>(`${ENDPOINT}/terminate_mobile`, { endpoint_id })
}

export const getPackagesWithInfo = async (): Promise<Widely.Model> => {
  return apiPost<Widely.Model>(`${ENDPOINT}/get_packages_with_info`, {})
}

export const changePackages = async (endpoint_id: number, package_id: number): Promise<Widely.Model> => {
  return apiPost<Widely.Model>(`${ENDPOINT}/update_mobile_subscription`, {
    endpoint_id,
    package_id
  })
}

export const resetVoicemailPincode = async (endpoint_id: number): Promise<Widely.Model> => {
  return apiPost<Widely.Model>(`${ENDPOINT}/prov_reset_vm_pincode`, { endpoint_id })
}