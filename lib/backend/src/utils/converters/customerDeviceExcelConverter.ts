import { CustomerDeviceExcel } from '@model'

const convertFlatRowToModel = (row: any): CustomerDeviceExcel.Model => {
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
      model: row.model || '',
      status: 'active',
      serialNumber: row.serialNumber || '',
      purchaseDate: row.receivedAt || null,
      releaseDate: row.releaseDate || new Date(),
      plan: /*row.plan ||*/ '',
    },
    receivedAt: row.receivedAt,
  }
}

export { convertFlatRowToModel }
