import { Knex } from 'knex'
import { CustomerDevice } from '@model'
import getDbConnection from '@db/connection'
import config from '@config/index'
const limit = config.database.limit

const createCustomerDevice = async (customerDevice: CustomerDevice.Model, trx?: Knex.Transaction) => {
  const knex = getDbConnection()
  try {
    const query = trx ? trx('yaazoru.customer_device') : knex('yaazoru.customer_device')
    const [newCustomerDevice] = await query
      .insert({
        customer_id: customerDevice.customer_id,
        device_id: customerDevice.device_id,
        received_at: customerDevice.receivedAt,
        plan_end_date: customerDevice.planEndDate,
      })
      .returning('*')
    return newCustomerDevice
  } catch (err) {
    throw err
  }
}

const getCustomersDevices = async (
  offset: number,
): Promise<{ customerDevices: CustomerDevice.Model[]; total: number }> => {
  const knex = getDbConnection()
  try {
    const customerDevices = await knex('yaazoru.customer_device')
      .select('*')
      .orderBy('customer_device_id')
      .limit(limit)
      .offset(offset)

    const [{ count }] = await knex('yaazoru.customer_device').count('*')

    return {
      customerDevices,
      total: parseInt(count as string, 10),
    }
  } catch (err) {
    throw err
  }
}

const getCustomerDeviceById = async (customer_device_id: string) => {
  const knex = getDbConnection()
  try {
    return await knex('yaazoru.customer_device').where({ customer_device_id }).first()
  } catch (err) {
    throw err
  }
}

const getCustomerDeviceByCustomerId = async (
  customer_id: string,
  offset: number,
): Promise<{ customerDevices: CustomerDevice.Model[]; total: number }> => {
  const knex = getDbConnection()
  try {
    const customerDevices = await knex('yaazoru.customer_device')
      .select('*')
      .where({ customer_id })
      .orderBy('customer_device_id')
      .limit(limit)
      .offset(offset)

    const [{ count }] = await knex('yaazoru.customer_device').where({ customer_id }).count('*')

    return {
      customerDevices,
      total: parseInt(count as string, 10),
    }
  } catch (err) {
    throw err
  }
}

const getCustomerDeviceByDeviceId = async (
  device_id: string,
  offset: number,
): Promise<{ customerDevices: CustomerDevice.Model[]; total: number }> => {
  const knex = getDbConnection()
  try {
    const customerDevices = await knex('yaazoru.customer_device')
      .select('*')
      .where({ device_id })
      .orderBy('customer_device_id')
      .limit(limit)
      .offset(offset)

    const [{ count }] = await knex('yaazoru.customer_device').where({ device_id }).count('*')

    return {
      customerDevices,
      total: parseInt(count as string, 10),
    }
  } catch (err) {
    throw err
  }
}

const updateCustomerDevice = async (
  customer_device_id: string,
  customerDevice: CustomerDevice.Model,
) => {
  const knex = getDbConnection()
  try {
    const updateCustomerDevice = await knex('yaazoru.customer_device')
      .where({ customer_device_id })
      .update(customerDevice)
      .returning('*')
    if (updateCustomerDevice.length === 0) {
      throw { status: 404, message: 'CustomerDevice not found' }
    }
    return updateCustomerDevice[0]
  } catch (err) {
    throw err
  }
}

const deleteCustomerDevice = async (customer_device_id: string) => {
  const knex = getDbConnection()
  try {
    const deleteCustomerDevice = await knex('yaazoru.customer_device')
      .where({ customer_device_id })
      .del()
      .returning('*')
    if (deleteCustomerDevice.length === 0) {
      throw { status: 404, message: 'CustomerDevice not found' }
    }
    return deleteCustomerDevice[0]
  } catch (err) {
    throw err
  }
}

const findCustomerDevice = async (criteria: { customer_device_id?: string; device_id?: string }) => {
  const knex = getDbConnection()
  try {
    return await knex('yaazoru.customer_device')
      .where(function () {
        if (criteria.device_id) {
          this.orWhere({ device_id: criteria.device_id })
        }
      })
      .andWhere(function () {
        if (criteria.customer_device_id) {
          this.whereNot({ customer_device_id: criteria.customer_device_id })
        }
      })
      .first()
  } catch (err) {
    throw err
  }
}

const doesCustomerDeviceExist = async (customer_device_id: string): Promise<boolean> => {
  const knex = getDbConnection()
  try {
    const result = await knex('yaazoru.customer_device')
      .select('customer_device_id')
      .where({ customer_device_id })
      .first()
    return !!result
  } catch (err) {
    throw err
  }
}

export {
  createCustomerDevice,
  getCustomersDevices,
  getCustomerDeviceById,
  getCustomerDeviceByCustomerId,
  getCustomerDeviceByDeviceId,
  updateCustomerDevice,
  deleteCustomerDevice,
  findCustomerDevice,
  doesCustomerDeviceExist,
}
