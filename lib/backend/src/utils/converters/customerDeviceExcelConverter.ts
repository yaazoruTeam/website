import { CustomerDeviceExcel } from '@model'

// Interface for Excel row data when importing customer devices
interface ExcelRowData {
  first_name?: string
  last_name?: string
  id_number?: string
  phone_number?: string
  email?: string
  city?: string
  address1?: string
  device_number?: string
  SIM_number?: string
  IMEI_1?: string
  mehalcha_number?: string
  model?: string
  receivedAt?: string | number | Date
  [key: string]: unknown // Allow additional properties
}

const convertFlatRowToModel = (row: ExcelRowData): CustomerDeviceExcel.Model => {
  return {
    customer: {
      customer_id: '',
      first_name: row.first_name || '',
      last_name: row.last_name || '',
      id_number: row.id_number || '',
      phone_number: row.phone_number || '',
      additional_phone: '',
      email: row.email || '',
      city: row.city || '',
      address1: row.address1 || '',
      address2: '',
      zipCode: '',
      status: 'active',
      created_at: new Date(),
      updated_at: new Date(),
    },
    device: {
      device_id: '',
      device_number: row.device_number || '',
      SIM_number: row.SIM_number || '',
      IMEI_1: row.IMEI_1 || '',
      mehalcha_number: row.mehalcha_number || '',
      model: row.model || '',
      status: 'active',
      isDonator: true,
    },
    receivedAt: row.receivedAt,
  }
}

export { convertFlatRowToModel, ExcelRowData }
