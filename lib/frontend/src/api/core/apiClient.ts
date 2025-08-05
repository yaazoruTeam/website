import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { getAuthHeaders } from './tokenManager'

class ApiClient {
  private client: AxiosInstance


  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_BASE_URL,
    })
  }

  private async makeRequest<T>(
    method: 'get' | 'post' | 'put' | 'delete',
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const headers = await getAuthHeaders()
      const response: AxiosResponse<T> = await this.client[method](url, data, {
        ...config,
        headers: { ...headers, ...config?.headers },
      })
      return response.data
    } catch (error) {
      console.error(`Error in ${method.toUpperCase()} ${url}:`, error)
      throw error
    }
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.makeRequest<T>('get', url, undefined, config)
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.makeRequest<T>('post', url, data, config)
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.makeRequest<T>('put', url, data, config)
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.makeRequest<T>('delete', url, undefined, config)
  }

  // בשביל בקשות ללא טוקן
  async getPublic<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.get(url, config)
    return response.data
  }

  async postPublic<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.post(url, data, config)
    return response.data
  }
}

export const apiClient = new ApiClient()
