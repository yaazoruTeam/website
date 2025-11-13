import { Repository, LessThanOrEqual } from 'typeorm'
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

  async createCustomerDevice(customerDeviceData: Partial<CustomerDevice>): Promise<CustomerDevice> {
    try {
      logger.debug('[DB] Creating customer device', {
        customer_id: customerDeviceData.customer_id,
        device_id: customerDeviceData.device_id,
      })

      const customerDevice = this.repository.create(customerDeviceData)
      return await this.repository.save(customerDevice)
    } catch (err) {
      logger.error('[DB] Error creating customer device:', err)
      throw err
    }
  }

  async getCustomerDevices(offset: number): Promise<{ customerDevices: CustomerDevice[]; total: number }> {
    try {
      const [customerDevices, total] = await this.repository.findAndCount({
        skip: offset,
        take: limit,
        order: { customerDevice_id: 'ASC' },
        relations: ['customer', 'device'],
      })
      return { customerDevices, total }
    } catch (err) {
      logger.error('[DB] Error fetching customer devices:', err)
      throw err
    }
  }

  async getCustomerDeviceById(customerDevice_id: number): Promise<CustomerDevice | null> {
    try {
      return await this.repository.findOne({
        where: { customerDevice_id },
        relations: ['customer', 'device'],
      })
    } catch (err) {
      logger.error('[DB] Error fetching customer device by ID:', err)
      throw err
    }
  }

  async getCustomerDeviceByCustomerId(customer_id: number, offset: number): Promise<{ customerDevices: CustomerDevice[]; total: number }> {
    try {
      const [customerDevices, total] = await this.repository.findAndCount({
        where: { customer_id },
        relations: ['device'],
        order: { receivedAt: 'DESC' },
        skip: offset,
        take: limit,
      })
      return { customerDevices, total }
    } catch (err) {
      logger.error('[DB] Error fetching devices by customer ID:', err)
      throw err
    }
  }

  async getCustomerDeviceByDeviceId(device_id: number, offset: number): Promise<{ customerDevices: CustomerDevice[]; total: number }> {
    try {
      const [customerDevices, total] = await this.repository.findAndCount({
        where: { device_id },
        relations: ['customer'],
        order: { receivedAt: 'DESC' },
        skip: offset,
        take: limit,
      })
      return { customerDevices, total }
    } catch (err) {
      logger.error('[DB] Error fetching customers by device ID:', err)
      throw err
    }
  }

  async updateCustomerDevice(customerDevice_id: number, updateData: Partial<CustomerDevice>): Promise<CustomerDevice> {
    try {
      const result = await this.repository.update(customerDevice_id, {
        ...updateData,
        updated_at: new Date(),
      })

      if (!result.affected) {
        throw { status: 404, message: 'Customer device not found' }
      }

      return (await this.getCustomerDeviceById(customerDevice_id))!
    } catch (err) {
      logger.error('[DB] Error updating customer device:', err)
      throw err
    }
  }

  async deleteCustomerDevice(customerDevice_id: number): Promise<void> {
    try {
      const result = await this.repository.delete(customerDevice_id)
      if (!result.affected) throw { status: 404, message: 'Customer device not found' }
    } catch (err) {
      logger.error('[DB] Error deleting customer device:', err)
      throw err
    }
  }

  async findExistingCustomerDevice(criteria: { customerDevice_id?: number; device_id?: number }): Promise<CustomerDevice | null> {
    try {
      if (!criteria.device_id) return null

      const customerDevice = await this.repository.findOne({
        where: { device_id: criteria.device_id },
        relations: ['customer'],
      })

      if (!customerDevice) return null
      if (criteria.customerDevice_id && customerDevice.customerDevice_id === criteria.customerDevice_id) return null

      return customerDevice
    } catch (err) {
      logger.error('[DB] Error checking existing device assignment:', err)
      throw err
    }
  }

  /**
   * Get all expired plan devices (planEndDate <= today)
   */
  async getExpiredPlanDevices(): Promise<CustomerDevice[]> {
    try {
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const expiredDevices = await this.repository.find({
        where: { planEndDate: LessThanOrEqual(today) },
      })

      return expiredDevices
    } catch (err) {
      logger.error('[DB] Error fetching expired plan devices:', err)
      throw err
    }
  }
}

// Export singleton instance
export const customerDeviceRepository = new CustomerDeviceRepository()
