import axios, { AxiosResponse } from 'axios'
import { handleTokenRefresh } from './token'
import { WidelyDeviceDetails } from '../model'

const baseUrl = 'http://localhost:3006/controller/widely'

// GET
export const getWidelyDetails = async (simNumber: string): Promise<WidelyDeviceDetails.Model> => {
  try {
    const newToken = await handleTokenRefresh()
    if (!newToken) {
      return { } as WidelyDeviceDetails.Model
    }
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('No token found!')
    }
    const response: AxiosResponse<any> = await axios.post(`${baseUrl}/get_all_user_data`, {
      simNumber: simNumber
    }, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  } catch (error) {
    console.error('Error fetching widely details', error)
    throw error
  }
}
