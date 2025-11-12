import { Widely, WidelyDeviceDetails, ReprovisionDeviceResponse } from '@model'
import {
  apiPost,
  apiPostPublic,
} from './core/apiHelpers'

const ENDPOINT = '/widely'

export const getWidelyDetails = async (simNumber: string): Promise<WidelyDeviceDetails.Model> => {
  return apiPost<WidelyDeviceDetails.Model>(
    `${ENDPOINT}/get_all_user_data`,
    { simNumber }
  )
}

export const getWidelyDetailsPublic = async (simNumber: string): Promise<WidelyDeviceDetails.Model> => {
  return apiPostPublic<WidelyDeviceDetails.Model>(
    `${ENDPOINT}/get_all_user_data_public`,
    { simNumber }
  )
}

export const terminateMobile = async (endpoint_id: number): Promise<Widely.Model> => {
  return apiPost<Widely.Model>(`${ENDPOINT}/terminate_mobile`, { endpoint_id })
}

export const terminateLine = async (endpoint_id: number): Promise<Widely.Model> => {
  return apiPost<Widely.Model>(`${ENDPOINT}/terminate_mobile`, { endpoint_id })
}

export const getPackagesWithInfo = async (package_types:'base' | 'extra'): Promise<Widely.Model> => {
  return apiPost<Widely.Model>(`${ENDPOINT}/get_packages_with_info`, { package_types })
}

export const changePackages = async (endpoint_id: number, package_id: number): Promise<Widely.Model> => {
  return apiPost<Widely.Model>(`${ENDPOINT}/update_mobile_subscription`, { endpoint_id, package_id })
}

export const addOneTimePackage = async (endpoint_id: number, domain_user_id: number, package_id: number): Promise<Widely.Model> => {
  return apiPost<Widely.Model>(`${ENDPOINT}/add_one_time_package`, { endpoint_id, domain_user_id, package_id })
}

export const resetVoicemailPincode = async (endpoint_id: number): Promise<Widely.Model> => {
  return apiPost<Widely.Model>(`${ENDPOINT}/prov_reset_vm_pincode`, { endpoint_id })
}

// ביטול והפעלה מחדש של המכשיר הנייד
export const reprovisionDevice = async (endpoint_id: number, name: string): Promise<ReprovisionDeviceResponse.Model> => {
  return apiPostPublic<ReprovisionDeviceResponse.Model>(`${ENDPOINT}/reset_device`, { endpoint_id, name })
}

// קבלת מידע על מכשיר נייד
export const getMobileInfo = async (endpoint_id: string): Promise<Widely.Model> => {
  return apiPost<Widely.Model>(`${ENDPOINT}/get_mobile_info`, { endpoint_id })
}

export const sendApn = async (endpoint_id: number): Promise<Widely.Model> => {
  return apiPost<Widely.Model>(`${ENDPOINT}/send_apn`, { endpoint_id })
}

export const setPreferredNetwork = async (endpoint_id: number, network: 'Pelephone_and_Partner' | 'Hot_and_Partner' | 'pelephone'): Promise<Widely.Model> => {
    return apiPost<Widely.Model>(`${ENDPOINT}/changeNetwork`, {
      endpoint_id: endpoint_id,
      network_name: network
    })
}

export const freezeUnfreezeMobile = async (endpoint_id: number, action: 'freeze' | 'unfreeze'): Promise<Widely.Model> => {
  return apiPost<Widely.Model>(`${ENDPOINT}/freeze_unfreeze_mobile`, {
    endpoint_id: endpoint_id,
    action: action
  })
}

export const lockUnlockImei = async (endpoint_id: number, iccid: string, action: boolean): Promise<Widely.Model> => {
  return apiPost<Widely.Model>(`${ENDPOINT}/lock_unlock_imei`, {
    endpoint_id: endpoint_id,
    iccid: iccid,
    action: action
  })
}

export const registerInHlr = async (endpoint_id: number): Promise<Widely.Model> => {
  return apiPost<Widely.Model>(`${ENDPOINT}/reregister_in_hlr`, { endpoint_id })
}

export const softResetDevice = async (endpoint_id: number): Promise<Widely.Model> => {
  return apiPost<Widely.Model>(`${ENDPOINT}/cancel_all_locations`, { endpoint_id })
}

