/**
 * Customer DB Adapter - TypeORM implementation
 * Replaces knex-based queries with TypeORM repository pattern
 * 
 * This maintains backward compatibility with existing code
 * while using TypeORM under the hood
 */

import { Customer } from '@model'
import { customerRepository } from '../repositories/CustomerRepository'
import { CustomerStatus } from '../entities/Customer'
import logger from '../utils/logger'

//to do: לבדוק איך מבצעים טרנזקציות ב-typeOrm ולמחוק מפה את השדה trx
const createCustomer = async (customer: Customer.Model, _trx?: unknown) => {
  try {
    const customerEntity = {
      first_name: customer.first_name,
      last_name: customer.last_name,
      id_number: customer.id_number,
      phone_number: customer.phone_number,
      additional_phone: customer.additional_phone || null,
      email: customer.email,
      city: customer.city,
      address1: customer.address1,
      address2: customer.address2 || null,
      zip_code: customer.zipCode,
      status: (customer.status as CustomerStatus) || CustomerStatus.ACTIVE,
    }

    return await customerRepository.createCustomer(customerEntity)
  } catch (err) {
    logger.error('[DB] Database error creating customer:', err)
    throw err
  }
}

const getCustomers = async (
  offset: number,
): Promise<{ customers: Customer.Model[]; total: number }> => {
  try {    
    const result = await customerRepository.getCustomers(offset)
    return {
      customers: (result.customers as unknown as Customer.Model[]),
      total: result.total,
    }
  } catch (err) {
    logger.error('[DB] Database error fetching customers:', err)
    throw err
  }
}

const getCustomerById = async (customer_id: string) => {
  try {
    const numericId = parseInt(customer_id, 10)
    return await customerRepository.getCustomerById(numericId)
  } catch (err) {
    logger.error('[DB] Database error fetching customer by ID:', err)
    throw err
  }
}

const getCustomersByCity = async (
  city: string,
  offset: number,
): Promise<{ customers: Customer.Model[]; total: number }> => {
  try {    
    const result = await customerRepository.getCustomersByCity(city, offset)
    return {
      customers: (result.customers as unknown as Customer.Model[]),
      total: result.total,
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
  try {
    const { customers, total } = await customerRepository.getCustomersByStatus(
      status as CustomerStatus,
      offset,
    )
    return {
      customers: (customers as unknown as Customer.Model[]),
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
  try {
    const { customers, total } = await customerRepository.getCustomersByDateRange(
      new Date(startDate),
      new Date(endDate),
      offset,
    )
    return {
      customers: (customers as unknown as Customer.Model[]),
      total,
    }
  } catch (err) {
    logger.error('[DB] Database error fetching customers by date range:', err)
    throw err
  }
}

const updateCustomer = async (customer_id: string, customer: Customer.Model) => {
  try {
    const numericId = parseInt(customer_id, 10)

    const updateData = {
      first_name: customer.first_name,
      last_name: customer.last_name,
      phone_number: customer.phone_number,
      additional_phone: customer.additional_phone || null,
      email: customer.email,
      city: customer.city,
      address1: customer.address1,
      address2: customer.address2 || null,
      zip_code: customer.zipCode,
      status: (customer.status as CustomerStatus) || CustomerStatus.ACTIVE,
    }

    return await customerRepository.updateCustomer(numericId, updateData)
  } catch (err) {
    logger.error('[DB] Database error updating customer:', err)
    throw err
  }
}

const deleteCustomer = async (customer_id: string) => {
  try {
    const numericId = parseInt(customer_id, 10)
    return await customerRepository.deleteCustomer(numericId)
  } catch (err) {
    logger.error('[DB] Database error deleting customer:', err)
    throw err
  }
}

//to do: לבדוק איך מבצעים טרנזקציות ב-typeOrm ולמחוק מפה את השדה trx
const findCustomer = async (
  criteria: {
    customer_id?: string
    email?: string
    id_number?: string
  },
  _trx?: unknown,
) => {
  try {
    const numericCriteria: Record<string, string | number> = {}

    if (criteria.customer_id) {
      numericCriteria.customer_id = parseInt(criteria.customer_id, 10)
    }
    if (criteria.email) {
      numericCriteria.email = criteria.email
    }
    if (criteria.id_number) {
      numericCriteria.id_number = criteria.id_number
    }

    return await customerRepository.findExistingCustomer(numericCriteria as any)
  } catch (err) {
    logger.error('[DB] Database error searching for customer:', err)
    throw err
  }
}

const doesCustomerExist = async (customer_id: string): Promise<boolean> => {
  try {
    const numericId = parseInt(customer_id, 10)
    return await customerRepository.doesCustomerExist(numericId)
  } catch (err) {
    logger.error('[DB] Database error checking customer existence:', err)
    throw err
  }
}

const getUniqueCities = async (): Promise<string[]> => {
  try {
    return await customerRepository.getUniqueCities()
  } catch (error) {
    logger.error('[DB] Database error fetching unique cities:', error)
    throw error
  }
}

const searchCustomersByName = async (
  searchTerm: string,
  offset: number,
): Promise<{ customers: Customer.Model[]; total: number }> => {
  try {
    const result = await customerRepository.searchCustomersByName(searchTerm, offset)
    return {
      customers: (result.customers as unknown as Customer.Model[]),
      total: result.total,
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
