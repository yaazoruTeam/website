import axios, { AxiosResponse } from 'axios'
import { Customer } from '../model/src'
import { handleTokenRefresh } from './token'

const baseUrl = `${import.meta.env.VITE_BASE_URL}/customer`
export interface PaginatedCustomersResponse {
  data: Customer.Model[]
  total: number
  page?: number
  totalPages: number
}

// GET
export const getCustomers = async (page: number): Promise<PaginatedCustomersResponse> => {
  try {
    const newToken = await handleTokenRefresh()
    if (!newToken) {
      return { data: [], total: 0, totalPages: 1 }
    }
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('No token found!')
    }
    const response: AxiosResponse<PaginatedCustomersResponse> = await axios.get(`${baseUrl}?page=${page}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  } catch (error) {
    console.error('Error fetching customers', error)
    throw error
  }
}

//GET(id)
export const getCustomerById = async (cusomer_id: string): Promise<Customer.Model> => {
  try {
    const newToken = await handleTokenRefresh()
    if (!newToken) {
      return {} as Customer.Model
    }
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('No token found!')
    }
    const url = `${baseUrl}/${cusomer_id}`
    const response: AxiosResponse<Customer.Model> = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  } catch (error) {
    console.error('Error fetching customer by id', error)
    throw error
  }
}

//GET(city)
export const getCustomersByCity = async (city: string, page: number = 1): Promise<PaginatedCustomersResponse> => {
  try {
    console.log('Fetching customers by city:', city, 'Page:', page)

    const newToken = await handleTokenRefresh()
    if (!newToken) {
      return { data: [], total: 0, totalPages: 1 }
    }
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('No token found!')
    }
    const response: AxiosResponse<PaginatedCustomersResponse> = await axios.get(`${baseUrl}/city/${city}?page=${page}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    console.log('Response data:', response.data)

    return response.data
  } catch (error) {
    console.error('Error fetching customers by city', error)
    throw error
  }
}

//GET(status)
export const getCustomersByStatus = async (
  status: 'active' | 'inactive',
  page: number = 1,
): Promise<PaginatedCustomersResponse> => {
  try {
    const newToken = await handleTokenRefresh()
    if (!newToken) {
      return { data: [], total: 0, totalPages: 1 }
    }
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('No token found!')
    }
    const response: AxiosResponse<PaginatedCustomersResponse> = await axios.get(
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
    console.error('Error fetching customers by status', error)
    throw error
  }
}

//GET(dates)
export const getCustomersByDateRange = async (startDate: Date, endDate: Date, page: number = 1): Promise<PaginatedCustomersResponse> => {
  try {
    const newToken = await handleTokenRefresh()
    if (!newToken) {
      return { data: [], total: 0, totalPages: 1 }
    }
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('No token found!')
    }
    
    const startDateStr = startDate.toISOString().split('T')[0]
    const endDateStr = endDate.toISOString().split('T')[0]
        
    const response: AxiosResponse<PaginatedCustomersResponse> = await axios.get(
      `${baseUrl}/dates?startDate=${startDateStr}&endDate=${endDateStr}&page=${page}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
    return response.data
  } catch (error) {
    console.error('Error fetching customers by dates', error)
    throw error
  }
}

//GET(cities)
export const getCities = async (): Promise<string[]> => {
  try {
    const response: AxiosResponse<string[]> = await axios.get(`${baseUrl}/cities`)
    return response.data
  } catch (error) {
    console.error('Error fetching cities', error)
    throw error
  }
}

//GET(name) - search customers by name
export const getCustomersByName = async (name: string, page: number = 1): Promise<PaginatedCustomersResponse> => {
  try {
    const newToken = await handleTokenRefresh()
    if (!newToken) {
      return { data: [], total: 0, totalPages: 1 }
    }
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('No token found!')
    }
    const response: AxiosResponse<PaginatedCustomersResponse> = await axios.get(`${baseUrl}/search?q=${name}&page=${page}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  } catch (error) {
    console.error('Error fetching customers by name', error)
    throw error
  }
}


// POST
export const createCustomer = async (customerData: Customer.Model): Promise<Customer.Model> => {
  try {
    const newToken = await handleTokenRefresh()
    if (!newToken) {
      return {} as Customer.Model
    }
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('No token found!')
    }
    const response: AxiosResponse<Customer.Model> = await axios.post(baseUrl, customerData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  } catch (error) {
    console.error('Error creating customer', error)
    throw error
  }
}

// PUT
export const updateCustomer = async (
  customerId: number,
  customerData: Customer.Model,
): Promise<Customer.Model> => {
  try {
    const response: AxiosResponse<Customer.Model> = await axios.put(
      `${baseUrl}/${customerId}`,
      customerData,
    )
    return response.data
  } catch (error) {
    console.error('Error updating customer', error)
    throw error
  }
}

// DELETE
export const deleteCustomer = async (customerId: number): Promise<Customer.Model> => {
  try {
    const newToken = await handleTokenRefresh()
    if (!newToken) {
      return {} as Customer.Model
    }
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('No token found!')
    }
    const response: AxiosResponse<Customer.Model> = await axios.delete(`${baseUrl}/${customerId}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  } catch (error) {
    console.error('Error deleting customer', error)
    throw error
  }
}
