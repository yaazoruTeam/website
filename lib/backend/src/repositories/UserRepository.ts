import { Repository, ILike, Not, IsNull } from 'typeorm'
import { AppDataSource } from '../data-source'
import { User, UserRole, UserStatus } from '../entities/User'
import logger from '../utils/logger'
import config from '../config/index'

const limit = config.database.limit

/**
 * UserRepository - Handles all database operations for users
 * Replaces the old knex-based db/User.ts
 * Uses TypeORM for database operations with proper error handling and logging
 */
export class UserRepository {
  private repository: Repository<User>

  constructor() {
    this.repository = AppDataSource.getRepository(User)
  }

  /**
   * Create a new user
   */
  async createUser(userData: Partial<User>): Promise<User> {
    try {
      logger.debug('[DB] Creating user in database', { email: userData.email, user_name: userData.user_name })

      const user = this.repository.create(userData)
      const savedUser = await this.repository.save(user)

      logger.debug('[DB] User created successfully', { user_id: savedUser.user_id })
      return savedUser
    } catch (err) {
      logger.error('[DB] Database error creating user:', err)
      throw err
    }
  }

  /**
   * Get all users with pagination (offset-based)
   */
  async getUsers(offset: number): Promise<{ users: User[]; total: number }> {
    try {
      logger.debug('[DB] Fetching users from database', { offset, limit })

      const [users, total] = await this.repository.findAndCount({
        skip: offset,
        take: limit,
        order: { user_id: 'ASC' },
      })

      logger.debug('[DB] Users fetched successfully', { count: users.length, total })
      return { users, total }
    } catch (err) {
      logger.error('[DB] Database error fetching users:', err)
      throw err
    }
  }

  /**
   * Get user by ID
   * Returns null if user doesn't exist (READ operation)
   */
  async getUserById(user_id: number): Promise<User | null> {
    try {
      logger.debug('[DB] Fetching user by ID', { user_id })

      const user = await this.repository.findOne({
        where: { user_id },
      })

      if (!user) {
        logger.debug('[DB] User not found', { user_id })
      }

      return user || null
    } catch (err) {
      logger.error('[DB] Database error fetching user by ID:', err)
      throw err
    }
  }

  /**
   * Check if user exists
   * Returns boolean instead of throwing error
   */
  async doesUserExist(user_id: number): Promise<boolean> {
    try {
      logger.debug('[DB] Checking if user exists', { user_id })

      const result = await this.repository.findOne({
        where: { user_id },
        select: ['user_id'],
      })

      return !!result
    } catch (err) {
      logger.error('[DB] Database error checking if user exists:', err)
      throw err
    }
  }

  /**
   * Update user
   */
  async updateUser(user_id: number, updateData: Partial<User>): Promise<User> {
    try {
      logger.debug('[DB] Updating user in database', { user_id })

      // Update with new updated_at timestamp
      await this.repository.update(user_id, {
        ...updateData,
        updated_at: new Date(),
      })

      const updatedUser: User | null = await this.getUserById(user_id)

      if (!updatedUser) {
        logger.warn('[DB] User not found for update', { user_id })
        throw { status: 404, message: 'User not found' }
      }

      logger.debug('[DB] User updated successfully', { user_id })
      return updatedUser
    } catch (err) {
      logger.error('[DB] Database error updating user:', err)
      throw err
    }
  }

  /**
   * Soft delete user (mark as inactive)
   */
  async deleteUser(user_id: number): Promise<User> {
    try {
      logger.debug('[DB] Soft deleting user (marking inactive)', { user_id })

      const user: User | null = await this.getUserById(user_id)
      if (!user) {
        logger.warn('[DB] User not found for deletion', { user_id })
        throw { status: 404, message: 'User not found' }
      }

      // Soft delete - just mark as inactive
      user.status = UserStatus.INACTIVE
      const deletedUser = await this.repository.save(user)

      logger.debug('[DB] User soft deleted successfully', { user_id })
      return deletedUser
    } catch (err) {
      logger.error('[DB] Database error deleting user:', err)
      throw err
    }
  }

  /**
   * Find existing user by email, id_number, user_name, or phone_number
   * Used to check for duplicates before creating/updating
   * Executes queries in parallel for better performance
   * 
   * Important: This checks ALL UNIQUE fields to prevent constraint violations
   */
  async findExistingUser(criteria: {
    user_id?: number
    email?: string
    id_number?: string
    phone_number?: string
    user_name?: string
  }): Promise<User | null> {
    try {
      logger.debug('[DB] Searching for existing user', { criteria })

      // Execute email, id_number, phone_number, and user_name queries in parallel
      const [userByEmail, userByIdNumber, userByPhoneNumber, userByUserName] = await Promise.all([
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
        criteria.user_name
          ? this.repository.findOne({
              where: { user_name: criteria.user_name },
            })
          : Promise.resolve(null),
      ])

      // Get first match (email, id_number, phone_number, or user_name - in priority order)
      const user = userByEmail || userByIdNumber || userByPhoneNumber || userByUserName

      // Filter out if it's the same user being updated
      if (user && criteria.user_id && user.user_id === criteria.user_id) {
        return null
      }

      if (user) {
        logger.debug('[DB] Found existing user with matching criteria', {
          found_id: user.user_id,
          matchedBy: userByEmail
            ? 'email'
            : userByIdNumber
              ? 'id_number'
              : userByPhoneNumber
                ? 'phone_number'
                : 'user_name',
        })
      }

      return user
    } catch (err) {
      logger.error('[DB] Database error searching for user:', err)
      throw err
    }
  }
}
// Export singleton instance
export const userRepository = new UserRepository()
