import axios, { AxiosResponse } from 'axios'
import { User } from '../model/src'
import { handleTokenRefresh } from './token'

const baseUrl = 'http://localhost:3006/controller/user'

// GET
export const getUsers = async (): Promise<User.Model[]> => {
  try {
    const newToken = await handleTokenRefresh()
    if (!newToken) {
      return []
    }
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('No token found!')
    }
    const response: AxiosResponse<User.Model[]> = await axios.get(baseUrl, {
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
