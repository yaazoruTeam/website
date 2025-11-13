import { Repository, In, Between } from 'typeorm'
import { AppDataSource } from '../data-source'
import { Device, DeviceStatus } from '../entities/Device'
import logger from '../utils/logger'
import config from '../config/index'

const limit = config.database.limit

/**
 * DeviceRepository - Handles all database operations for devices
 * Replaces the old knex-based db/Device.ts
 * TypeORM-based repository for modern, type-safe database operations
 */
export class DeviceRepository {
  private repository: Repository<Device>

  constructor() {
    this.repository = AppDataSource.getRepository(Device)
  }

  /**
   * Create a new device
   * @param deviceData - Device data to create
   * @throws Error if device with duplicate unique fields already exists
   */
  async createDevice(deviceData: Partial<Device> | any): Promise<Device> {
    try {
      logger.debug('[DB] Creating device in database', {
        IMEI_1: deviceData.IMEI_1,
        SIM_number: deviceData.SIM_number,
      })

      const device = this.repository.create({
        ...deviceData,
        registrationDate: deviceData.registrationDate || new Date(),
      })
      const savedDevice = await this.repository.save(device) as unknown as Device

      logger.debug('[DB] Device created successfully', { device_id: savedDevice.device_id })
      return savedDevice
    } catch (err) {
      logger.error('[DB] Database error creating device:', err)
      throw err
    }
  }

  /**
   * Get devices with pagination
   * @param offset - Offset for pagination
   * @returns Paginated devices list with total count
   */
  async getDevices(offset: number): Promise<{ devices: Device[]; total: number }> {
    try {
      logger.debug('[DB] Fetching devices from database', { offset, limit })

      const [devices, total] = await this.repository.findAndCount({
        skip: offset,
        take: limit,
        order: { device_id: 'ASC' },
      })

      return { devices, total }
    } catch (err) {
      logger.error('[DB] Database error fetching devices:', err)
      throw err
    }
  }

  /**
   * Get device by ID
   * @param device_id - Device ID
   * @returns Device or null if not found
   */
  async getDeviceById(device_id: number): Promise<Device | null> {
    try {
      logger.debug('[DB] Fetching device by ID', { device_id })

      const device = await this.repository.findOne({
        where: { device_id },
      })

      return device || null
    } catch (err) {
      logger.error('[DB] Database error fetching device by ID:', err)
      throw err
    }
  }

  /**
   * Get devices by status with pagination
   * @param status - Device status (active or inactive)
   * @param offset - Offset for pagination
   * @returns Paginated devices list with total count
   */
  async getDevicesByStatus(
    status: DeviceStatus,
    offset: number,
  ): Promise<{ devices: Device[]; total: number }> {
    try {
      logger.debug('[DB] Fetching devices by status', { status, offset, limit })

      const [devices, total] = await this.repository.findAndCount({
        where: { status },
        skip: offset,
        take: limit,
        order: { device_id: 'ASC' },
      })

      return { devices, total }
    } catch (err) {
      logger.error('[DB] Database error fetching devices by status:', err)
      throw err
    }
  }

  /**
   * Update device
   * @param device_id - Device ID to update
   * @param updateData - Partial device data to update
   * @returns Updated device
   * @throws Error if device not found (404)
   */
  async updateDevice(device_id: number, updateData: Partial<Device> | any): Promise<Device> {
    try {
      logger.debug('[DB] Updating device in database', { device_id })

      // Update with new updated_at timestamp
      await this.repository.update(device_id, {
        ...updateData,
        updated_at: new Date(),
      })

      const updatedDevice: Device | null = await this.getDeviceById(device_id)

      if (!updatedDevice) {
        logger.warn('[DB] Device not found for update', { device_id })
        throw { status: 404, message: 'Device not found' }
      }

      logger.debug('[DB] Device updated successfully', { device_id })
      return updatedDevice
    } catch (err) {
      logger.error('[DB] Database error updating device:', err)
      throw err
    }
  }

  /**
   * Soft delete device (mark as inactive)
   * @param device_id - Device ID to delete
   * @returns Updated device with inactive status
   * @throws Error if device not found (404)
   */
  async deleteDevice(device_id: number): Promise<Device> {
    try {
      logger.debug('[DB] Soft deleting device (marking inactive)', { device_id })

      const device: Device | null = await this.getDeviceById(device_id)
      if (!device) {
        logger.warn('[DB] Device not found for deletion', { device_id })
        throw { status: 404, message: 'Device not found' }
      }

      // Soft delete - just mark as inactive
      device.status = DeviceStatus.INACTIVE
      const deletedDevice = await this.repository.save(device)

      logger.debug('[DB] Device soft deleted successfully', { device_id })
      return deletedDevice
    } catch (err) {
      logger.error('[DB] Database error deleting device:', err)
      throw err
    }
  }

  /**
   * Find existing device by unique fields (SIM_number, IMEI_1, serialNumber, device_number)
   * Used to check for duplicates before creating/updating
   * Executes queries in parallel for better performance
   * 
   * @param criteria - Search criteria with optional device_id to exclude from search
   * @returns Device if found, null otherwise
   * 
   * Important: This checks ALL UNIQUE fields to prevent constraint violations
   */
  async findExistingDevice(criteria: {
    device_id?: number | string | undefined
    SIM_number?: string
    IMEI_1?: string
    serialNumber?: string
    device_number?: string
  }): Promise<Device | null> {
    try {
      logger.debug('[DB] Searching for existing device', { criteria })

      // Execute all unique field queries in parallel
      const [deviceBySIM, deviceByIMEI, deviceBySerial, deviceByNumber] = await Promise.all([
        criteria.SIM_number
          ? this.repository.findOne({
            where: { SIM_number: criteria.SIM_number },
          })
          : Promise.resolve(null),
        criteria.IMEI_1
          ? this.repository.findOne({
            where: { IMEI_1: criteria.IMEI_1 },
          })
          : Promise.resolve(null),
        criteria.serialNumber
          ? this.repository.findOne({
            where: { serialNumber: criteria.serialNumber },
          })
          : Promise.resolve(null),
        criteria.device_number
          ? this.repository.findOne({
            where: { device_number: criteria.device_number },
          })
          : Promise.resolve(null),
      ])

      // Get first match (SIM_number, IMEI_1, serialNumber, or device_number - in priority order)
      const device = deviceBySIM || deviceByIMEI || deviceBySerial || deviceByNumber

      // Filter out if it's the same device being updated
      if (device && criteria.device_id && device.device_id === Number(criteria.device_id)) {
        return null
      }

      if (device) {
        logger.debug('[DB] Found existing device with matching criteria', {
          found_id: device.device_id,
          matchedBy: deviceBySIM
            ? 'SIM_number'
            : deviceByIMEI
              ? 'IMEI_1'
              : deviceBySerial
                ? 'serialNumber'
                : 'device_number',
        })
      }

      return device
    } catch (err) {
      logger.error('[DB] Database error searching for device:', err)
      throw err
    }
  }

  /**
   * Check if device exists by ID
   * @param device_id - Device ID
   * @returns true if device exists, false otherwise
   */
  async doesDeviceExist(device_id: number): Promise<boolean> {
    try {
      const result = await this.repository.findOne({
        where: { device_id },
        select: ['device_id'],
      })
      return !!result
    } catch (err) {
      logger.error('[DB] Database error checking if device exists:', err)
      throw err
    }
  }

  /**
   * Get all devices (without pagination) - use with caution!
   * @returns All devices
   */
  async getAllDevices(): Promise<Device[]> {
    try {
      logger.debug('[DB] Fetching all devices')
      return await this.repository.find({
        order: { device_id: 'ASC' },
      })
    } catch (err) {
      logger.error('[DB] Database error fetching all devices:', err)
      throw err
    }
  }

  /**
   * Bulk update devices status
   * @param device_ids - Array of device IDs
   * @param status - Status to set
   * @returns Number of affected devices
   */
  async updateDevicesStatus(device_ids: number[], status: DeviceStatus): Promise<number> {
    try {
      logger.debug('[DB] Bulk updating devices status', {
        count: device_ids.length,
        status,
      })

      const result = await this.repository.update(
        { device_id: In(device_ids) },
        { status },
      )

      logger.debug('[DB] Bulk update completed', { affected: result.affected })
      return result.affected || 0
    } catch (err) {
      logger.error('[DB] Database error bulk updating devices:', err)
      throw err
    }
  }

  /**
   * Count total devices
   * @returns Total device count
   */
  async countDevices(): Promise<number> {
    try {
      return await this.repository.count()
    } catch (err) {
      logger.error('[DB] Database error counting devices:', err)
      throw err
    }
  }

  /**
   * Find devices by filter criteria with pagination
   * @param filter - Device filter criteria
   * @param offset - Pagination offset
   * @returns Devices matching criteria with total count
   */
  async find(
    filter?: Partial<Device>,
    offset?: number,
  ): Promise<{ devices: Device[]; total: number }> {
    try {
      if (offset !== undefined && (offset < 0 || !Number.isInteger(offset))) {
        throw { status: 400, message: 'Invalid offset parameter' }
      }

      // Remove null/undefined values from filter
      const where = filter
        ? Object.fromEntries(Object.entries(filter).filter(([_, v]) => v != null))
        : undefined

      const [devices, total] = await this.repository.findAndCount({
        where: where,
        skip: offset || 0,
        take: limit,
        order: { device_id: 'ASC' },
      })

      logger.debug('[DB] Find devices completed', { found: devices.length, total })
      return { devices, total }
    } catch (err) {
      logger.error('[DB] Database error finding devices:', err)
      throw err
    }
  }

  /**
   * Find devices by date range
   * @param startDate - Start date
   * @param endDate - End date
   * @param offset - Pagination offset
   * @returns Devices created within date range with total count
   */
  async findByDate(
    startDate: Date,
    endDate: Date,
    offset?: number,
  ): Promise<{ devices: Device[]; total: number }> {
    try {
      if (offset !== undefined && (offset < 0 || !Number.isInteger(offset))) {
        throw { status: 400, message: 'Invalid offset parameter' }
      }
      if (startDate > endDate) {
        throw { status: 400, message: 'startDate must be before endDate' }
      }

      logger.debug('[DB] Finding devices by date range', { startDate, endDate })

      const [devices, total] = await this.repository.findAndCount({
        where: {
          registrationDate: Between(startDate, endDate),
        },
        skip: offset || 0,
        take: limit,
        order: { device_id: 'ASC' },
      })

      logger.debug('[DB] Find by date completed', { found: devices.length, total })
      return { devices, total }
    } catch (err) {
      logger.error('[DB] Database error finding devices by date:', err)
      throw err
    }
  }
}

// Export singleton instance
export const deviceRepository = new DeviceRepository()
