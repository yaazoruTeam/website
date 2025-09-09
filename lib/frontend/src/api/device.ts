import { Device } from '@model'
import { 
  apiGet,
  apiPost,
  safeGetPaginated,
  PaginatedResponse 
} from './core/apiHelpers'

const ENDPOINT = '/device'

export const getDevices = async (page: number): Promise<PaginatedResponse<Device.Model>> => {
  return safeGetPaginated<Device.Model>(ENDPOINT, page)
}

export const getDeviceById = async (device_id: string): Promise<Device.Model> => {
  return apiGet<Device.Model>(`${ENDPOINT}/${device_id}`)
}

export const createDevice = async (deviceData: Omit<Device.Model, 'device_id'>): Promise<Device.Model> => {
  return apiPost<Device.Model>(ENDPOINT, deviceData)
}
