import axios, { AxiosResponse, AxiosRequestConfig } from 'axios'
import { getAuthHeaders, getValidToken } from './tokenManager'

const baseURL = import.meta.env.VITE_BASE_URL

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page?: number
  totalPages: number
}

export interface ApiConfig<TFallback = unknown> extends AxiosRequestConfig {
  /** האם להחזיר fallback במקום לזרוק שגיאה */
  safe?: boolean
  /** ערך ברירת מחדל במידה ו-safe=true */
  fallback?: TFallback
  /** האם הבקשה צריכה authentication */
  requireAuth?: boolean
  /** פונקציה למעקב אחר התקדמות העלאה */
  onUploadProgress?: (progressEvent: any) => void
}

// פונקציה מרכזית לכל הבקשות
const makeRequest = async <T>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  url: string,
  data?: unknown,
  config: ApiConfig<T> = {}
): Promise<T> => {
  const { safe = false, fallback, requireAuth = true, onUploadProgress, ...axiosConfig } = config
  
  try {
    // וידוא טוקן אם נדרש
    if (requireAuth) {
      await getValidToken()
    }
    
    // קבלת headers
    const headers = requireAuth 
      ? await getAuthHeaders() 
      : { 'Content-Type': 'application/json' }
    
    const requestConfig = {
      ...axiosConfig,
      headers: { ...headers, ...axiosConfig?.headers },
      onUploadProgress,
    }
    
    let response: AxiosResponse<T>
    
    switch (method) {
      case 'GET':
        response = await axios.get(`${baseURL}${url}`, requestConfig)
        break
      case 'POST':
        response = await axios.post(`${baseURL}${url}`, data, requestConfig)
        break
      case 'PUT':
        response = await axios.put(`${baseURL}${url}`, data, requestConfig)
        break
      case 'DELETE':
        response = await axios.delete(`${baseURL}${url}`, requestConfig)
        break
    }
    
    return response.data
  } catch (error) {
    console.error(`Error in ${method} ${url}:`, error)
    
    // אם safe mode - החזר fallback
    if (safe && fallback !== undefined) {
      return fallback
    }
    
    throw error
  }
}

// פונקציות ה-API החדשות - אחידות וגמישות
export const apiGet = async <T>(url: string, config: ApiConfig<T> = {}): Promise<T> => {
  return makeRequest<T>('GET', url, undefined, config)
}

export const apiPost = async <T>(url: string, data?: unknown, config: ApiConfig<T> = {}): Promise<T> => {
  return makeRequest<T>('POST', url, data, config)
}

export const apiPut = async <T>(url: string, data?: unknown, config: ApiConfig<T> = {}): Promise<T> => {
  return makeRequest<T>('PUT', url, data, config)
}

export const apiDelete = async <T>(url: string, config: ApiConfig<T> = {}): Promise<T> => {
  return makeRequest<T>('DELETE', url, undefined, config)
}

export const apiDeleteById = async <T>(endpoint: string, id: string | number, config: ApiConfig<T> = {}): Promise<T> => {
  return apiDelete<T>(`${endpoint}/${id}`, config)
}

// פונקציות לבקשות ללא טוקן (public)
export const apiGetPublic = async <T>(url: string, config: Omit<ApiConfig<T>, 'requireAuth'> = {}): Promise<T> => {
  return apiGet<T>(url, { ...config, requireAuth: false })
}

export const apiPostPublic = async <T>(url: string, data?: unknown, config: Omit<ApiConfig<T>, 'requireAuth'> = {}): Promise<T> => {
  return apiPost<T>(url, data, { ...config, requireAuth: false })
}

// פונקציות עם safe mode מובנה
export const safeApiGet = async <T>(url: string, fallback: T, config: Omit<ApiConfig<T>, 'safe' | 'fallback'> = {}): Promise<T> => {
  return apiGet<T>(url, { ...config, safe: true, fallback })
}

export const safePaginated = async <T>(
  endpoint: string,
  page: number = 1,
  config: Omit<ApiConfig<PaginatedResponse<T>>, 'safe' | 'fallback'> = {}
): Promise<PaginatedResponse<T>> => {
  const fallback: PaginatedResponse<T> = { data: [], total: 0, page, totalPages: 0 }
  return apiGet<PaginatedResponse<T>>(`${endpoint}?page=${page}`, { 
    ...config, 
    safe: true, 
    fallback 
  })
}

// Aliases לתאימות עם קוד קיים
export const safeGetPaginated = safePaginated
export const safeGet = safeApiGet
export const getPaginatedData = <T>(endpoint: string, page: number = 1): Promise<PaginatedResponse<T>> => {
  return apiGet<PaginatedResponse<T>>(`${endpoint}?page=${page}`)
}