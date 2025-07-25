interface DeviceInfo {
  brand: string
  model: string
  name: string
}

interface Model {
  simNumber: string
  endpoint_id: number
  network_connection: string
  data_usage_gb: number
  max_data_gb: number
  imei1: string
  status: string
  imei_lock: string
  msisdn: string
  iccid: string
  device_info: DeviceInfo
  package_id: string
}

export type { Model, DeviceInfo }
