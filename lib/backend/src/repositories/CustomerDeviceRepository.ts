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
   *   Note: While the type is Partial, the database schema requires customer_id, device_id, and receivedAt.
   *   Missing required fields will cause a database constraint violation.
   *   Optional fields: planEndDate and other properties of CustomerDevice may be provided.
   * @returns {Promise<CustomerDevice>} The newly created CustomerDevice entity.
   * @throws {Error} Database error if required fields are missing or constraint violations occur (e.g., duplicate customer_id + device_id combination)
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
   * Get all devices for a specific customer with pagination
   * @param {number} customer_id - The ID of the customer whose devices are to be fetched
   * @param {number} offset - The number of records to skip for pagination
   * @returns {Promise<{ customerDevices: CustomerDevice[]; total: number }>} Object containing array of CustomerDevice objects and total count
   */
  async getCustomerDeviceByCustomerId(customer_id: number, offset: number): Promise<{ customerDevices: CustomerDevice[]; total: number }> {
    try {
      logger.debug('[DB] Fetching devices for customer', { customer_id, offset, limit })

      const [customerDevices, total] = await this.repository.findAndCount({
        where: { customer_id },
        relations: ['device'],
        order: { receivedAt: 'DESC' },
        skip: offset,
        take: limit,
      })

      return { customerDevices, total }
    } catch (err) {
      logger.error('[DB] Database error fetching devices by customer ID:', err)
      throw err
    }
  }

  /**
   * Get all customers for a specific device with pagination
   * @param {number} device_id - The ID of the device to fetch customers for
   * @param {number} offset - The number of records to skip for pagination
   * @returns {Promise<{ customerDevices: CustomerDevice[]; total: number }>} Object containing array of CustomerDevice entities and total count
   */
  async getCustomerDeviceByDeviceId(device_id: number, offset: number): Promise<{ customerDevices: CustomerDevice[]; total: number }> {
    try {
      logger.debug('[DB] Fetching customers for device', { device_id, offset, limit })

      const [customerDevices, total] = await this.repository.findAndCount({
        where: { device_id },
        relations: ['customer'],
        order: { receivedAt: 'DESC' },
        skip: offset,
        take: limit,
      })

      return { customerDevices, total }
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
   * @throws {Error} Throws a 404 error if the customer device is not found
   */
  async updateCustomerDevice(
    customerDevice_id: number,
    updateData: Partial<CustomerDevice>,
  ): Promise<CustomerDevice> {
    try {
      logger.debug('[DB] Updating customer device in database', { customerDevice_id })

      const result = await this.repository.update(customerDevice_id, {
        ...updateData,
        updated_at: new Date(),
      })

      if (!result.affected) {
        logger.warn('[DB] Customer device not found for update', { customerDevice_id })
        throw { status: 404, message: 'Customer device not found' }
      }

      const updatedCustomerDevice = await this.getCustomerDeviceById(customerDevice_id)

      logger.debug('[DB] Customer device updated successfully', { customerDevice_id })
      return updatedCustomerDevice!
    } catch (err) {
      logger.error('[DB] Database error updating customer device:', err)
      throw err
    }
  }

  /**
   * Delete customer device
   * @param {number} customerDevice_id - The ID of the customer device to delete
   * @returns {Promise<void>}
   * @throws {Error} Throws a 404 error if the customer device is not found
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
   * Find existing customer device - prevents duplicate device assignments
   * 
   * 🎯 BUSINESS RULE: One device can only be assigned to ONE customer
   * �? But one customer CAN have MULTIPLE devices
   * 
   * Used to check for duplicates before creating/updating customer-device assignments
   * 
   * @param {Object} criteria - Search criteria
   * @param {number} [criteria.customerDevice_id] - Optional: customerDevice_id to exclude (for updates)
   * @param {number} [criteria.device_id] - The device ID to check if already assigned
   * @returns {Promise<CustomerDevice | null>} The existing CustomerDevice if device is already assigned, null otherwise
   * 
   * @example
   * // Check if device is already assigned to any customer (for CREATE)
   * const exists = await findExistingCustomerDevice({ device_id: 456 })
   * if (exists) {
   *   throw new Error(`Device ${456} is already assigned to customer ${exists.customer_id}`)
   * }
   * 
   * @example
   * // Check if device is assigned to another customer during UPDATE
   * const exists = await findExistingCustomerDevice({ 
   *   customerDevice_id: 789,  // Exclude current assignment
   *   device_id: 456 
   * })
   * if (exists) {
   *   throw new Error(`Device ${456} is already assigned to customer ${exists.customer_id}`)
   * }
   */
  async findExistingCustomerDevice(criteria: {
    customerDevice_id?: number
    device_id?: number
  }): Promise<CustomerDevice | null> {
    try {
      logger.debug('[DB] Checking if device is already assigned', criteria)

      // Validate input - device_id is required for this check
      if (!criteria.device_id) {
        logger.warn('[DB] findExistingCustomerDevice called without device_id')
        return null
      }

      // Search for device assignment
      const customerDevice = await this.repository.findOne({
        where: { device_id: criteria.device_id },
        relations: ['customer'], // Include customer info for better logging
      })

      // If no assignment found, device is available
      if (!customerDevice) {
        logger.debug('[DB] Device is available (not assigned to any customer)', {
          device_id: criteria.device_id,
        })
        return null
      }

      // If this is an update operation, check if it's the same assignment
      if (criteria.customerDevice_id && customerDevice.customerDevice_id === criteria.customerDevice_id) {
        logger.debug('[DB] Found assignment but it is the same record being updated', {
          customerDevice_id: customerDevice.customerDevice_id,
          device_id: criteria.device_id,
        })
        return null // Not a conflict - it's the same assignment
      }

      // Device is already assigned to another customer - CONFLICT!
      logger.warn('[DB] ⚠️ CONFLICT: Device is already assigned to a customer', {
        device_id: criteria.device_id,
        assigned_to_customer_id: customerDevice.customer_id,
        customerDevice_id: customerDevice.customerDevice_id,
        attempting_to_assign: criteria.customerDevice_id ? 'update' : 'create',
      })

      return customerDevice
    } catch (err) {
      logger.error('[DB] Database error checking device assignment:', err)
      throw err
    }
  }

}

// Export singleton instance
export const customerDeviceRepository = new CustomerDeviceRepository()
