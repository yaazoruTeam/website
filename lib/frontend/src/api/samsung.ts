import { DeviceInfo } from "@model/WidelyDeviceDetails"
import { apiGet } from "./core/apiHelpers"
const ENDPOINT = '/samsung'

export const getDeviceInfo = async (serialNumber: string): Promise<DeviceInfo> => {
  return await apiGet<DeviceInfo>(
    `${ENDPOINT}/devices/${serialNumber}/info`
  )
}