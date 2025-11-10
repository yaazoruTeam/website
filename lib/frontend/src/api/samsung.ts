import { Samsung } from "@model"
import { apiGet } from "./core/apiHelpers"
const ENDPOINT = '/samsung'

export const getDeviceInfo = async (serialNumber: string): Promise<Samsung.DeviceInfo> => {
  return await apiGet<Samsung.DeviceInfo>(
    `${ENDPOINT}/devices/${serialNumber}/info`
  )
}