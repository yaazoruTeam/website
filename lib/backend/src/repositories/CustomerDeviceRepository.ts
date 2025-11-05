import { Repository, Between, In } from 'typeorm'
import { AppDataSource } from '../data-source'
import { CustomerDevice } from '../entities/CustomerDevice'
import logger from '../utils/logger'
import config from '../config/index'

const limit = config.database.limit

/**
 * CustomerDeviceRepository - Handles all database operations for customer devices
 * TypeORM-based repository for modern, type-safe database operations
 */
export class CustomerDeviceRepository {
  private repository: Repository<CustomerDevice>

  constructor() {
    this.repository = AppDataSource.getRepository(CustomerDevice)
  }

  /**
   * Create a new customer device assignment.
   * @param {Partial<CustomerDevice>} customerDeviceData - Data for the customer device. 
   *   Required fields: customer_id, device_id, receivedAt. 
   *   Optional fields: planEndDate and other properties of CustomerDevice may be provided.
   * @returns {Promise<CustomerDevice>} The newly created CustomerDevice entity.
   */
  async createCustomerDevice(customerDeviceData: Partial<CustomerDevice>): Promise<CustomerDevice> {
    try {
      logger.debug('[DB] Creating customer device in database', {
        customer_id: customerDeviceData.customer_id,
        device_id: customerDeviceData.device_id,
      })

      const customerDevice = this.repository.create(customerDeviceData)
      const savedCustomerDevice = await this.repository.save(customerDevice)

      logger.debug('[DB] Customer device created successfully', {
        customerDevice_id: savedCustomerDevice.customerDevice_id,
      })
      return savedCustomerDevice
    } catch (err) {
      logger.error('[DB] Database error creating customer device:', err)
      throw err
    }
  }

  /**
   * Get customer devices with pagination
   * @param {number} offset - The number of records to skip for pagination
   * @returns {Promise<{ customerDevices: CustomerDevice[]; total: number }>} Object containing array of customer devices and total count
   */
  async getCustomerDevices(offset: number): Promise<{ customerDevices: CustomerDevice[]; total: number }> {
    try {
      logger.debug('[DB] Fetching customer devices from database', { offset, limit })

      const [customerDevices, total] = await this.repository.findAndCount({
        skip: offset,
        take: limit,
        order: { customerDevice_id: 'ASC' },
        relations: ['customer', 'device'],
      })

      return { customerDevices, total }
    } catch (err) {
      logger.error('[DB] Database error fetching customer devices:', err)
      throw err
    }
  }

  /**
   * Retrieves a customer device assignment by its unique ID.
   * @param {number} customerDevice_id - The unique identifier of the customer device assignment to retrieve.
   * @returns {Promise<CustomerDevice | null>} A Promise that resolves to the CustomerDevice object if found, or null if not found.
   */
  async getCustomerDeviceById(customerDevice_id: number): Promise<CustomerDevice | null> {
    try {
      logger.debug('[DB] Fetching customer device by ID', { customerDevice_id })

      const customerDevice = await this.repository.findOne({
        where: { customerDevice_id },
        relations: ['customer', 'device'],
      })

      return customerDevice || null
    } catch (err) {
      logger.error('[DB] Database error fetching customer device by ID:', err)
      throw err
    }
  }

  /**
   * Get all devices for a specific customer
   * @param {number} customer_id - The ID of the customer whose devices are to be fetched
   * @returns {Promise<CustomerDevice[]>} Array of CustomerDevice objects with device relations loaded
   */
  async getDevicesByCustomerId(customer_id: number): Promise<CustomerDevice[]> {
    try {
      logger.debug('[DB] Fetching devices for customer', { customer_id })

      const customerDevices = await this.repository.find({
        where: { customer_id },
        relations: ['device'],
        order: { receivedAt: 'DESC' },
      })

      return customerDevices
    } catch (err) {
      logger.error('[DB] Database error fetching devices by customer ID:', err)
      throw err
    }
  }

  /**
   * Get all customers for a specific device
   * @param {number} device_id - The ID of the device to fetch customers for
   * @returns {Promise<CustomerDevice[]>} An array of CustomerDevice entities associated with the device
   */
  async getCustomersByDeviceId(device_id: number): Promise<CustomerDevice[]> {
    try {
      logger.debug('[DB] Fetching customers for device', { device_id })

      const customerDevices = await this.repository.find({
        where: { device_id },
        relations: ['customer'],
        order: { receivedAt: 'DESC' },
      })

      return customerDevices
    } catch (err) {
      logger.error('[DB] Database error fetching customers by device ID:', err)
      throw err
    }
  }

  /**
   * Update customer device
   * @param {number} customerDevice_id - The ID of the customer device to update
   * @param {Partial<CustomerDevice>} updateData - Partial device data to update
   * @returns {Promise<CustomerDevice>} Updated customer device
   * @throws {object} Throws a 404 error object if the customer device is not found
   */
  async updateCustomerDevice(
    customerDevice_id: number,
    updateData: Partial<CustomerDevice>,
  ): Promise<CustomerDevice> {
    try {
      logger.debug('[DB] Updating customer device in database', { customerDevice_id })

      await this.repository.update(customerDevice_id, {
        ...updateData,
        updated_at: new Date(),
      })

      const updatedCustomerDevice = await this.getCustomerDeviceById(customerDevice_id)

      if (!updatedCustomerDevice) {
        logger.warn('[DB] Customer device not found for update', { customerDevice_id })
        throw { status: 404, message: 'Customer device not found' }
      }

      logger.debug('[DB] Customer device updated successfully', { customerDevice_id })
      return updatedCustomerDevice
    } catch (err) {
      logger.error('[DB] Database error updating customer device:', err)
      throw err
    }
  }

  /**
   * Delete customer device
   * @param {number} customerDevice_id - The ID of the customer device to delete
   * @returns {Promise<void>}
   * @throws {object} Throws a 404 error object if the customer device is not found
   */
  async deleteCustomerDevice(customerDevice_id: number): Promise<void> {
    try {
      logger.debug('[DB] Deleting customer device', { customerDevice_id })

      const result = await this.repository.delete(customerDevice_id)

      if (!result.affected) {
        logger.warn('[DB] Customer device not found for deletion', { customerDevice_id })
        throw { status: 404, message: 'Customer device not found' }
      }

      logger.debug('[DB] Customer device deleted successfully', { customerDevice_id })
    } catch (err) {
      logger.error('[DB] Database error deleting customer device:', err)
      throw err
    }
  }

  /**
   * Find existing customer device by customer_id and device_id
   * Used to check if a device is already assigned to a customer
   * @param {number} customer_id - The customer ID to search for
   * @param {number} device_id - The device ID to search for
   * @returns {Promise<CustomerDevice | null>} The existing CustomerDevice if found, null otherwise
   */
  async findExistingCustomerDevice(
    customer_id: number,
    device_id: number,
  ): Promise<CustomerDevice | null> {
    try {
      logger.debug('[DB] Searching for existing customer device', { customer_id, device_id })

      const customerDevice = await this.repository.findOne({
        where: { customer_id, device_id },
      })

      if (customerDevice) {
        logger.debug('[DB] Found existing customer device', {
          customerDevice_id: customerDevice.customerDevice_id,
        })
      }

      return customerDevice
    } catch (err) {
      logger.error('[DB] Database error searching for customer device:', err)
      throw err
    }
  }

  /**
   * Get all customer devices (without pagination) - use with caution!
   * @returns {Promise<CustomerDevice[]>} Array of all customer devices with customer and device relations loaded
   */
  async getAllCustomerDevices(): Promise<CustomerDevice[]> {
    try {
      logger.debug('[DB] Fetching all customer devices')
      return await this.repository.find({
        relations: ['customer', 'device'],
        order: { customerDevice_id: 'ASC' },
      })
    } catch (err) {
      logger.error('[DB] Database error fetching all customer devices:', err)
      throw err
    }
  }

  /**
   * Counts the total number of customer devices in the database.
   * @returns {Promise<number>} Promise resolving to the total count of customer devices.
   */
  async countCustomerDevices(): Promise<number> {
    try {
      return await this.repository.count()
    } catch (err) {
      logger.error('[DB] Database error counting customer devices:', err)
      throw err
    }
  }

  /**
   * Find customer devices by filter criteria with pagination
   * @param {Partial<CustomerDevice>} [filter] - Optional filter criteria to match customer devices
   * @param {number} [offset] - The number of records to skip for pagination (must be >= 0)
   * @returns {Promise<{ customerDevices: CustomerDevice[]; total: number }>} Object containing filtered customer devices and total count
   * @throws {object} Throws a 400 error object if offset is invalid (negative or non-integer)
   */
  async find(
    filter?: Partial<CustomerDevice>,
    offset?: number,
  ): Promise<{ customerDevices: CustomerDevice[]; total: number }> {
    try {
      if (offset !== undefined && (offset < 0 || !Number.isInteger(offset))) {
        throw { status: 400, message: 'Invalid offset parameter' }
      }

      const where = filter
        ? Object.fromEntries(Object.entries(filter).filter(([_, v]) => v != null))
        : undefined

      const [customerDevices, total] = await this.repository.findAndCount({
        where: where,
        skip: offset || 0,
        take: limit,
        relations: ['customer', 'device'],
        order: { customerDevice_id: 'ASC' },
      })

      logger.debug('[DB] Find customer devices completed', { found: customerDevices.length, total })
      return { customerDevices, total }
    } catch (err) {
      logger.error('[DB] Database error finding customer devices:', err)
      throw err
    }
  }

  /**
   * Find customer devices by date range (receivedAt)
   * @param {Date} startDate - The start date of the range (inclusive)
   * @param {Date} endDate - The end date of the range (inclusive)
   * @param {number} [offset] - The number of records to skip for pagination (must be >= 0)
   * @returns {Promise<{ customerDevices: CustomerDevice[]; total: number }>} Object containing customer devices within the date range and total count
   * @throws {object} Throws a 400 error object if offset is invalid or if startDate is after endDate
   */
  async findByDate(
    startDate: Date,
    endDate: Date,
    offset?: number,
  ): Promise<{ customerDevices: CustomerDevice[]; total: number }> {
    try {
      if (offset !== undefined && (offset < 0 || !Number.isInteger(offset))) {
        throw { status: 400, message: 'Invalid offset parameter' }
      }
      if (startDate > endDate) {
        throw { status: 400, message: 'startDate must be before endDate' }
      }

      logger.debug('[DB] Finding customer devices by date range', { startDate, endDate })

      const [customerDevices, total] = await this.repository.findAndCount({
        where: {
          receivedAt: Between(startDate, endDate),
        },
        skip: offset || 0,
        take: limit,
        relations: ['customer', 'device'],
        order: { receivedAt: 'DESC' },
      })

      logger.debug('[DB] Find by date completed', { found: customerDevices.length, total })
      return { customerDevices, total }
    } catch (err) {
      logger.error('[DB] Database error finding customer devices by date:', err)
      throw err
    }
  }

  /**
   * Finds customer devices with expired plans.
   * @param {Date} [referenceDate] - The date to compare plan end dates against. Defaults to the current date if not provided.
   * @returns {Promise<CustomerDevice[]>} Promise resolving to an array of customer devices with expired plans.
   */
  async findExpiredPlans(referenceDate?: Date): Promise<CustomerDevice[]> {
    try {
      const date = referenceDate || new Date()
      logger.debug('[DB] Finding customer devices with expired plans', { referenceDate: date })

      const customerDevices = await this.repository
        .createQueryBuilder('cd')
        .leftJoinAndSelect('cd.customer', 'customer')
        .leftJoinAndSelect('cd.device', 'device')
        .where('cd.planEndDate IS NOT NULL')
        .andWhere('cd.planEndDate < :date', { date })
        .orderBy('cd.planEndDate', 'ASC')
        .getMany()

      logger.debug('[DB] Found expired plans', { count: customerDevices.length })
      return customerDevices
    } catch (err) {
      logger.error('[DB] Database error finding expired plans:', err)
      throw err
    }
  }

  /**
   * Bulk delete customer devices by IDs
   * @param {number[]} customerDevice_ids - Array of customer device IDs to delete
   * @returns {Promise<number>} The count of deleted records
   */
  async bulkDelete(customerDevice_ids: number[]): Promise<number> {
    try {
      logger.debug('[DB] Bulk deleting customer devices', { count: customerDevice_ids.length })

      const result = await this.repository.delete({
        customerDevice_id: In(customerDevice_ids),
      })

      logger.debug('[DB] Bulk delete completed', { affected: result.affected })
      return result.affected || 0
    } catch (err) {
      logger.error('[DB] Database error bulk deleting customer devices:', err)
      throw err
    }
  }
}

// Export singleton instance
export const customerDeviceRepository = new CustomerDeviceRepository()
