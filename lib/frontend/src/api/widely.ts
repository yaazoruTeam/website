import axios, { AxiosResponse } from 'axios'
import { handleTokenRefresh } from './token'
import { Widely, WidelyDeviceDetails } from '@model'

const baseUrl = `${import.meta.env.VITE_BASE_URL}/widely`

const getValidToken = async (): Promise<string> => {
  const newToken = await handleTokenRefresh()
  if (!newToken) {
    throw new Error('Token refresh failed!')
  }
  return newToken
}
export const getWidelyDetails = async (simNumber: string): Promise<WidelyDeviceDetails.Model> => {
  const newToken = await handleTokenRefresh()
  if (!newToken) {
    return {} as WidelyDeviceDetails.Model
  }
  const token = localStorage.getItem('token')
  if (!token) {
    throw new Error('No token found!')
  }

  const response: AxiosResponse<WidelyDeviceDetails.Model> = await axios.post(
    `${baseUrl}/get_all_user_data`,
    {
      simNumber: simNumber,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
  )
  
  return response.data
}


export const terminateMobile = async (endpoint_id: number): Promise<Widely.Model> => {
  try {
    const token = await getValidToken()
    const response: AxiosResponse<Widely.Model> = await axios.post(`${baseUrl}/terminate_mobile`, {
      endpoint_id: endpoint_id
    }, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  } catch (error) {
    console.error('Error terminating mobile', error)
    throw error
  }
}

export const terminateLine = async (endpoint_id: number): Promise<Widely.Model> => {
  try {
    const token = await getValidToken()
    const response: AxiosResponse<Widely.Model> = await axios.post(`${baseUrl}/terminate_mobile`, {
         endpoint_id: endpoint_id
    }, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  } catch (error) {
    console.error('Error terminating line', error)
    throw error
  }
}

export const getPackagesWithInfo = async (): Promise<Widely.Model> => {
  try {
    const token = await getValidToken()
    const response: AxiosResponse<Widely.Model> = await axios.post(`${baseUrl}/get_packages_with_info`, {}, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    
    return response.data
  } catch (error) {
    console.error('Error fetching packages with info', error)
    throw error
  }
}

export const changePackages = async (endpoint_id: number, package_id: number): Promise<Widely.Model> => {
  try {
    const token = await getValidToken()
    const response: AxiosResponse<Widely.Model> = await axios.post(`${baseUrl}/update_mobile_subscription`, {
      endpoint_id,
      package_id
    }, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })

    return response.data
  } catch (error) {
    console.error('Error changing packages', error)
    throw error
  }
}

export const resetVoicemailPincode = async (endpoint_id: number): Promise<Widely.Model> => {
  try {
    const token = await getValidToken()
    const response: AxiosResponse<Widely.Model> = await axios.post(`${baseUrl}/prov_reset_vm_pincode`, {
      endpoint_id: endpoint_id
    }, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  } catch (error) {
    console.error('Error resetting voicemail pincode', error)
    throw error
  }
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