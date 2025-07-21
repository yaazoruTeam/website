import axios, { AxiosResponse } from 'axios'
import { handleTokenRefresh } from './token'
import { CustomerDevice } from '../model/src'

const baseUrl = `${import.meta.env.VITE_BASE_URL}/customerDevice`

export interface PaginatedCustomerDeviceResponse {
  data: CustomerDevice.Model[]
  total: number
  page?: number
  totalPages: number
}

// GET
export const getAllCustomerDevicesByCustomerId = async (customer_id: string, page: number): Promise<PaginatedCustomerDeviceResponse> => {
  try {
    const newToken = await handleTokenRefresh()
    if (!newToken) {
      return { data: [], total: 0, totalPages: 0 }
    }
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('No token found!')
    }
    const response: AxiosResponse<PaginatedCustomerDeviceResponse> = await axios.get(
      `${baseUrl}/allDevices/${customer_id}?page=${page}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
    return response.data
  } catch (error) {
    console.error('Error fetching device by customer id', error)
    throw error
  }
}

// GET customer device by device_id - שליפה לפי מספר מכשיר
export const getCustomerDeviceByDeviceId = async (device_id: string): Promise<CustomerDevice.Model | null> => {
  try {
    const newToken = await handleTokenRefresh()
    if (!newToken) {
      return null
    }
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('No token found!')
    }
    const response: AxiosResponse<PaginatedCustomerDeviceResponse> = await axios.get(
      `${baseUrl}/device/${device_id}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
    // מחזיר את הרשומה הראשונה אם קיימת
    return response.data.data.length > 0 ? response.data.data[0] : null
  } catch (error) {
    console.error('Error fetching customer device by device id', error)
    return null // במקרה של שגיאה, מחזיר null במקום לזרוק שגיאה
  }
}
