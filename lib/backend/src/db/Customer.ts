import { Customer, HttpError } from '@model'
import getDbConnection from '@db/connection'
import config from '@config/index'
import logger from '../utils/logger'

const limit = config.database.limit

const createCustomer = async (customer: Customer.Model, trx?: any) => {
  const knex = getDbConnection()
  try {
    logger.debug('[DB] Creating customer in database', { email: customer.email })
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
    logger.debug('[DB] Customer created successfully', { customer_id: newCustomer.customer_id })
    return newCustomer
  } catch (err) {
    logger.error('[DB] Database error creating customer:', err)
    throw err
  }
}

const getCustomers = async (
  offset: number,
): Promise<{ customers: Customer.Model[]; total: number }> => {
  const knex = getDbConnection()
  try {
    logger.debug('[DB] Fetching customers from database', { offset, limit })
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
    logger.error('[DB] Database error fetching customers:', err)
    throw err
  }
}

const getCustomerById = async (customer_id: string) => {
  const knex = getDbConnection()
  try {
    const customer = await knex('yaazoru.customers').where({ customer_id }).first()
    if (!customer) {
      logger.debug('[DB] Customer not found in database', { customer_id })
    }
    return customer
  } catch (err) {
    logger.error('[DB] Database error fetching customer by ID:', err)
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

    const total = parseInt(count as string, 10)
    logger.debug('[DB] Retrieved customers by city', { city, found: customers.length, total })

    return {
      customers,
      total,
    }
  } catch (err) {
    logger.error('[DB] Database error fetching customers by city:', err)
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

    const total = parseInt(count as string, 10)
    logger.debug('[DB] Retrieved customers by status', { status, found: customers.length, total })

    return {
      customers,
      total,
    }
  } catch (err) {
    logger.error('[DB] Database error fetching customers by status:', err)
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

    const total = parseInt(count as string, 10)
    logger.debug('[DB] Retrieved customers by date range', { startDate, endDate, found: customers.length, total })

    return {
      customers,
      total,
    }
  } catch (err) {
    logger.error('[DB] Database error fetching customers by date range:', err)
    throw err
  }
}

const updateCustomer = async (customer_id: string, customer: Customer.Model) => {
  const knex = getDbConnection()
  try {
    logger.debug('[DB] Updating customer in database', { customer_id })
    customer.updated_at = new Date(Date.now())
    const updateCustomer = await knex('yaazoru.customers')
      .where({ customer_id })
      .update(customer)
      .returning('*')
    if (updateCustomer.length === 0) {
      logger.warn('[DB] Customer not found for update', { customer_id })
      throw { status: 404, message: 'Customer not found' }
    }
    logger.debug('[DB] Customer updated successfully', { customer_id })
    return updateCustomer[0]
  } catch (err) {
    logger.error('[DB] Database error updating customer:', err)
    throw err
  }
}

const deleteCustomer = async (customer_id: string) => {
  const knex = getDbConnection()
  try {
    logger.debug('[DB] Soft deleting customer (marking inactive)', { customer_id })
    const updateCustomer = await knex('yaazoru.customers')
      .where({ customer_id })
      .update({ status: 'inactive' })
      .returning('*')
    if (updateCustomer.length === 0) {
      logger.warn('[DB] Customer not found for deletion', { customer_id })
      const error: HttpError.Model = {
        status: 404,
        message: 'customer not found',
      }
      throw error
    }
    logger.debug('[DB] Customer soft deleted successfully', { customer_id })
    return updateCustomer[0]
  } catch (err) {
    logger.error('[DB] Database error deleting customer:', err)
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
    logger.debug('[DB] Searching for existing customer', { criteria })
    const customer = await knex('yaazoru.customers')
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

    if (customer) {
      logger.debug('[DB] Found existing customer with matching criteria', { found_id: customer.customer_id })
    }
    return customer
  } catch (err) {
    logger.error('[DB] Database error searching for customer:', err)
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
    logger.error('[DB] Database error checking customer existence:', err)
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

    logger.debug('[DB] Retrieved unique cities', { count: rows.length })
    return rows.map((row) => row.city)
  } catch (error) {
    logger.error('[DB] Database error fetching unique cities:', error)
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
      logger.debug('[DB] Empty search term provided')
      return { customers: [], total: 0 }
    }

    const terms = trimmed.split(/\s+/)
    logger.debug('[DB] Searching customers by name', { searchTerms: terms })

    const buildWhereClause = (query: any) => {
      terms.forEach((term) => {
        query.andWhere((qb: any) => {
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

    const total = parseInt(totalCount as string, 10)
    logger.debug('[DB] Search completed', { searchTerm, found: customers.length, total })

    return {
      customers,
      total,
    }
  } catch (err) {
    logger.error('[DB] Database error searching customers by name:', err)
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
