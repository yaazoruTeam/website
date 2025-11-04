import { HttpError, User } from '@model'
import getDbConnection from '@db/connection'
import config from '@config/index'
import logger from '@utils/logger'
const limit = config.database.limit

const createUser = async (user: User.Model) => {
  const knex = getDbConnection()
  try {
    const [newUser] = await knex('yaazoru.users')
      .insert({
        first_name: user.first_name,
        last_name: user.last_name,
        id_number: user.id_number,
        phone_number: user.phone_number,
        email: user.email,
        city: user.city,
        address: user.address,
        password: user.password,
        user_name: user.user_name,
        role: user.role,
      })
      .returning('*')
    return newUser
  } catch (err) {
    throw err
  }
}

const getUsers = async (offset: number): Promise<{ users: User.Model[]; total: number }> => {
  const knex = getDbConnection()
  try {
    const users = await knex('yaazoru.users')
      .select('*')
      .orderBy('user_id')
      .limit(limit)
      .offset(offset)

    const [{ count }] = await knex('yaazoru.users').count('*')
    return {
      users,
      total: parseInt(count as string, 10),
    }
  } catch (err) {
    throw err
  }
}

const getUserById = async (user_id: string) => {
  const knex = getDbConnection()
  try {
    return await knex('yaazoru.users').where({ user_id }).first()
  } catch (err) {
    throw err
  }
}

const updateUser = async (user_id: string, user: User.Model) => {
  const knex = getDbConnection()
  try {
    const updateUser = await knex('yaazoru.users').where({ user_id }).update(user).returning('*')
    if (updateUser.length === 0) {
      throw { status: 404, message: 'user not found' }
    }
    return updateUser[0]
  } catch (err) {
    throw err
  }
}

const deleteUser = async (user_id: string) => {
  const knex = getDbConnection()
  try {
    const updateUser = await knex('yaazoru.users')
      .where({ user_id })
      .update({ status: 'inactive' })
      .returning('*')
    if (updateUser.length === 0) {
      const error: HttpError.Model = {
        status: 404,
        message: 'User not found',
      }
      throw error
    }
    return updateUser[0]
  } catch (err) {
    throw err
  }
}

// Partial update function for Google Auth fields
const updateUserPartial = async (user_id: number | undefined, partialUser: Partial<User.Model>) => {
  const knex = getDbConnection()
  
  // Define allowed fields for partial updates
  const allowedFields = [
    'user_name',
    'google_uid',
    'photo_url',
    'email_verified',
    'updated_at'
  ];
  
  // Define critical fields that require additional validation
  const criticalFields = ['role', 'status', 'email', 'password'];
  
  try {
    // Validate and sanitize the input
    const sanitizedUpdate: Record<string, any> = {};
    
    for (const [key, value] of Object.entries(partialUser)) {
      // Check if field is allowed for partial updates
      if (!allowedFields.includes(key)) {
        if (criticalFields.includes(key)) {
          logger.warn(`Attempted to update critical field '${key}' via partial update for user ${user_id}`);
          const error: HttpError.Model = {
            status: 403,
            message: `Field '${key}' cannot be updated via partial update for security reasons`,
          }
          throw error;
        } else {
          logger.warn(`Attempted to update unauthorized field '${key}' for user ${user_id}`);
          continue; // Skip unauthorized fields
        }
      }
      
      // Validate specific field types and constraints
      switch (key) {
        case 'user_name':
          if (typeof value !== 'string' || value.trim().length === 0) {
            logger.warn(`Invalid user_name provided for user ${user_id}`);
            continue;
          }
          sanitizedUpdate[key] = value.trim();
          break;
          
        case 'google_uid':
          if (typeof value !== 'string' || value.trim().length === 0) {
            logger.warn(`Invalid google_uid provided for user ${user_id}`);
            continue;
          }
          sanitizedUpdate[key] = value.trim();
          break;
          
        case 'photo_url':
          if (value !== null && value !== undefined) {
            if (typeof value !== 'string') {
              logger.warn(`Invalid photo_url type provided for user ${user_id}`);
              continue;
            }
            // Basic URL validation
            try {
              new URL(value);
              sanitizedUpdate[key] = value;
            } catch {
              logger.warn(`Invalid photo_url format provided for user ${user_id}`);
              continue;
            }
          } else {
            sanitizedUpdate[key] = value;
          }
          break;
          
        case 'email_verified':
          if (typeof value !== 'boolean') {
            logger.warn(`Invalid email_verified type provided for user ${user_id}`);
            continue;
          }
          sanitizedUpdate[key] = value;
          break;
          
        case 'updated_at':
          // Auto-set updated_at to current timestamp
          sanitizedUpdate[key] = new Date();
          break;
          
        default:
          sanitizedUpdate[key] = value;
      }
    }
    
    // If no valid fields to update, return the current user
    if (Object.keys(sanitizedUpdate).length === 0) {
      logger.info(`No valid fields to update for user ${user_id}`);
      const currentUser = await knex('yaazoru.users').where({ user_id }).first();
      if (!currentUser) {
        const error: HttpError.Model = {
          status: 404,
          message: 'User not found',
        }
        throw error;
      }
      return currentUser;
    }
    
    // Always update the updated_at timestamp
    sanitizedUpdate.updated_at = new Date();
    
    const updatedUser = await knex('yaazoru.users')
      .where({ user_id })
      .update(sanitizedUpdate)
      .returning('*')
    
    if (updatedUser.length === 0) {
      const error: HttpError.Model = {
        status: 404,
        message: 'User not found',
      }
      throw error
    }
    
    return updatedUser[0]
  } catch (err) {
    throw err
  }
}

const findUser = async (criteria: {
  user_id?: string
  email?: string
  id_number?: string
  password?: string
  user_name?: string
  google_uid?: string
}) => {
  const knex = getDbConnection()
  try {
    return await knex('yaazoru.users')
      .where(function () {
        if (criteria.email) {
          this.orWhere({ email: criteria.email })
        }
        if (criteria.id_number) {
          this.orWhere({ id_number: criteria.id_number })
        }
        if (criteria.google_uid) {
          this.orWhere({ google_uid: criteria.google_uid })
        }
        if (criteria.password) {
          this.orWhere({ password: criteria.password })
        }
        if (criteria.user_name) {
          this.orWhere({ user_name: criteria.user_name })
        }
      })
      .andWhere(function () {
        if (criteria.user_id) {
          this.whereNot({ user_id: criteria.user_id })
        }
      })
      .first()
  } catch (err) {
    throw err
  }
}

const doesUserExist = async (user_id: string): Promise<boolean> => {
  const knex = getDbConnection()
  try {
    const result = await knex('yaazoru.users').select('user_id').where({ user_id }).first()
    return !!result
  } catch (err) {
    throw err
  }
}

export { createUser, getUsers, getUserById, updateUser, updateUserPartial, deleteUser, findUser, doesUserExist }
