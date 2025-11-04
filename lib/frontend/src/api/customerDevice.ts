import { CustomerDevice } from '@model'
import { 
  apiGet,
  apiPost,
  apiPut,
  safeGetPaginated,
  PaginatedResponse 
} from './core/apiHelpers'

const ENDPOINT = '/customerDevice'

export const getAllCustomerDevicesByCustomerId = async (
  customer_id: string, 
  page: number
): Promise<PaginatedResponse<CustomerDevice.Model>> => {
  return safeGetPaginated<CustomerDevice.Model>(`${ENDPOINT}/allDevices/${customer_id}`, page)
}

export const getCustomerDeviceByDeviceId = async (device_id: string): Promise<CustomerDevice.Model | null> => {
  try {
    const response = await apiGet<PaginatedResponse<CustomerDevice.Model>>(`${ENDPOINT}/device/${device_id}`)
    return response.data.length > 0 ? response.data[0] : null
  } catch (error) {
    console.error('Error fetching customer device by device id', error)
    return null
  }
}

export const createCustomerDevice = async (customerDeviceData: Omit<CustomerDevice.Model, 'customerDevice_id'>): Promise<CustomerDevice.Model> => {
  return apiPost<CustomerDevice.Model>(ENDPOINT, customerDeviceData)
}

export const updateCustomerDevice = async (
  customerDevice_id: string, 
  customerDeviceData: Partial<CustomerDevice.Model>
): Promise<CustomerDevice.Model> => {
  return apiPut<CustomerDevice.Model>(`${ENDPOINT}/${customerDevice_id}`, customerDeviceData)
}
