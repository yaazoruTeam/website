import { apiGet } from "./core/apiHelpers"
const ENDPOINT = '/switchboard'
import { CallRecord } from "@model"

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
