import { Payments } from '@model'
import { 
  apiGetPublic,
  safeGetPaginated,
  // PaginatedResponse 
} from './core/apiHelpers'

const ENDPOINT = '/payments'

export interface PaginatedPaymentsResponse {
  data: Payments.Model[]
  total: number
  page?: number
  totalPages: number
}

export const getPayments = async (page: number = 1): Promise<PaginatedPaymentsResponse> => {
  return safeGetPaginated<Payments.Model>(ENDPOINT, page)
}

export const getAllPaymentsByMonthlyPaymentId = async (monthlyPayment_id: string): Promise<Payments.Model[]> => {
  return apiGetPublic<Payments.Model[]>(`${ENDPOINT}/monthlyPayment/${monthlyPayment_id}`)
}