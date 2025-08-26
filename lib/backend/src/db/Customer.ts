import { Knex } from 'knex'
import { Customer, HttpError } from '@model'
import getDbConnection from '@db/connection'
import config from '@config/index'

const limit = config.database.limit

const createCustomer = async (customer: Customer.Model, trx?: Knex.Transaction) => {
  const knex = getDbConnection()
  try {
    const query = trx ? trx('yaazoru.customers') : knex('yaazoru.customers')
    const [newCustomer] = await query
      .insert({
        first_name: customer.first_name,
        last_name: customer.last_name,
        id_number: customer.id_number,
        phone_number: customer.phone_number,
        additional_phone: customer.additional_phone,
        email: customer.email,
        city: customer.city,
        address1: customer.address1,
        address2: customer.address2,
        zipCode: customer.zipCode,
        created_at: customer.created_at,
        updated_at: customer.updated_at,
      })
      .returning('*')
    return newCustomer
  } catch (err) {
    throw err
  }
}

const getCustomers = async (
  offset: number,
): Promise<{ customers: Customer.Model[]; total: number }> => {
  const knex = getDbConnection()
  try {
    const customers = await knex('yaazoru.customers')
      .select('*')
      .limit(limit)
      .offset(offset)
      .orderBy('customer_id')

    const [{ count }] = await knex('yaazoru.customers').count('*')

    return {
      customers,
      total: parseInt(count as string, 10),
    }
  } catch (err) {
    console.log('Error in getCustomers: in db:', err)
    throw err
  }
}

const getCustomerById = async (customer_id: string) => {
  const knex = getDbConnection()
  try {
    return await knex('yaazoru.customers').where({ customer_id }).first()
  } catch (err) {
    throw err
  }
}

const getCustomersByCity = async (
  city: string,
  offset: number,
): Promise<{ customers: Customer.Model[]; total: number }> => {
  const knex = getDbConnection()
  try {
    const customers = await knex('yaazoru.customers')
      .select('*')
      .where({ city })
      .orderBy('customer_id')
      .limit(limit)
      .offset(offset)
    const [{ count }] = await knex('yaazoru.customers').count('*').where({ city })

    return {
      customers,
      total: parseInt(count as string, 10),
    }
  } catch (err) {
    throw err
  }
}

const getCustomersByStatus = async (
  status: 'active' | 'inactive',
  offset: number,
): Promise<{ customers: Customer.Model[]; total: number }> => {
  const knex = getDbConnection()
  try {
    const customers = await knex('yaazoru.customers')
      .select('*')
      .where({ status })
      .orderBy('customer_id')
      .limit(limit)
      .offset(offset)
    const [{ count }] = await knex('yaazoru.customers').count('*').where({ status })
    return {
      customers,
      total: parseInt(count as string, 10),
    }
  } catch (err) {
    throw err
  }
}

const getCustomersByDateRange = async (
  startDate: string,
  endDate: string,
  offset: number,
): Promise<{ customers: Customer.Model[]; total: number }> => {
  const knex = getDbConnection()
  try {
    const customers = await knex('yaazoru.customers')
      .select('*')
      .whereBetween('created_at', [startDate, endDate])
      .orderBy('customer_id')
      .limit(limit)
      .offset(offset)
    const [{ count }] = await knex('yaazoru.customers')
      .count('*')
      .whereBetween('created_at', [startDate, endDate])
    return {
      customers,
      total: parseInt(count as string, 10),
    }
  } catch (err) {
    throw err
  }
}

const updateCustomer = async (customer_id: string, customer: Customer.Model) => {
  const knex = getDbConnection()
  try {
    customer.updated_at = new Date(Date.now())
    const updateCustomer = await knex('yaazoru.customers')
      .where({ customer_id })
      .update(customer)
      .returning('*')
    if (updateCustomer.length === 0) {
      throw { status: 404, message: 'Customer not found' }
    }
    return updateCustomer[0]
  } catch (err) {
    throw err
  }
}

const deleteCustomer = async (customer_id: string) => {
  const knex = getDbConnection()
  try {
    const updateCustomer = await knex('yaazoru.customers')
      .where({ customer_id })
      .update({ status: 'inactive' })
      .returning('*')
    if (updateCustomer.length === 0) {
      const error: HttpError.Model = {
        status: 404,
        message: 'customer not found',
      }
      throw error
    }
    return updateCustomer[0]
  } catch (err) {
    throw err
  }
}

const findCustomer = async (criteria: {
  customer_id?: string
  email?: string
  id_number?: string
}) => {
  const knex = getDbConnection()
  try {
    return await knex('yaazoru.customers')
      .where(function () {
        if (criteria.email && criteria.id_number) {
          this.where({ email: criteria.email }).orWhere({ id_number: criteria.id_number })
        } else if (criteria.email) {
          this.where({ email: criteria.email })
        } else if (criteria.id_number) {
          this.where({ id_number: criteria.id_number })
        }
      })
      .modify((query) => {
        if (criteria.customer_id) {
          query.whereNot({ customer_id: criteria.customer_id })
        }
      })
      .first()
  } catch (err) {
    throw err
  }
}

const doesCustomerExist = async (customer_id: string): Promise<boolean> => {
  const knex = getDbConnection()
  try {
    const result = await knex('yaazoru.customers')
      .select('customer_id')
      .where({ customer_id })
      .first()
    return !!result
  } catch (err) {
    throw err
  }
}

const getUniqueCities = async (): Promise<string[]> => {
  const knex = getDbConnection()
  try {
    const rows = await knex('yaazoru.customers')
      .distinct('city')
      .whereNotNull('city')
      .andWhere('city', '!=', '')
      .orderBy('city')

    return rows.map((row) => row.city)
  } catch (error) {
    throw error
  }
}

const searchCustomersByName = async (
  searchTerm: string,
  offset: number,
): Promise<{ customers: Customer.Model[]; total: number }> => {
  const knex = getDbConnection()
  try {
    const trimmed = searchTerm.trim()
    if (!trimmed) {
      return { customers: [], total: 0 }
    }

    const terms = trimmed.split(/\s+/)

    const buildWhereClause = (query: Knex.QueryBuilder) => {
      terms.forEach((term) => {
        query.andWhere((qb: Knex.QueryBuilder) => {
          qb.whereILike('first_name', `%${term}%`).orWhereILike('last_name', `%${term}%`)
        })
      })
    }

    const customers = await knex('yaazoru.customers')
      .select('*')
      .where(function () {
        buildWhereClause(this)
      })
      .orderBy('customer_id')
      .limit(limit)
      .offset(offset)

    const [{ count: totalCount }] = await knex('yaazoru.customers')
      .count('*')
      .where(function () {
        buildWhereClause(this)
      })

    return {
      customers,
      total: parseInt(totalCount as string, 10),
    }
  } catch (err) {
    throw err
  }
}

export {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
  findCustomer,
  doesCustomerExist,
  getCustomersByCity,
  searchCustomersByName,
  getUniqueCities,
  getCustomersByStatus,
  getCustomersByDateRange,
}
