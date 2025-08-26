import { Widely } from './index'

interface OriginalDeviceInfo {
  endpoint_id: number
  domain_user_id: number
  name: string
  status: string
  imei1?: string
  msisdn?: string
  iccid?: string
  network_connection?: string
  package_id?: string
  [key: string]: unknown
}

interface Model {
  success: boolean
  message: string
  data: {
    originalInfo: OriginalDeviceInfo
    terminationSuccess: boolean
    creationSuccess: boolean
    newEndpointId: string | null
    terminationResult: Widely.Model
    creationResult: Widely.Model
  }
}

export { Model, OriginalDeviceInfo }