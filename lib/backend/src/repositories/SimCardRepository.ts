import { Repository, In, Between, FindOptionsRelations } from 'typeorm'
import { AppDataSource } from '../data-source'
import { SimCards } from '../entities/SimCards'
import logger from '../utils/logger'
import config from '../config/index'

const limit = config.database.limit

/**
 * SimCardRepository - Handles all database operations for SIM cards
 * TypeORM-based repository for managing SIM card records with customer and device relationships
 */
export class SimCardRepository {
  private repository: Repository<SimCards>

  constructor() {
    this.repository = AppDataSource.getRepository(SimCards)
  }

  /**
   * Create a new SIM card record
   * @param simCardData - SIM card data to create
   * @returns Created SIM card entity
   * @throws Error if SIM number already exists or database error occurs
   */
  async createSimCard(simCardData: Partial<SimCards>): Promise<SimCards> {
    try {
      logger.debug('[DB] Creating SIM card in database', {
        simNumber: simCardData.simNumber,
        customer_id: simCardData.customer_id,
        device_id: simCardData.device_id,
      })

      const simCard = this.repository.create({
        ...simCardData,
        receivedAt: simCardData.receivedAt || new Date(),
      })

      const savedSimCard = await this.repository.save(simCard)

      logger.debug('[DB] SIM card created successfully', {
        simCard_id: savedSimCard.simCard_id,
        simNumber: savedSimCard.simNumber,
      })

      return savedSimCard
    } catch (err) {
      logger.error('[DB] Database error creating SIM card:', err)
      throw err
    }
  }

  /**
   * Get all SIM cards with pagination
   * @param offset - Offset for pagination
   * @param relations - Optional relations to load (customer, device)
   * @returns Paginated SIM cards list with total count
   */
  async getSimCards(
    offset: number,
    relations?: FindOptionsRelations<SimCards>,
  ): Promise<{ simCards: SimCards[]; total: number }> {
    try {
      logger.debug('[DB] Fetching SIM cards from database', { offset, limit })

      const [simCards, total] = await this.repository.findAndCount({
        skip: offset,
        take: limit,
        order: { simCard_id: 'ASC' },
        relations: relations || {},
      })

      logger.debug('[DB] SIM cards fetched successfully', { count: simCards.length, total })
      return { simCards, total }
    } catch (err) {
      logger.error('[DB] Database error fetching SIM cards:', err)
      throw err
    }
  }

  /**
   * Get SIM card by ID
   * @param simCard_id - SIM card ID (UUID)
   * @param relations - Optional relations to load (customer, device)
   * @returns SIM card entity or null if not found
   */
  async getSimCardById(
    simCard_id: string,
    relations?: FindOptionsRelations<SimCards>,
  ): Promise<SimCards | null> {
    try {
      logger.debug('[DB] Fetching SIM card by ID', { simCard_id })

      const simCard = await this.repository.findOne({
        where: { simCard_id },
        relations: relations || {},
      })

      if (!simCard) {
        logger.debug('[DB] SIM card not found', { simCard_id })
      }

      return simCard || null
    } catch (err) {
      logger.error('[DB] Database error fetching SIM card by ID:', err)
      throw err
    }
  }

  /**
   * Get SIM card by SIM number
   * @param simNumber - SIM card number
   * @param relations - Optional relations to load (customer, device)
   * @returns SIM card entity or null if not found
   */
  async getSimCardByNumber(
    simNumber: string,
    relations?: FindOptionsRelations<SimCards>,
  ): Promise<SimCards | null> {
    try {
      logger.debug('[DB] Fetching SIM card by number', { simNumber })

      const simCard = await this.repository.findOne({
        where: { simNumber },
        relations: relations || {},
      })

      if (!simCard) {
        logger.debug('[DB] SIM card not found by number', { simNumber })
      }

      return simCard || null
    } catch (err) {
      logger.error('[DB] Database error fetching SIM card by number:', err)
      throw err
    }
  }

  /**
   * Get all SIM cards for a specific customer
   * @param customer_id - Customer ID
   * @param offset - Offset for pagination (optional)
   * @param relations - Optional relations to load (device)
   * @returns SIM cards list with total count
   */
  async getSimCardsByCustomerId(
    customer_id: number,
    offset?: number,
    relations?: FindOptionsRelations<SimCards>,
  ): Promise<{ simCards: SimCards[]; total: number }> {
    try {
      logger.debug('[DB] Fetching SIM cards by customer ID', { customer_id, offset, limit })

      const [simCards, total] = await this.repository.findAndCount({
        where: { customer_id },
        skip: offset || 0,
        take: limit,
        order: { created_at: 'DESC' },
        relations: relations || {},
      })

      logger.debug('[DB] SIM cards fetched for customer', {
        customer_id,
        count: simCards.length,
        total,
      })

      return { simCards, total }
    } catch (err) {
      logger.error('[DB] Database error fetching SIM cards by customer ID:', err)
      throw err
    }
  }

  /**
   * Get SIM card by device ID (one-to-one relationship)
   * @param device_id - Device ID
   * @param relations - Optional relations to load (customer)
   * @returns SIM card entity or null if not found
   */
  async getSimCardByDeviceId(
    device_id: number,
    relations?: FindOptionsRelations<SimCards>,
  ): Promise<SimCards | null> {
    try {
      logger.debug('[DB] Fetching SIM card by device ID', { device_id })

      const simCard = await this.repository.findOne({
        where: { device_id },
        relations: relations || {},
      })

      if (!simCard) {
        logger.debug('[DB] SIM card not found for device', { device_id })
      }

      return simCard || null
    } catch (err) {
      logger.error('[DB] Database error fetching SIM card by device ID:', err)
      throw err
    }
  }

  /**
   * Update SIM card
   * @param simCard_id - SIM card ID to update
   * @param updateData - Partial SIM card data to update
   * @returns Updated SIM card entity
   * @throws Error if SIM card not found (404)
   */
  async updateSimCard(
    simCard_id: string,
    updateData: Partial<SimCards>,
  ): Promise<SimCards> {
    try {
      logger.debug('[DB] Updating SIM card in database', { simCard_id })

      // Prevent updating critical fields
      const { simCard_id: id, customer_id, device_id, simNumber, ...safeData } = updateData

      // Update with new updated_at timestamp
      await this.repository.update(simCard_id, {
        ...safeData,
        updated_at: new Date(),
      })

      const updatedSimCard = await this.getSimCardById(simCard_id)

      if (!updatedSimCard) {
        logger.warn('[DB] SIM card not found for update', { simCard_id })
        throw { status: 404, message: 'SIM card not found' }
      }

      logger.debug('[DB] SIM card updated successfully', { simCard_id })
      return updatedSimCard
    } catch (err) {
      logger.error('[DB] Database error updating SIM card:', err)
      throw err
    }
  }

  /**
   * Update only plan end date for a SIM card
   * @param simCard_id - SIM card ID
   * @param planEndDate - New plan end date
   * @returns Updated SIM card entity
   */
  async updatePlanEndDate(simCard_id: string, planEndDate: Date): Promise<SimCards> {
    try {
      logger.debug('[DB] Updating plan end date for SIM card', {
        simCard_id,
        planEndDate,
      })

      await this.repository.update(simCard_id, {
        planEndDate,
        updated_at: new Date(),
      })

      const updatedSimCard = await this.getSimCardById(simCard_id)

      if (!updatedSimCard) {
        throw { status: 404, message: 'SIM card not found' }
      }

      logger.debug('[DB] Plan end date updated successfully', { simCard_id })
      return updatedSimCard
    } catch (err) {
      logger.error('[DB] Database error updating plan end date:', err)
      throw err
    }
  }

  /**
   * Delete (hard delete) SIM card
   * @param simCard_id - SIM card ID to delete
   * @returns Deleted SIM card entity
   * @throws Error if SIM card not found (404)
   */
  async deleteSimCard(simCard_id: string): Promise<SimCards> {
    try {
      logger.debug('[DB] Deleting SIM card from database', { simCard_id })

      const simCard = await this.getSimCardById(simCard_id)
      if (!simCard) {
        logger.warn('[DB] SIM card not found for deletion', { simCard_id })
        throw { status: 404, message: 'SIM card not found' }
      }

      await this.repository.remove(simCard)

      logger.debug('[DB] SIM card deleted successfully', { simCard_id })
      return simCard
    } catch (err) {
      logger.error('[DB] Database error deleting SIM card:', err)
      throw err
    }
  }

  /**
   * Check if SIM card exists by ID
   * @param simCard_id - SIM card ID
   * @returns true if SIM card exists, false otherwise
   */
  async doesSimCardExist(simCard_id: string): Promise<boolean> {
    try {
      const result = await this.repository.findOne({
        where: { simCard_id },
        select: ['simCard_id'],
      })
      return !!result
    } catch (err) {
      logger.error('[DB] Database error checking if SIM card exists:', err)
      throw err
    }
  }

  /**
   * Check if SIM number is unique (doesn't exist in database)
   * @param simNumber - SIM card number
   * @param excludeSimCardId - Optional SIM card ID to exclude from check (for updates)
   * @returns true if SIM number is unique, false if already exists
   */
  async isSimNumberUnique(
    simNumber: string,
    excludeSimCardId?: string,
  ): Promise<boolean> {
    try {
      logger.debug('[DB] Checking if SIM number is unique', { simNumber })

      const existingSimCard = await this.repository.findOne({
        where: { simNumber },
      })

      if (!existingSimCard) {
        return true
      }

      // If excluding a SIM card and it's the same one, it's unique for update
      if (excludeSimCardId && existingSimCard.simCard_id === excludeSimCardId) {
        return true
      }

      return false
    } catch (err) {
      logger.error('[DB] Database error checking SIM number uniqueness:', err)
      throw err
    }
  }

  /**
   * Find existing SIM card by unique fields
   * Used to check for duplicates before creating/updating
   * Executes queries in parallel for better performance
   * 
   * @param criteria - Search criteria with optional simCard_id to exclude from search
   * @returns SIM card if found, null otherwise
   */
  async findExistingSimCard(criteria: {
    simCard_id?: string
    simNumber?: string
    device_id?: string
    customer_id?: number
  }): Promise<SimCards | null> {
    try {
      logger.debug('[DB] Searching for existing SIM card', { criteria })

      // Execute all unique field queries in parallel
      const [simCardByNumber, simCardByDevice] = await Promise.all([
        criteria.simNumber
          ? this.repository.findOne({ where: { simNumber: criteria.simNumber } })
          : Promise.resolve(null),
        criteria.device_id
          ? this.repository.findOne({ where: { device_id: parseInt(criteria.device_id, 10) } })
          : Promise.resolve(null),
      ])

      // Get first match (SIM number has priority over device_id)
      const simCard = simCardByNumber || simCardByDevice

      // Filter out if it's the same SIM card being updated
      if (simCard && criteria.simCard_id && simCard.simCard_id === criteria.simCard_id) {
        return null
      }

      if (simCard) {
        logger.debug('[DB] Found existing SIM card with matching criteria', {
          found_id: simCard.simCard_id,
          matchedBy: simCardByNumber ? 'simNumber' : 'device_id',
        })
      }

      return simCard
    } catch (err) {
      logger.error('[DB] Database error searching for SIM card:', err)
      throw err
    }
  }

  /**
   * Get all SIM cards (without pagination) - use with caution!
   * @param relations - Optional relations to load
   * @returns All SIM cards
   */
  async getAllSimCards(relations?: FindOptionsRelations<SimCards>): Promise<SimCards[]> {
    try {
      logger.debug('[DB] Fetching all SIM cards')

      return await this.repository.find({
        order: { created_at: 'DESC' },
        relations: relations || {},
      })
    } catch (err) {
      logger.error('[DB] Database error fetching all SIM cards:', err)
      throw err
    }
  }

  /**
   * Get SIM cards by multiple IDs
   * @param simCard_ids - Array of SIM card IDs
   * @param relations - Optional relations to load
   * @returns Array of SIM cards
   */
  async getSimCardsByIds(
    simCard_ids: string[],
    relations?: FindOptionsRelations<SimCards>,
  ): Promise<SimCards[]> {
    try {
      logger.debug('[DB] Fetching SIM cards by IDs', { count: simCard_ids.length })

      return await this.repository.find({
        where: { simCard_id: In(simCard_ids) },
        order: { created_at: 'DESC' },
        relations: relations || {},
      })
    } catch (err) {
      logger.error('[DB] Database error fetching SIM cards by IDs:', err)
      throw err
    }
  }

  /**
   * Count total SIM cards
   * @returns Total SIM card count
   */
  async countSimCards(): Promise<number> {
    try {
      return await this.repository.count()
    } catch (err) {
      logger.error('[DB] Database error counting SIM cards:', err)
      throw err
    }
  }

  /**
   * Count SIM cards for a specific customer
   * @param customer_id - Customer ID
   * @returns Total SIM cards count for customer
   */
  async countSimCardsByCustomerId(customer_id: number): Promise<number> {
    try {
      logger.debug('[DB] Counting SIM cards for customer', { customer_id })

      return await this.repository.count({
        where: { customer_id },
      })
    } catch (err) {
      logger.error('[DB] Database error counting SIM cards for customer:', err)
      throw err
    }
  }

  /**
   * Get SIM cards expiring soon (plan end date within specified days)
   * @param daysFromNow - Number of days to check ahead (default: 30)
   * @param offset - Pagination offset
   * @returns SIM cards expiring soon with total count
   */
  async getExpiringSimCards(
    daysFromNow: number = 30,
    offset?: number,
    relations?: FindOptionsRelations<SimCards>,
  ): Promise<{ simCards: SimCards[]; total: number }> {
    try {
      logger.debug('[DB] Fetching SIM cards expiring soon', {
        daysFromNow,
        offset,
      })

      const now = new Date()
      const futureDate = new Date(now.getTime() + daysFromNow * 24 * 60 * 60 * 1000)

      const [simCards, total] = await this.repository.findAndCount({
        where: {
          planEndDate: Between(now, futureDate),
        },
        skip: offset || 0,
        take: limit,
        order: { planEndDate: 'ASC' },
        relations: relations || {},
      })

      logger.debug('[DB] Fetched expiring SIM cards', {
        count: simCards.length,
        total,
      })

      return { simCards, total }
    } catch (err) {
      logger.error('[DB] Database error fetching expiring SIM cards:', err)
      throw err
    }
  }

  /**
   * Get SIM cards received within a date range
   * @param startDate - Start date
   * @param endDate - End date
   * @param offset - Pagination offset
   * @param relations - Optional relations to load
   * @returns SIM cards received within date range with total count
   */
  async getSimCardsByDateRange(
    startDate: Date,
    endDate: Date,
    offset?: number,
    relations?: FindOptionsRelations<SimCards>,
  ): Promise<{ simCards: SimCards[]; total: number }> {
    try {
      if (startDate > endDate) {
        throw { status: 400, message: 'startDate must be before endDate' }
      }

      logger.debug('[DB] Fetching SIM cards by date range', { startDate, endDate })

      const [simCards, total] = await this.repository.findAndCount({
        where: {
          receivedAt: Between(startDate, endDate),
        },
        skip: offset || 0,
        take: limit,
        order: { receivedAt: 'DESC' },
        relations: relations || {},
      })

      logger.debug('[DB] Fetched SIM cards by date range', {
        count: simCards.length,
        total,
      })

      return { simCards, total }
    } catch (err) {
      logger.error('[DB] Database error fetching SIM cards by date range:', err)
      throw err
    }
  }

  /**
   * Find SIM cards by filter criteria with pagination
   * @param filter - SIM card filter criteria
   * @param offset - Pagination offset
   * @param relations - Optional relations to load
   * @returns SIM cards matching criteria with total count
   */
  async find(
    filter?: Partial<SimCards>,
    offset?: number,
    relations?: FindOptionsRelations<SimCards>,
  ): Promise<{ simCards: SimCards[]; total: number }> {
    try {
      if (offset !== undefined && (offset < 0 || !Number.isInteger(offset))) {
        throw { status: 400, message: 'Invalid offset parameter' }
      }

      // Remove null/undefined values from filter
      const where = filter
        ? Object.fromEntries(Object.entries(filter).filter(([_, v]) => v != null))
        : undefined

      const [simCards, total] = await this.repository.findAndCount({
        where: where,
        skip: offset || 0,
        take: limit,
        order: { created_at: 'DESC' },
        relations: relations || {},
      })

      logger.debug('[DB] Find SIM cards completed', {
        found: simCards.length,
        total,
      })

      return { simCards, total }
    } catch (err) {
      logger.error('[DB] Database error finding SIM cards:', err)
      throw err
    }
  }
}

// Export singleton instance
export const simCardRepository = new SimCardRepository()
