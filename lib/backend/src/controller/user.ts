import { NextFunction, Request, Response } from 'express'
import { User, HttpError } from '@model'
import { hashPassword } from '@utils/password'
import config from '@config/index'
import { handleError } from './err'
import { userRepository } from '@repositories/UserRepository'
import logger from '../utils/logger'

const limit = config.database.limit

const createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    logger.http('POST /users', { body: req.body })

    User.sanitizeBodyExisting(req)
    const userData = req.body
    const sanitized = User.sanitize(userData, false)

    logger.debug('Checking for existing user', { email: sanitized.email, id_number: sanitized.id_number, user_name: sanitized.user_name })
    await existingUser(sanitized, false)

    sanitized.password = await hashPassword(sanitized.password)
    
    // Convert User.Model to Partial<User> (TypeORM entity)
    const userEntity = await userRepository.createUser({
      first_name: sanitized.first_name,
      last_name: sanitized.last_name,
      id_number: sanitized.id_number,
      phone_number: sanitized.phone_number,
      additional_phone: sanitized.additional_phone || null,
      email: sanitized.email,
      city: sanitized.city,
      address: sanitized.address,
      password: sanitized.password,
      user_name: sanitized.user_name,
      role: (sanitized.role as any) || 'branch',
    })

    logger.info('User created successfully', { user_id: userEntity.user_id })
    res.status(201).json(userEntity)
  } catch (error: unknown) {
    logger.error('Error in createUser', { error: error instanceof Error ? error.message : String(error) })
    handleError(error, next)
  }
}

const getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1
    const offset = (page - 1) * limit

    logger.debug('getUsers called', { page, offset })

    const { users, total } = await userRepository.getUsers(offset)

    logger.info('getUsers success', { count: users.length, total })
    res.status(200).json({
      data: users,
      page,
      totalPages: Math.ceil(total / limit),
      total,
    })
  } catch (error: unknown) {
    logger.error('Error in getUsers', { error: error instanceof Error ? error.message : String(error) })
    handleError(error, next)
  }
}

const getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    logger.debug('getUserById called', { id: req.params.id })

    User.sanitizeIdExisting(req)
    const numericId = parseInt(req.params.id)
    
    const user = await userRepository.getUserById(numericId)
    if (!user) {
      logger.warn('User not found', { id: req.params.id })
      const error: HttpError.Model = {
        status: 404,
        message: 'User does not exist.',
      }
      throw error
    }

    logger.info('getUserById success', { id: req.params.id })
    res.status(200).json(user)
  } catch (error: unknown) {
    logger.error('Error in getUserById', { id: req.params.id, error: error instanceof Error ? error.message : String(error) })
    handleError(error, next)
  }
}

const updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    logger.debug('updateUser called', { id: req.params.id })

    User.sanitizeIdExisting(req)
    User.sanitizeBodyExisting(req)
    const userData = req.body
    if (userData.password) {
      userData.password = await hashPassword(userData.password)
    }
    const sanitized = User.sanitize(userData, true)
    await existingUser(sanitized, true)

    const numericId = parseInt(req.params.id)
    
    // Convert User.Model to Partial<User> (TypeORM entity)
    const updateData = await userRepository.updateUser(numericId, {
      first_name: sanitized.first_name,
      last_name: sanitized.last_name,
      phone_number: sanitized.phone_number,
      additional_phone: sanitized.additional_phone || null,
      email: sanitized.email,
      city: sanitized.city,
      address: sanitized.address,
      password: sanitized.password,
      user_name: sanitized.user_name,
      role: (sanitized.role as any) || 'branch',
    })

    logger.info('User updated successfully', { id: req.params.id })
    res.status(200).json(updateData)
  } catch (error: unknown) {
    logger.error('Error in updateUser', { id: req.params.id, error: error instanceof Error ? error.message : String(error) })
    handleError(error, next)
  }
}

const deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    logger.debug('deleteUser called', { id: req.params.id })

    User.sanitizeIdExisting(req)
    const numericId = parseInt(req.params.id)
    
    // Repository handles the 404 check internally
    const deletedUser = await userRepository.deleteUser(numericId)

    logger.info('User deleted successfully', { id: req.params.id })
    res.status(200).json(deletedUser)
  } catch (error: unknown) {
    logger.error('Error in deleteUser', { id: req.params.id, error: error instanceof Error ? error.message : String(error) })
    handleError(error, next)
  }
}

const existingUser = async (user: User.Model, hasId: boolean) => {
  logger.debug('Checking for existing user', {
    hasId,
    email: user.email,
    id_number: user.id_number,
    phone_number: user.phone_number,
    user_name: user.user_name,
    user_id: hasId ? user.user_id : 0
  })

  let userEx
  if (hasId) {
    // UPDATE: משדרים את user_id כדי לא להזריק שגיאה על אותו ה-row
    // בודקים את כל ה-UNIQUE fields: email, id_number, phone_number, user_name
    userEx = await userRepository.findExistingUser({
      user_id: typeof user.user_id === 'string' ? parseInt(user.user_id) : user.user_id,
      email: user.email,
      id_number: user.id_number,
      phone_number: user.phone_number,
      user_name: user.user_name,
    })
  } else {
    // CREATE: לא משדרים user_id (עדיין אין)
    // בודקים את כל ה-UNIQUE fields: email, id_number, phone_number, user_name
    userEx = await userRepository.findExistingUser({
      email: user.email,
      id_number: user.id_number,
      phone_number: user.phone_number,
      user_name: user.user_name,
    })
  }

  if (userEx) {
    logger.warn('Found conflicting user', {
      existing_id: userEx.user_id,
      conflict_field: userEx.email === user.email ? 'email' : userEx.id_number === user.id_number ? 'id_number' : userEx.phone_number === user.phone_number ? 'phone_number' : 'user_name'
    })
    // Convert TypeORM entity to User.Model interface
    const userExModel: User.Model = {
      ...userEx,
      user_id: String(userEx.user_id),
      additional_phone: userEx.additional_phone || '',
    }
    User.sanitizeExistingUser(userExModel, user)
  } else {
    logger.debug('No existing user conflicts found')
  }
}

export { createUser, getUsers, getUserById, updateUser, deleteUser }
