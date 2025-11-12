import { Repository, ILike, Between, In, FindOptionsOrder } from 'typeorm'
import { AppDataSource } from '../data-source'
import { Customer, CustomerStatus } from '../entities/Customer'
import logger from '../utils/logger'
import config from '../config/index'

const limit = config.database.limit

// מיון לפי סטטוס (ACTIVE קודם) ואז לפי השם
const CUSTOMER_ORDER_BY: FindOptionsOrder<Customer> = {
  status: 'ASC',         // ACTIVE לפני INACTIVE
  last_name: 'ASC',      // לפי הא"ב של שם משפחה
  first_name: 'ASC',     // לפי הא"ב של השם הפרטי

}

export class CustomerRepository {
  private repository: Repository<Customer>

  constructor() {
    this.repository = AppDataSource.getRepository(Customer)
  }

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
        order: CUSTOMER_ORDER_BY,
      })
      return { customers, total }
    } catch (err) {
      logger.error('[DB] Database error fetching customers:', err)
      throw err
    }
  }

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

  async updateCustomer(customer_id: number, updateData: Partial<Customer>): Promise<Customer> {
    try {
      logger.debug('[DB] Updating customer in database', { customer_id })
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

  async deleteCustomer(customer_id: number): Promise<Customer> {
    try {
      logger.debug('[DB] Soft deleting customer (marking inactive)', { customer_id })
      const customer: Customer | null = await this.getCustomerById(customer_id)
      if (!customer) {
        logger.warn('[DB] Customer not found for deletion', { customer_id })
        throw { status: 404, message: 'Customer not found' }
      }
      customer.status = CustomerStatus.INACTIVE
      const deletedCustomer = await this.repository.save(customer)
      logger.debug('[DB] Customer soft deleted successfully', { customer_id })
      return deletedCustomer
    } catch (err) {
      logger.error('[DB] Database error deleting customer:', err)
      throw err
    }
  }

  async findExistingCustomer(criteria: {
    customer_id?: number
    email?: string
    id_number?: string
    phone_number?: string
  }): Promise<Customer | null> {
    try {
      logger.debug('[DB] Searching for existing customer', { criteria })
      const [customerByEmail, customerByIdNumber, customerByPhoneNumber] = await Promise.all([
        criteria.email
          ? this.repository.findOne({ where: { email: criteria.email } })
          : Promise.resolve(null),
        criteria.id_number
          ? this.repository.findOne({ where: { id_number: criteria.id_number } })
          : Promise.resolve(null),
        criteria.phone_number
          ? this.repository.findOne({ where: { phone_number: criteria.phone_number } })
          : Promise.resolve(null),
      ])
      const customer = customerByEmail || customerByIdNumber || customerByPhoneNumber
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

  async getUniqueCities(): Promise<string[]> {
    try {
      logger.debug('[DB] Fetching unique cities')
      const cities = await this.repository
        .createQueryBuilder('customer')
        .select('DISTINCT customer.city', 'city')
        .where('customer.city IS NOT NULL')
        .andWhere("customer.city != ''")
        .orderBy('customer.city', 'ASC')
        .getRawMany<{ city: string }>()
      const uniqueCities = cities.map((row) => row.city)
      logger.debug('[DB] Retrieved unique cities', { count: uniqueCities.length })
      return uniqueCities
    } catch (err) {
      logger.error('[DB] Database error fetching unique cities:', err)
      throw err
    }
  }

  async searchCustomersByName(searchTerm: string, offset: number): Promise<{ customers: Customer[]; total: number }> {
    try {
      const trimmed = searchTerm.trim()
      if (!trimmed) {
        logger.debug('[DB] Empty search term provided')
        return { customers: [], total: 0 }
      }
      const terms = trimmed.split(/\s+/)
      const where = terms.map((term) => [
        { first_name: ILike(`%${term}%`) },
        { last_name: ILike(`%${term}%`) },
      ])
      const flatWhere = where.flat()
      const [customers, total] = await this.repository.findAndCount({
        where: flatWhere,
        skip: offset,
        take: limit,
        order: CUSTOMER_ORDER_BY,
      })
      logger.debug('[DB] Search completed', { searchTerm: trimmed, found: customers.length, total })
      return { customers, total }
    } catch (err) {
      logger.error('[DB] Database error searching customers by name:', err)
      throw err
    }
  }

  async getAllCustomers(): Promise<Customer[]> {
    try {
      logger.debug('[DB] Fetching all customers')
      return await this.repository.find({ order: CUSTOMER_ORDER_BY })
    } catch (err) {
      logger.error('[DB] Database error fetching all customers:', err)
      throw err
    }
  }

  async updateCustomersStatus(customer_ids: number[], status: CustomerStatus): Promise<number> {
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
      const where = filter ? Object.fromEntries(Object.entries(filter).filter(([_, v]) => v != null)) : undefined
      const [customers, total] = await this.repository.findAndCount({
        where,
        skip: offset || 0,
        take: limit,
        order: CUSTOMER_ORDER_BY,
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
        where: { created_at: Between(startDate, endDate) },
        skip: offset || 0,
        take: limit,
        order: CUSTOMER_ORDER_BY,
      })
      return { customers, total }
    } catch (err) {
      logger.error('[DB] Database error finding customers by date:', err)
      throw err
    }
  }
}

// Export singleton instance
export const customerRepository = new CustomerRepository()
