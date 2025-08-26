interface SubscriptionData {
  usage: number
}

interface Subscription {
  data: SubscriptionData[]
}

interface RegistrationInfo {
  mcc_mnc: string
  imei: string
  status: string
  msisdn: string
}

interface SimData {
  locked_imei: string
  lock_on_first_imei: boolean
  msisdn: string
  iccid: string
}

interface DeviceInfo {
  brand: string
  model: string
  name: string
}

interface Model {
  domain_user_id?: number
  subscriptions?: Subscription[]
  data_used?: number
  data_limit?: number
  registration_info?: RegistrationInfo
  sim_data?: SimData
  device_info?: DeviceInfo
  package_id?: number
  active?: boolean
  iccid?: string
}

export { Model, RegistrationInfo, SimData, DeviceInfo, Subscription, SubscriptionData }