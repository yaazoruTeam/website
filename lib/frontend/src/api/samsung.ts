import { Samsung } from "@model"
import { apiGet, apiPost } from "./core/apiHelpers"
const ENDPOINT = '/samsung'

export const getDeviceInfo = async (serialNumber: string): Promise<Samsung.DeviceInfo> => {
  return await apiGet<Samsung.DeviceInfo>(
    `${ENDPOINT}/devices/${serialNumber}/info`
  )
}

export const syncDevice = async (serialNumber: string, forceSync: boolean = false): Promise<Samsung.SyncDeviceResponse> => {
  return await apiPost<Samsung.SyncDeviceResponse>(
    `${ENDPOINT}/devices/${serialNumber}/sync`,
    { forceSync }
  )
}

export const moveDeviceToGroup = async (serialNumber: string, groupId: number): Promise<Samsung.MoveGroupResponse> => {
  return await apiPost<Samsung.MoveGroupResponse>(
    `${ENDPOINT}/devices/${serialNumber}/moveToGroup`,
    { groupId }
  )
}

export const getGroups = async (excludeGroupId?: number): Promise<Samsung.GroupsList> => {
  const url = excludeGroupId 
    ? `${ENDPOINT}/groups?exclude=${excludeGroupId}`
    : `${ENDPOINT}/groups`
  return await apiGet<Samsung.GroupsList>(url)
}