import { MonthlyPayment } from '@model'
import { 
  safeGetPaginated,
  apiGet,
  PaginatedResponse 
} from './core/apiHelpers'

const ENDPOINT = '/monthlyPayment'


export const getMonthlyPayment = async (page = 1): Promise<PaginatedResponse<MonthlyPayment.Model>> => {
  return await safeGetPaginated<MonthlyPayment.Model>(ENDPOINT, page)
}

export const getMonthlyPaymentById = async (
  monthlyPayment_id: string,
): Promise<MonthlyPayment.Model> => {
  return apiGet<MonthlyPayment.Model>(`${ENDPOINT}/${monthlyPayment_id}`)
}

export const getMonthlyPaymentByCustomerId = async (
  customer_id: string, 
  page = 1,
): Promise<PaginatedResponse<MonthlyPayment.Model>> => {
  return await safeGetPaginated<MonthlyPayment.Model>(`${ENDPOINT}/customer/${customer_id}`, page)
}

export const getMonthlyPaymentByStatus = async (
  status: 'active' | 'inactive', 
  page = 1,
): Promise<PaginatedResponse<MonthlyPayment.Model>> => {
  return await safeGetPaginated<MonthlyPayment.Model>(`${ENDPOINT}/status/${status}`, page)
}

export const getMonthlyPaymentByOrganization = async (
  organization: string, 
  page = 1,
): Promise<PaginatedResponse<MonthlyPayment.Model>> => {
  return await safeGetPaginated<MonthlyPayment.Model>(`${ENDPOINT}/organization/${organization}`, page)
}
