import { User } from '@model'
import { 
  apiGet,
  safeGetPaginated,
  // PaginatedResponse 
} from './core/apiHelpers'

const ENDPOINT = '/user'

export interface PaginatedUsersResponse {
  data: User.Model[]
  total: number
  page?: number
  totalPages: number
}

export const getUsers = async (page: number = 1): Promise<PaginatedUsersResponse> => {
  return safeGetPaginated<User.Model>(ENDPOINT, page)
}

export const getUserById = async (user_id: string): Promise<User.Model> => {
  return apiGet<User.Model>(`${ENDPOINT}/${user_id}`)
}
