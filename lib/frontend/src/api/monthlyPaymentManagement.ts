import { MonthlyPaymentManagement } from '@model'
import { 
  apiPostPublic,
  apiPut 
} from './core/apiHelpers'

const ENDPOINT = '/addMonthlyPayment'

export const createMonthlyPayment = async (
  monthlyPayment: MonthlyPaymentManagement.Model,
): Promise<MonthlyPaymentManagement.Model> => {
  console.log('create monthly payment in frontend')
  return apiPostPublic<MonthlyPaymentManagement.Model>(ENDPOINT, monthlyPayment)
}

export const updateMonthlyPayment = async (
  monthlyPayment: MonthlyPaymentManagement.Model,
  monthlyPayment_id: string,
): Promise<{ message: string }> => {
  console.log('update monthly payment in frontend')
  const endpointUrl = `${ENDPOINT}/updateMonthlyPayment/${monthlyPayment_id}`
  return apiPut<{ message: string }>(endpointUrl, monthlyPayment)
}
