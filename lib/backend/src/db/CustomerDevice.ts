import { CustomerDevice } from '@model'
import getDbConnection from '@db/connection'
import config from '@config/index'
const limit = config.database.limit

const createCustomerDevice = async (customerDevice: CustomerDevice.Model, trx?: any) => {
  const knex = getDbConnection()
  try {
    const query = trx ? trx('yaazoru.customerDevice') : knex('yaazoru.customerDevice')
    const [newCustomerDevice] = await query
      .insert({
        customer_id: customerDevice.customer_id,
        device_id: customerDevice.device_id,
        receivedAt: customerDevice.receivedAt,
        planEndDate: customerDevice.planEndDate,
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
    const customerDevices = await knex('yaazoru.customerDevice')
      .select('*')
      .orderBy('customerDevice_id')
      .limit(limit)
      .offset(offset)

    const [{ count }] = await knex('yaazoru.customerDevice').count('*')

    return {
      customerDevices,
      total: parseInt(count as string, 10),
    }
  } catch (err) {
    throw err
  }
}

const getCustomerDeviceById = async (customerDevice_id: string) => {
  const knex = getDbConnection()
  try {
    return await knex('yaazoru.customerDevice').where({ customerDevice_id }).first()
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
    const customerDevices = await knex('yaazoru.customerDevice')
      .select('*')
      .where({ customer_id })
      .orderBy('customerDevice_id')
      .limit(limit)
      .offset(offset)

    const [{ count }] = await knex('yaazoru.customerDevice').where({ customer_id }).count('*')

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
    const customerDevices = await knex('yaazoru.customerDevice')
      .select('*')
      .where({ device_id })
      .orderBy('customerDevice_id')
      .limit(limit)
      .offset(offset)

    const [{ count }] = await knex('yaazoru.customerDevice').where({ device_id }).count('*')

    return {
      customerDevices,
      total: parseInt(count as string, 10),
    }
  } catch (err) {
    throw err
  }
}

const updateCustomerDevice = async (
  customerDevice_id: string,
  customerDevice: CustomerDevice.Model,
) => {
  const knex = getDbConnection()
  try {
    const updateCustomerDevice = await knex('yaazoru.customerDevice')
      .where({ customerDevice_id })
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

const deleteCustomerDevice = async (customerDevice_id: string) => {
  const knex = getDbConnection()
  try {
    const deleteCustomerDevice = await knex('yaazoru.customerDevice')
      .where({ customerDevice_id })
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

const findCustomerDevice = async (criteria: { customerDevice_id?: string; device_id?: string }) => {
  const knex = getDbConnection()
  try {
    return await knex('yaazoru.customerDevice')
      .where(function () {
        if (criteria.device_id) {
          this.orWhere({ device_id: criteria.device_id })
        }
      })
      .andWhere(function () {
        if (criteria.customerDevice_id) {
          this.whereNot({ customerDevice_id: criteria.customerDevice_id })
        }
      })
      .first()
  } catch (err) {
    throw err
  }
}

const doesCustomerDeviceExist = async (customerDevice_id: string): Promise<boolean> => {
  const knex = getDbConnection()
  try {
    const result = await knex('yaazoru.customerDevice')
      .select('customerDevice_id')
      .where({ customerDevice_id })
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
