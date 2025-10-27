import { Repository, ILike, Between, In, MoreThan } from 'typeorm'
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
   */
  async getCustomerById(customer_id: number): Promise<Customer | null> {
    try {
      const customer = await this.repository.findOne({
        where: { customer_id },
      })

      if (!customer) {
        logger.debug('[DB] Customer not found in database', { customer_id })
      }
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

      const updatedCustomer = await this.repository.findOne({
        where: { customer_id },
      })

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

      const customer = await this.repository.findOne({
        where: { customer_id },
      })

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
   * Find existing customer by email or id_number
   * Used to check for duplicates before creating/updating
   */
  async findExistingCustomer(criteria: {
    customer_id?: number
    email?: string
    id_number?: string
  }): Promise<Customer | null> {
    try {
      logger.debug('[DB] Searching for existing customer', { criteria })

      const query = this.repository.createQueryBuilder('customer')

      // Build WHERE clause based on criteria
      if (criteria.email && criteria.id_number) {
        query.where('customer.email = :email OR customer.id_number = :id_number', {
          email: criteria.email,
          id_number: criteria.id_number,
        })
      } else if (criteria.email) {
        query.where('customer.email = :email', { email: criteria.email })
      } else if (criteria.id_number) {
        query.where('customer.id_number = :id_number', { id_number: criteria.id_number })
      }

      // Exclude the customer being updated
      if (criteria.customer_id) {
        query.andWhere('customer.customer_id != :customer_id', { customer_id: criteria.customer_id })
      }

      const customer = await query.getOne()

      if (customer) {
        logger.debug('[DB] Found existing customer with matching criteria', {
          found_id: customer.customer_id,
        })
      }

      return customer || null
    } catch (err) {
      logger.error('[DB] Database error searching for customer:', err)
      throw err
    }
  }

  /**
   * Check if customer exists by ID
   */
  async doesCustomerExist(customer_id: number): Promise<boolean> {
    try {
      const result = await this.repository.count({
        where: { customer_id },
      })
      return result > 0
    } catch (err) {
      logger.error('[DB] Database error checking customer existence:', err)
      throw err
    }
  }

  /**
   * Get all unique cities with customers
   */
  async getUniqueCities(): Promise<string[]> {
    try {
      logger.debug('[DB] Fetching unique cities')

      const results = await this.repository
        .createQueryBuilder('customer')
        .select('DISTINCT customer.city', 'city')
        .where('customer.city IS NOT NULL')
        .andWhere("customer.city != ''")
        .orderBy('customer.city', 'ASC')
        .getRawMany()

      const cities = results.map((result) => result.city)

      logger.debug('[DB] Retrieved unique cities', { count: cities.length })
      return cities
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

      let query = this.repository.createQueryBuilder('customer')

      // Add search filters - all terms must match
      terms.forEach((term, index) => {
        query = query.andWhere(
          `(customer.first_name ILIKE :term${index} OR customer.last_name ILIKE :term${index})`,
          { [`term${index}`]: `%${term}%` },
        )
      })

      // Get total count
      const total = await query.getCount()

      // Apply pagination
      query = query.orderBy('customer.customer_id', 'ASC').skip(offset).take(limit)

      const customers = await query.getMany()

      logger.debug('[DB] Search completed', {
        searchTerm: trimmed,
        found: customers.length,
        total,
      })

      return {
        customers,
        total,
      }
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

  /**
   * Generic filter method for flexible customer filtering
   * Supports multiple filter criteria at once
   * @param filters - Filter criteria object
   * @param offset - Pagination offset
   * @returns Filtered customers and total count
   */
  async filterCustomers(
    filters: {
      city?: string
      status?: CustomerStatus
      startDate?: Date
      endDate?: Date
      email?: string
      id_number?: string
    },
    offset: number,
  ): Promise<{ customers: Customer[]; total: number }> {
    try {
      logger.debug('[DB] Filtering customers with criteria', { filters, offset })

      const query = this.repository.createQueryBuilder('customer')

      // Apply city filter
      if (filters.city) {
        query.andWhere('customer.city = :city', { city: filters.city })
      }

      // Apply status filter
      if (filters.status) {
        query.andWhere('customer.status = :status', { status: filters.status })
      }

      // Apply date range filter
      if (filters.startDate && filters.endDate) {
        query.andWhere('customer.created_at BETWEEN :startDate AND :endDate', {
          startDate: filters.startDate,
          endDate: filters.endDate,
        })
      } else if (filters.startDate) {
        query.andWhere('customer.created_at >= :startDate', { startDate: filters.startDate })
      } else if (filters.endDate) {
        query.andWhere('customer.created_at <= :endDate', { endDate: filters.endDate })
      }

      // Apply email filter (exact match or partial)
      if (filters.email) {
        query.andWhere('customer.email ILIKE :email', { email: `%${filters.email}%` })
      }

      // Apply id_number filter (exact match)
      if (filters.id_number) {
        query.andWhere('customer.id_number = :id_number', { id_number: filters.id_number })
      }

      // Get total count before pagination
      const total = await query.getCount()

      // Apply pagination
      query.orderBy('customer.customer_id', 'ASC').skip(offset).take(limit)

      const customers = await query.getMany()

      logger.debug('[DB] Filter completed', {
        filters,
        found: customers.length,
        total,
      })

      return { customers, total }
    } catch (err) {
      logger.error('[DB] Database error filtering customers:', err)
      throw err
    }
  }
}

// Export singleton instance
export const customerRepository = new CustomerRepository()
