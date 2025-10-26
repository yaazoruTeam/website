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
      address: (row.address as string) || '',
      status: 'active',
      created_at: new Date(),
      updated_at: new Date(),
    },
    device: {
      device_id: '',
      device_number: (row.device_number as string) || '',
      SIM_number: (row.SIM_number as string) || '',
      IMEI_1: (row.IMEI_1 as string) || '',
      model: (row.model as string) || '',
      status: 'active',
      serialNumber: (row.serialNumber as string) || '',
      purchaseDate: null,
      registrationDate: (row.registrationDate as Date) || new Date(),
      plan: (row.plan as string) || '',
    },
    receivedAt: (row.receivedAt as Date | string | number),
  }
}

export { convertFlatRowToModel }
