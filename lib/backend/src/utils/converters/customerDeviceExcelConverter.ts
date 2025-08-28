import { CustomerDeviceExcel } from '@model'

const convertFlatRowToModel = (row: Record<string, unknown>): CustomerDeviceExcel.Model => {
  return {
    customer: {
      customer_id: '',
      first_name: (row.first_name as string) || '',
      last_name: (row.last_name as string) || '',
      id_number: (row.id_number as string) || '',
      phone_number: (row.phone_number as string) || '',
      additional_phone: '',
      email: (row.email as string) || '',
      city: (row.city as string) || '',
      address1: (row.address1 as string) || '',
      address2: '',
      zipCode: '',
      status: 'active',
      created_at: new Date(),
      updated_at: new Date(),
    },
    device: {
      device_id: '',
      device_number: (row.device_number as string) || '',
      SIM_number: (row.SIM_number as string) || '',
      IMEI_1: (row.IMEI_1 as string) || '',
      mehalcha_number: (row.mehalcha_number as string) || '',
      model: (row.model as string) || '',
      status: 'active',
      isDonator: true,
    },
    receivedAt: row.receivedAt as Date | string | number,
  }
}

export { convertFlatRowToModel }
