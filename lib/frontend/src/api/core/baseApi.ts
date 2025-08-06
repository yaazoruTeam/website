import { apiClient } from './apiClient'

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page?: number
  totalPages: number
}

export class BaseApi {
  protected baseUrl: string

  constructor(endpoint: string) {
    this.baseUrl = `/${endpoint}`
  }

  protected async getPaginated<T>(
    url: string,
    page: number = 1
  ): Promise<PaginatedResponse<T>> {
    try {
      return await apiClient.get<PaginatedResponse<T>>(`${url}?page=${page}`)
    } catch (error) {
      console.error(`Error fetching paginated data from ${url}:`, error)
      return { data: [], total: 0, page, totalPages: 0 }
    }
  }

  protected async getById<T>(id: string): Promise<T> {
    return await apiClient.get<T>(`${this.baseUrl}/${id}`)
  }

  protected async create<T>(data: T): Promise<T> {
    return await apiClient.post<T>(this.baseUrl, data)
  }

  protected async update<T>(id: string, data: T): Promise<T> {
    return await apiClient.put<T>(`${this.baseUrl}/${id}`, data)
  }

  protected async delete<T>(id: string): Promise<T> {
    return await apiClient.delete<T>(`${this.baseUrl}/${id}`)
  }
}
