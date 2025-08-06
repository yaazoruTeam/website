import axios, { AxiosResponse, AxiosRequestConfig } from 'axios'
import { getAuthHeaders, getValidToken } from './tokenManager'

const baseURL = import.meta.env.VITE_BASE_URL

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page?: number
  totalPages: number
}

// פונקציות גנריות לשימוש חוזר
export const apiGet = async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  try {
    const headers = await getAuthHeaders()
    const response: AxiosResponse<T> = await axios.get(`${baseURL}${url}`, {
      ...config,
      headers: { ...headers, ...config?.headers },
    })
    return response.data
  } catch (error) {
    console.error(`Error in GET ${url}:`, error)
    throw error
  }
}

export const apiPost = async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
  try {
    const headers = await getAuthHeaders()
    const response: AxiosResponse<T> = await axios.post(`${baseURL}${url}`, data, {
      ...config,
      headers: { ...headers, ...config?.headers },
    })
    return response.data
  } catch (error) {
    console.error(`Error in POST ${url}:`, error)
    throw error
  }
}

export const apiPut = async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
  try {
    const headers = await getAuthHeaders()
    const response: AxiosResponse<T> = await axios.put(`${baseURL}${url}`, data, {
      ...config,
      headers: { ...headers, ...config?.headers },
    })
    return response.data
  } catch (error) {
    console.error(`Error in PUT ${url}:`, error)
    throw error
  }
}

export const apiDelete = async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  try {
    const headers = await getAuthHeaders()
    const response: AxiosResponse<T> = await axios.delete(`${baseURL}${url}`, {
      ...config,
      headers: { ...headers, ...config?.headers },
    })
    return response.data
  } catch (error) {
    console.error(`Error in DELETE ${url}:`, error)
    throw error
  }
}

// פונקציות לבקשות ללא טוקן
export const apiGetPublic = async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await axios.get(`${baseURL}${url}`, config)
    return response.data
  } catch (error) {
    console.error(`Error in public GET ${url}:`, error)
    throw error
  }
}

export const apiPostPublic = async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await axios.post(`${baseURL}${url}`, data, config)
    return response.data
  } catch (error) {
    console.error(`Error in public POST ${url}:`, error)
    throw error
  }
}

// פונקציה גנרית לקבלת נתונים עם pagination
export const getPaginatedData = async <T>(
  endpoint: string,
  page: number = 1
): Promise<PaginatedResponse<T>> => {
  return await apiGet<PaginatedResponse<T>>(`${endpoint}?page=${page}`)
}

// פונקציות גנריות עם safe fallback
export const safeApiGet = async <T>(url: string, fallback: T): Promise<T> => {
  try {
    await getValidToken() // וידוא שהטוקן תקין
    return await apiGet<T>(url)
  } catch (error) {
    console.error(`Safe API GET failed for ${url}:`, error)
    return fallback
  }
}

export const safeGetPaginated = async <T>(
  endpoint: string,
  page: number = 1
): Promise<PaginatedResponse<T>> => {
  try {
    await getValidToken() // וידוא שהטוקן תקין
    return await getPaginatedData<T>(endpoint, page)
  } catch (error) {
    console.error(`Safe paginated GET failed for ${endpoint}:`, error)
    return { data: [], total: 0, page, totalPages: 0 }
  }
}