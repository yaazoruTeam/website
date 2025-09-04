import axios, { AxiosResponse } from 'axios'
import { User } from '@model'

const baseUrl = `${import.meta.env.VITE_BASE_URL}/auth`

// POST
export const register = async (userData: User.Model): Promise<User.Model> => {
  try {
    const response: AxiosResponse<User.Model> = await axios.post(`${baseUrl}/register`, userData)
    return response.data
  } catch (error) {
    console.error('Error fetching register', error)
    throw error
  }
}

// POST
export const login = async (userPayload: {
  user_name: string
  password: string
}): Promise<string> => {
  try {
    const response: AxiosResponse<string> = await axios.post(`${baseUrl}/login`, userPayload)
    return response.data
  } catch (error) {
    console.error('Error creating customer', error)
    throw error
  }
}

// POST
export const refresh = async (): Promise<string> => {
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('No token found!')
    }
    const response: AxiosResponse<string> = await axios.post(
      `${baseUrl}/refresh`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    )
    return response.data
  } catch (error: unknown) {
    console.error('Error refresh token', error)
    throw error
  }
}
