import axios, { AxiosResponse } from 'axios'
import { Device } from '../model/src'
import { handleTokenRefresh } from './token'

// const baseUrl = `${process.env.BASE_URL}/customer`
const baseUrl = 'http://localhost:3006/controller/device'

export interface PaginatedDeviceResponse {
  data: Device.Model[]
  total: number
  page?: number
  totalPages: number
}

// GET
export const getDevices = async (page: number): Promise<PaginatedDeviceResponse> => {
  try {
    const newToken = await handleTokenRefresh()
    if (!newToken) {
      return {
        data: [],
        total: 0,
        page,
        totalPages: 0,
      }
    }
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('No token found!')
    }
    const response: AxiosResponse<PaginatedDeviceResponse> = await axios.get(
      `${baseUrl}?page=${page}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    )
    return response.data
  } catch (error) {
    console.error('Error fetching devices', error)
    throw error
  }
}

//GET(id)
export const getDeviceById = async (device_id: string): Promise<Device.Model> => {
  try {
    const newToken = await handleTokenRefresh()
    if (!newToken) {
      throw new Error('Failed to refresh token')
    }
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('No token found!')
    }
    const response: AxiosResponse<Device.Model> = await axios.get(`${baseUrl}/${device_id}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  } catch (error: any) {
    console.error('Error fetching device by id', error)
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw new Error(
          `API Error: ${error.response.status} - ${error.response.data.message || error.response.statusText}`,
        )
      } else if (error.request) {
        throw new Error('No response received from the server')
      }
    }
    throw new Error(error.message || 'An unknown error occurred')
  }
}
