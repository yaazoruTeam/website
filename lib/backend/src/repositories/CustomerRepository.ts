import { Repository, ILike, Between, In, MoreThan, Not, IsNull, LessThan } from 'typeorm'
import { AppDataSource } from '../data-source'
import { Customer, CustomerStatus } from '../entities/Customer'
import logger from '../utils/logger'
import config from '../config/index'

const limit = config.database.limit

/**
 * CustomerRepository - Handles all database operations for customers
 * Replaces the old knex-based db/Customer.ts
 */
export class CustomerRepository {
  private repository: Repository<Customer>

  constructor() {
    this.repository = AppDataSource.getRepository(Customer)
  }

  /**
   * Create a new customer
   */
  async createCustomer(customerData: Partial<Customer>): Promise<Customer> {
    try {
      logger.debug('[DB] Creating customer in database', { email: customerData.email })

      const customer = this.repository.create(customerData)
      const savedCustomer = await this.repository.save(customer)

      logger.debug('[DB] Customer created successfully', { customer_id: savedCustomer.customer_id })
      return savedCustomer
    } catch (err) {
      logger.error('[DB] Database error creating customer:', err)
      throw err
    }
  }


  async getCustomers(offset: number): Promise<{ customers: Customer[]; total: number }> {
    try {
      logger.debug('[DB] Fetching customers from database (LEGACY OFFSET)', { offset, limit })

      const [customers, total] = await this.repository.findAndCount({
        skip: offset,
        take: limit,
        order: { customer_id: 'ASC' },
      })

      return { customers, total }
    } catch (err) {
      logger.error('[DB] Database error fetching customers:', err)
      throw err
    }
  }

  /**
   * Get customer by ID
   * Returns null if customer doesn't exist (READ operation)
   */
  async getCustomerById(customer_id: number): Promise<Customer | null> {
    try {
      const customer = await this.repository.findOne({
        where: { customer_id },
      })
      return customer || null
    } catch (err) {
      logger.error('[DB] Database error fetching customer by ID:', err)
      throw err
    }
  }

  /**
   * Update customer
   */
  async updateCustomer(customer_id: number, updateData: Partial<Customer>): Promise<Customer> {
    try {
      logger.debug('[DB] Updating customer in database', { customer_id })

      // Update with new updated_at timestamp
      await this.repository.update(customer_id, {
        ...updateData,
        updated_at: new Date(),
      })

      const updatedCustomer: Customer | null = await this.getCustomerById(customer_id)

      if (!updatedCustomer) {
        logger.warn('[DB] Customer not found for update', { customer_id })
        throw { status: 404, message: 'Customer not found' }
      }

      logger.debug('[DB] Customer updated successfully', { customer_id })
      return updatedCustomer
    } catch (err) {
      logger.error('[DB] Database error updating customer:', err)
      throw err
    }
  }

  /**
   * Soft delete customer (mark as inactive)
   */
  async deleteCustomer(customer_id: number): Promise<Customer> {
    try {
      logger.debug('[DB] Soft deleting customer (marking inactive)', { customer_id })

      const customer: Customer | null = await this.getCustomerById(customer_id)
      if (!customer) {
        logger.warn('[DB] Customer not found for deletion', { customer_id })
        throw { status: 404, message: 'Customer not found' }
      }

      // Soft delete - just mark as inactive
      customer.status = CustomerStatus.INACTIVE
      const deletedCustomer = await this.repository.save(customer)

      logger.debug('[DB] Customer soft deleted successfully', { customer_id })
      return deletedCustomer
    } catch (err) {
      logger.error('[DB] Database error deleting customer:', err)
      throw err
    }
  }

  /**
   * Find existing customer by email, id_number, or phone_number
   * Used to check for duplicates before creating/updating
   * Executes queries in parallel for better performance
   * 
   * Important: This checks ALL UNIQUE fields to prevent constraint violations
   */
  async findExistingCustomer(criteria: {
    customer_id?: number
    email?: string
    id_number?: string
    phone_number?: string
  }): Promise<Customer | null> {
    try {
      logger.debug('[DB] Searching for existing customer', { criteria })

      // Execute email, id_number, and phone_number queries in parallel
      const [customerByEmail, customerByIdNumber, customerByPhoneNumber] = await Promise.all([
        criteria.email
          ? this.repository.findOne({
              where: { email: criteria.email },
            })
          : Promise.resolve(null),
        criteria.id_number
          ? this.repository.findOne({
              where: { id_number: criteria.id_number },
            })
          : Promise.resolve(null),
        criteria.phone_number
          ? this.repository.findOne({
              where: { phone_number: criteria.phone_number },
            })
          : Promise.resolve(null),
      ])

      // Get first match (email, id_number, or phone_number - in priority order)
      const customer = customerByEmail || customerByIdNumber || customerByPhoneNumber

      // Filter out if it's the same customer being updated
      if (customer && criteria.customer_id && customer.customer_id === criteria.customer_id) {
        return null
      }

      if (customer) {
        logger.debug('[DB] Found existing customer with matching criteria', {
          found_id: customer.customer_id,
          matchedBy: customerByEmail ? 'email' : customerByIdNumber ? 'id_number' : 'phone_number',
        })
      }

      return customer
    } catch (err) {
      logger.error('[DB] Database error searching for customer:', err)
      throw err
    }
  }

  /**
   * Get all unique cities with customers
   * Fetches only non-empty cities and returns them sorted alphabetically
   * Uses QueryBuilder for efficient DISTINCT query at database level
   */
  async getUniqueCities(): Promise<string[]> {
    try {
      logger.debug('[DB] Fetching unique cities')

      // Use QueryBuilder to get distinct cities directly from database
      const cities = await this.repository
        .createQueryBuilder('customer')
        .select('DISTINCT customer.city', 'city')
        .where('customer.city IS NOT NULL')
        .andWhere("customer.city != ''")
        .orderBy('customer.city', 'ASC')
        .getRawMany<{ city: string }>()

      // Extract city values from results
      const uniqueCities = cities.map((row) => row.city)

      logger.debug('[DB] Retrieved unique cities', { count: uniqueCities.length })
      return uniqueCities
    } catch (err) {
      logger.error('[DB] Database error fetching unique cities:', err)
      throw err
    }
  }

  /**
   * Search customers by name (first_name or last_name)
   * Supports multiple search terms - all terms must match
   * Uses offset-based pagination
   * Example: "John Doe" searches for customers with "John" AND "Doe"
   */
  async searchCustomersByName(
    searchTerm: string,
    offset: number,
  ): Promise<{ customers: Customer[]; total: number }> {
    try {
      const trimmed = searchTerm.trim()

      if (!trimmed) {
        logger.debug('[DB] Empty search term provided')
        return { customers: [], total: 0 }
      }

      const terms = trimmed.split(/\s+/)
      logger.debug('[DB] Searching customers by name', { searchTerms: terms })

      // Build where array with OR conditions - search in first_name or last_name
      const where = terms.map((term) => [
        { first_name: ILike(`%${term}%`) },
        { last_name: ILike(`%${term}%`) },
      ])

      // Flatten the array and use findAndCount
      const flatWhere = where.flat()

      const [customers, total] = await this.repository.findAndCount({
        where: flatWhere,
        skip: offset,
        take: limit,
        order: { customer_id: 'ASC' },
      })

      logger.debug('[DB] Search completed', {
        searchTerm: trimmed,
        found: customers.length,
        total,
      })

      return { customers, total }
    } catch (err) {
      logger.error('[DB] Database error searching customers by name:', err)
      throw err
    }
  }

  /**
   * Get all customers (without pagination) - use with caution!
   */
  async getAllCustomers(): Promise<Customer[]> {
    try {
      logger.debug('[DB] Fetching all customers')
      return await this.repository.find()
    } catch (err) {
      logger.error('[DB] Database error fetching all customers:', err)
      throw err
    }
  }

  /**
   * Bulk update customers status
   */
  async updateCustomersStatus(
    customer_ids: number[],
    status: CustomerStatus,
  ): Promise<number> {
    try {
      logger.debug('[DB] Bulk updating customers status', { count: customer_ids.length, status })

      const result = await this.repository.update(
        { customer_id: In(customer_ids) },
        { status },
      )

      logger.debug('[DB] Bulk update completed', { affected: result.affected })
      return result.affected || 0
    } catch (err) {
      logger.error('[DB] Database error bulk updating customers:', err)
      throw err
    }
  }

  /**
   * Count total customers
   */
  async countCustomers(): Promise<number> {
    try {
      return await this.repository.count()
    } catch (err) {
      logger.error('[DB] Database error counting customers:', err)
      throw err
    }
  }

  async find(filter?: Partial<Customer>, offset?: number): Promise<{ customers: Customer[], total: number }> {
    try {
      if (offset !== undefined && (offset < 0 || !Number.isInteger(offset))) {
        throw { status: 400, message: 'Invalid offset parameter' }
      }
      
      // Remove null/undefined values from filter
      const where = filter ? Object.fromEntries(
        Object.entries(filter).filter(([_, v]) => v != null)
      ) : undefined

      const [customers, total] = await this.repository.findAndCount({ 
        where: where, 
        skip: offset || 0,  // ✅ תקן: default to 0 אם undefined
        take: limit 
      })
      return { customers, total }
    } catch (err) {
      logger.error('[DB] Database error finding customers:', err)
      throw err
    }
  }

  async findByDate(startDate: Date, endDate: Date, offset?: number): Promise<{ customers: Customer[], total: number }> {
    try {
      if (offset !== undefined && (offset < 0 || !Number.isInteger(offset))) {
        throw { status: 400, message: 'Invalid offset parameter' }
      }
      if (startDate > endDate) {
        throw { status: 400, message: 'startDate must be before endDate' }
      }
      const [customers, total] = await this.repository.findAndCount({
        where: {
          created_at: Between(startDate, endDate)
        },
        skip: offset,
        take: limit
      })
      return { customers, total }
    } catch (err) {
      logger.error('[DB] Database error finding customers:', err)
      throw err
    }
  }
}

// Export singleton instance
export const customerRepository = new CustomerRepository()
