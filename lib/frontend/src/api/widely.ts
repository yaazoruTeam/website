import { Widely, WidelyDeviceDetails } from '@model'
import { 
  apiPost,
} from './core/apiHelpers'

const ENDPOINT = '/widely'

export const getWidelyDetails = async (simNumber: string): Promise<WidelyDeviceDetails.Model> => {
  return apiPost<WidelyDeviceDetails.Model>(
    `${ENDPOINT}/get_all_user_data`,
    { simNumber } 
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

// איפוס מקיף של מכשיר כטרנזקציה
export const ComprehensiveResetDevice = async (endpoint_id: number | string, name: string): Promise<{
  success: boolean
  message: string
  data: {
    originalInfo: any
    terminationSuccess: boolean
    creationSuccess: boolean
    newEndpointId: string | null
    terminationResult: Widely.Model
    creationResult: Widely.Model
  }
}> => {
  try {
    const token = await getValidToken()
    const response = await axios.post(`${baseUrl}/reset_device`, {
      endpoint_id,
      name
    }, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    
    return response.data
  } catch (error) {
    console.error('Error resetting device', error)
    throw error
  }
}

// קבלת מידע על מכשיר נייד
export const getMobileInfo = async (endpoint_id: string): Promise<Widely.Model> => {
  try {
    const token = await getValidToken()
    const response: AxiosResponse<Widely.Model> = await axios.post(`${baseUrl}/get_mobile_info`, {
      endpoint_id,
    }, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })

    return response.data
  } catch (error) {
    console.error('Error getting mobile info', error)
    throw error
  }
}

export const sendApn = async (endpoint_id: number): Promise<Widely.Model> => {
  try {
    const token = await getValidToken()
    const response: AxiosResponse<Widely.Model> = await axios.post(
      `${baseUrl}/send_apn`,
      { endpoint_id },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    )
    return response.data
  } catch (error) {
    console.error('Error sending APN', error)
    throw error
  }
}