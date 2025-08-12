import { ItemForMonthlyPayment } from '@model'
import { 
  safeGetPaginated,
  PaginatedResponse 
} from './core/apiHelpers'

const ENDPOINT = '/item'

export const getItems = async (page: number = 1): Promise<PaginatedResponse<ItemForMonthlyPayment.Model>> => {
  return safeGetPaginated<ItemForMonthlyPayment.Model>(ENDPOINT, page)
}

export const getItemsByMonthlyPaymentId = async (
  monthlyPayment_id: string, 
  page: number = 1,
): Promise<PaginatedResponse<ItemForMonthlyPayment.Model>> => {
  return safeGetPaginated<ItemForMonthlyPayment.Model>(
    `${ENDPOINT}/monthlyPayment/${monthlyPayment_id}`, 
    page
  )
}
