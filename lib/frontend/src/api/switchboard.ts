import { apiGet } from "./core/apiHelpers"
const ENDPOINT = '/samsung'

export const getCallHistory = async (): Promise<unknown> => {
  return await apiGet<unknown>(
    `${ENDPOINT}/switchboard/call-log`
  )
}
