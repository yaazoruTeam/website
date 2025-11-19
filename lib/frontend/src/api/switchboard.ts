import { apiGet, apiPost } from "./core/apiHelpers"
const ENDPOINT = '/switchboard'
import { CallRecord, Switchboard } from "@model"

interface CallHistoryResponse {
  success: boolean
  data: CallRecord.Model[]
  count: number
}

export const getCallHistory = async (): Promise<CallRecord.Model[]> => {
  const response = await apiGet<CallHistoryResponse>(
    `${ENDPOINT}/call-log`
  )
  return response.data || []
}

export const createCustomer = async (customerData: Switchboard.CustomerData): Promise<Switchboard.CreateCustomerResponse> => {
  const response = await apiPost<Switchboard.CreateCustomerResponse>(
    `${ENDPOINT}/customer`,
    customerData
  )
  return response
}
