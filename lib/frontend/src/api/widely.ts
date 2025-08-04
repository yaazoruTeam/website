import axios, { AxiosResponse } from 'axios'
import { handleTokenRefresh } from './token'
import { Widely, WidelyDeviceDetails } from '../model'

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
    const newToken = await handleTokenRefresh()
    if (!newToken) {
      return {} as Widely.Model
    }
    const token = newToken
    if (!token) {
      throw new Error('No token found!')
    }
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

export const freezeUnfreezeMobile = async (endpoint_id: number, action: 'freeze' | 'unfreeze'): Promise<Widely.Model> => {
  try {    
    const token = await getValidToken()
    const response: AxiosResponse<Widely.Model> = await axios.post(`${baseUrl}/freeze_unfreeze_mobile`, {
      endpoint_id: endpoint_id,
      action: action
    }, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  } catch (error) {
    console.error('Error freezing/unfreezing mobile', error)
    throw error
  }
}

export const lockUnlockImei = async (endpoint_id: number, iccid: string, action: boolean): Promise<Widely.Model> => {
  try {
    const token = await getValidToken()
    const response: AxiosResponse<Widely.Model> = await axios.post(`${baseUrl}/lock_unlock_imei`, {
      endpoint_id: endpoint_id,
      iccid: iccid,
      action: action
    }, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  } catch (error) {
    console.error('Error locking/unlocking IMEI', error)
    throw error
  }
}
