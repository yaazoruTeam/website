import { Device } from '@model'
import { 
  apiGet,
  apiPost,
  apiPut,
  safeGetPaginated,
  PaginatedResponse 
} from './core/apiHelpers'

const ENDPOINT = '/device'

export const getDevices = async (page: number): Promise<PaginatedResponse<Device.Model>> => {
  return apiGet<PaginatedResponse<Device.Model>>(`${ENDPOINT}/page/${page}`)
}

export const getDeviceById = async (device_id: string): Promise<Device.Model> => {
  return apiGet<Device.Model>(`${ENDPOINT}/${device_id}`)
}

export const createDevice = async (deviceData: Omit<Device.Model, 'device_id'>): Promise<Device.Model> => {
  return apiPost<Device.Model>(ENDPOINT, deviceData)
}

export const updateDevice = async (device_id: string, deviceData: Partial<Device.Model>): Promise<Device.Model> => {
  return apiPut<Device.Model>(`${ENDPOINT}/${device_id}`, deviceData)
}
