import { Customer } from '@model'
import { 
  apiGet, 
  apiPost, 
  apiPut, 
  apiDeleteById, 
  apiGetPublic,
  safeGetPaginated,
  PaginatedResponse 
} from './core/apiHelpers'

const ENDPOINT = '/customer'

export type PaginatedCustomersResponse = PaginatedResponse<Customer.Model>

// GET
export const getCustomers = async (page: number): Promise<PaginatedCustomersResponse> => {
  return safeGetPaginated<Customer.Model>(ENDPOINT, page)
}

// GET(id)
export const getCustomerById = async (customerId: string): Promise<Customer.Model> => {
  return apiGet<Customer.Model>(`${ENDPOINT}/${customerId}`)
}

// GET(city)
export const getCustomersByCity = async (
  city: string,
  page: number = 1,
): Promise<PaginatedCustomersResponse> => {
  return apiGet<PaginatedCustomersResponse>(`${ENDPOINT}/city/${city}/page/${page}`)
}

// GET(status)
export const getCustomersByStatus = async (
  status: 'active' | 'inactive',
  page: number = 1,
): Promise<PaginatedCustomersResponse> => {
  return apiGet<PaginatedCustomersResponse>(`${ENDPOINT}/status/${status}/page/${page}`)
}

// GET(dates)
export const getCustomersByDateRange = async (
  startDate: Date,
  endDate: Date,
  page: number = 1,
): Promise<PaginatedCustomersResponse> => {
  const startDateStr = startDate.toISOString().split('T')[0]
  const endDateStr = endDate.toISOString().split('T')[0]
  
  return safeGetPaginated<Customer.Model>(
    `${ENDPOINT}/dates/page/${page}?startDate=${startDateStr}&endDate=${endDateStr}`,
    page
  )
}

// GET(cities)
export const getCities = async (): Promise<string[]> => {
  return apiGetPublic<string[]>(`${ENDPOINT}/cities`)
}

// GET(name) - search customers by name
export const getCustomersByName = async (
  name: string,
  page: number = 1,
): Promise<PaginatedCustomersResponse> => {
  return apiGet<PaginatedCustomersResponse>(`${ENDPOINT}/search/page/${page}?q=${name}`)
}

// POST
export const createCustomer = async (customerData: Customer.Model): Promise<Customer.Model> => {
  return apiPost<Customer.Model>(ENDPOINT, customerData)
}

// PUT
export const updateCustomer = async (
  customerId: number,
  customerData: Customer.Model,
): Promise<Customer.Model> => {
  return apiPut<Customer.Model>(`${ENDPOINT}/${customerId}`, customerData)
}

// DELETE
export const deleteCustomer = async (customerId: number): Promise<Customer.Model> => {
  return apiDeleteById<Customer.Model>(ENDPOINT, customerId)
}
