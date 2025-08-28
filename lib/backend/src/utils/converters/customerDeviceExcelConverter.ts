import { CustomerDeviceExcel } from '@model'

const convertFlatRowToModel = (row: Record<string, unknown>): CustomerDeviceExcel.Model => {
  const getString = (value: unknown): string => {
    if (typeof value === 'string') return value
    if (value == null) return ''
    return String(value)
  }

  const getDateValue = (value: unknown): Date | string | number => {
    if (value instanceof Date) return value
    if (typeof value === 'string' || typeof value === 'number') return value
    return new Date()
  }

  return {
    customer: {
      customer_id: '',
      first_name: getString(row.first_name),
      last_name: getString(row.last_name),
      id_number: getString(row.id_number),
      phone_number: getString(row.phone_number),
      additional_phone: '',
      email: getString(row.email),
      city: getString(row.city),
      address1: getString(row.address1),
      address2: '',
      zipCode: '',
      status: 'active',
      created_at: new Date(),
      updated_at: new Date(),
    },
    device: {
      device_id: '',
      device_number: getString(row.device_number),
      SIM_number: getString(row.SIM_number),
      IMEI_1: getString(row.IMEI_1),
      mehalcha_number: getString(row.mehalcha_number),
      model: getString(row.model),
      status: 'active',
      isDonator: true,
    },
    receivedAt: getDateValue(row.receivedAt),
  }
}

export { convertFlatRowToModel }
