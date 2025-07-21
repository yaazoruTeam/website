import axios, { AxiosResponse } from 'axios'
import { MonthlyPayment } from '../model/src'
import { handleTokenRefresh } from './token'

const baseUrl = `${import.meta.env.VITE_BASE_URL}/monthlyPayment`
export interface PaginatedMonthlyPayments {
  data: MonthlyPayment.Model[]
  page: number
  totalPages: number
  total: number
}

// GET
export const getMonthlyPayment = async (page = 1): Promise<PaginatedMonthlyPayments> => {
  try {
    const newToken = await handleTokenRefresh()
    if (!newToken) {
      return { data: [], page, totalPages: 0, total: 0 }
    }
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('No token found!')
    }
    const response: AxiosResponse<PaginatedMonthlyPayments> = await axios.get(`${baseUrl}?page=${page}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  } catch (error) {
    console.error('Error fetching monthly payments', error)
    throw error
  }
}

// GET(id)
export const getMonthlyPaymentById = async (
  monthlyPayment_id: string,
): Promise<MonthlyPayment.Model> => {
  try {
    const newToken = await handleTokenRefresh()
    if (!newToken) {
      return {} as MonthlyPayment.Model
    }
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('No token found!')
    }
    const response: AxiosResponse<MonthlyPayment.Model> = await axios.get(
      `${baseUrl}/${monthlyPayment_id}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    )
    return response.data
  } catch (error) {
    console.error('Error fetching monthly payment id', error)
    throw error
  }
}

// GET(customer_id)
export const getMonthlyPaymentByCustomerId = async (
  customer_id: string, page = 1,
): Promise<PaginatedMonthlyPayments> => {
  try {
    const newToken = await handleTokenRefresh()
    if (!newToken) {
      return { data: [], page, totalPages: 0, total: 0 }
    }
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('No token found!')
    }
    const response: AxiosResponse<PaginatedMonthlyPayments> = await axios.get(
      `${baseUrl}/customer/${customer_id}?page=${page}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    )
    return response.data
  } catch (error) {
    console.error('Error fetching all monthly payments by customer id', error)
    throw error
  }
}

// GET(status)
export const getMonthlyPaymentByStatus = async (
  status: 'active' | 'inactive', page = 1,
): Promise<PaginatedMonthlyPayments> => {
  try {
    const newToken = await handleTokenRefresh()
    if (!newToken) {
      return { data: [], page, totalPages: 0, total: 0 }
    }
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('No token found!')
    }
    const response: AxiosResponse<PaginatedMonthlyPayments> = await axios.get(
      `${baseUrl}/status/${status}?page=${page}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    )
    return response.data
  } catch (error) {
    console.error('Error fetching monthly payments by status', error)
    throw error
  }
}

// GET(organization)
export const getMonthlyPaymentByOrganization = async (
  organization: string, page = 1,
): Promise<PaginatedMonthlyPayments> => {
  try {
    const newToken = await handleTokenRefresh()
    if (!newToken) {
      return { data: [], page, totalPages: 0, total: 0 }
    }
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('No token found!')
    }
    const response: AxiosResponse<PaginatedMonthlyPayments> = await axios.get(
      `${baseUrl}/organization/${organization}?page=${page}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    )
    return response.data
  } catch (error) {
    console.error('Error fetching monthly payments by organization', error)
    throw error
  }
}
