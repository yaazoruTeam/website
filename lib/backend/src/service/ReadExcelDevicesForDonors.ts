import getDbConnection from '../db/connection'
import * as db from '../db'
import { CustomerDeviceExcel } from '@model'
import * as XLSX from 'xlsx' // ✨ שינוי: נדרש בשביל כתיבה
import * as path from 'path' // ✨ שינוי: נדרש בשביל כתיבה
import { convertFlatRowToModel } from '../utils/converters/customerDeviceExcelConverter'
import { writeErrorsToExcel } from '../utils/excel'

const processExcelData = async (data: any[]): Promise<void> => {
  const knex = getDbConnection()
  const errors: any[] = []

  for (const item of data) {
    const isCustomer: boolean =
      !!(typeof item.first_name === 'string' && item.first_name.trim()) ||
      (typeof item.last_name === 'string' && item.last_name.trim())

    let sanitized: CustomerDeviceExcel.Model | null = null

    try {
      sanitized = await CustomerDeviceExcel.sanitize(convertFlatRowToModel(item), isCustomer)
    } catch (err: any) {
      errors.push({
        ...item,
        error: `Sanitize failed: ${err.message || err.toString()}`,
      })
      continue
    }

    if (isCustomer) {
      const trx = await knex.transaction()
      try {
        const existCustomer = await processCustomer(sanitized, trx)
        const existDevice = await processDevice(sanitized, trx)

        let existingRelation = await db.CustomerDevice.findCustomerDevice({
          device_id: existDevice.device_id,
        })

        if (!existingRelation) {
          const date: Date = new Date(sanitized.receivedAt)
          const planEndDate = new Date(date)
          planEndDate.setFullYear(planEndDate.getFullYear() + 5)
          await db.CustomerDevice.createCustomerDevice(
            {
              customerDevice_id: '',
              customer_id: existCustomer.customer_id,
              device_id: existDevice.device_id,
              receivedAt: date,
              planEndDate: planEndDate,
              filterVersion: '1.7',
              deviceProgram: '0',
            },
            trx,
          )
        }
        await trx.commit()
      } catch (err: any) {
        console.error('Transaction failed:', err)
        errors.push({
          ...item,
          error: `Transaction failed: ${err.message || err.toString()}`,
        })
        await trx.rollback()
      }
    } else {
      try {
        await processDevice(sanitized, null)
      } catch (err: any) {
        console.error('Error creating device (no customer):', err)
        errors.push({
          ...item,
          error: `Device-only insert failed: ${err.message || err.toString()}`,
        })
      }
    }
  }
  await writeErrorsToExcel(errors)
}

const processCustomer = async (sanitized: CustomerDeviceExcel.Model, trx: any) => {
  if (!sanitized.customer) {
    throw new Error('Customer is undefined in sanitized object.')
  }

  let existCustomer = await db.Customer.findCustomer({
    email: sanitized.customer.email,
    id_number: sanitized.customer.id_number,
  })

  if (!existCustomer) {
    console.log('Creating customer...')
    existCustomer = await db.Customer.createCustomer(sanitized.customer, trx)
    console.log('Customer created.')
  }

  return existCustomer
}

const processDevice = async (sanitized: CustomerDeviceExcel.Model, trx: any) => {
  let existDevice = await db.Device.findDevice({
    SIM_number: sanitized.device.SIM_number,
    IMEI_1: sanitized.device.IMEI_1,
    mehalcha_number: sanitized.device.mehalcha_number,
    device_number: sanitized.device.device_number,
  })

  if (!existDevice) {
    console.log('Creating device...')
    existDevice = await db.Device.createDevice(sanitized.device, trx)
    console.log('Device created.')
  }

  return existDevice
}

export { processExcelData }
