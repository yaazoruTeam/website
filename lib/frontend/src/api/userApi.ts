import axios, { AxiosResponse } from 'axios'
import { User } from '@model'
import { handleTokenRefresh } from './token'

const baseUrl = `${import.meta.env.VITE_BASE_URL}/user`

export interface PaginatedUsersResponse {
  data: User.Model[]
  total: number
  page?: number
  totalPages: number
}

// GET
export const getUsers = async (page: number = 1): Promise<PaginatedUsersResponse> => {
  try {
    const newToken = await handleTokenRefresh()
    if (!newToken) {
      return { data: [], total: 0, totalPages: 0 }
    }
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('No token found!')
    }
    const response: AxiosResponse<PaginatedUsersResponse> = await axios.get(`${baseUrl}?page=${page}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  } catch (error) {
    console.error('Error fetching users', error)
    throw error
  }
}

// GET
export const getUserById = async (user_id: string): Promise<User.Model> => {
  try {
    const newToken = await handleTokenRefresh()
    if (!newToken) {
      return {} as User.Model
    }
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('No token found!')
    }
    const response: AxiosResponse<User.Model> = await axios.get(`${baseUrl}/${user_id}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  } catch (error) {
    console.error('Error fetching user by id', error)
    throw error
  }
}
