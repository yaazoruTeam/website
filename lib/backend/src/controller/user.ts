import { NextFunction, Request, Response } from 'express'
import * as db from '@db/index'
import { User, HttpError } from '@model'
import { hashPassword } from '@utils/password'
import config from '@config/index'
import { AuditService } from '@service/auditService'

const limit = config.database.limit

const createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    User.sanitizeBodyExisting(req)
    const userData = req.body
    const sanitized = User.sanitize(userData, false)
    await existingUser(sanitized, false)
    sanitized.password = await hashPassword(sanitized.password)
    const user = await db.User.createUser(sanitized)
    
    // Create audit log for user creation
    await AuditService.logCreate(req, AuditService.getTableName('users'), user.user_id, {
      ...sanitized,
      password: '[HIDDEN]' // Don't log actual password
    })
    
    res.status(201).json(user)
  } catch (error: any) {
    next(error)
  }
}

const getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1
    const offset = (page - 1) * limit

    const { users, total } = await db.User.getUsers(offset)

    res.status(200).json({
      data: users,
      page,
      totalPages: Math.ceil(total / limit),
      total,
    })
  } catch (error: any) {
    next(error)
  }
}

const getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    User.sanitizeIdExisting(req)
    const existUser = await db.User.doesUserExist(req.params.id)
    if (!existUser) {
      const error: HttpError.Model = {
        status: 404,
        message: 'user does not exist.',
      }
      throw error
    }
    const user = await db.User.getUserById(req.params.id)
    res.status(200).json(user)
  } catch (error: any) {
    next(error)
  }
}

const updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    User.sanitizeIdExisting(req)
    User.sanitizeBodyExisting(req)
    
    // Get existing user data for audit log
    const existingUser = await db.User.getUserById(req.params.id)
    if (!existingUser) {
      const error: HttpError.Model = {
        status: 404,
        message: 'user does not exist.',
      }
      throw error
    }
    
    const userData = req.body
    if (userData.password) {
      userData.password = await hashPassword(userData.password)
    }
    const sanitized = User.sanitize(userData, true)
    await existingUser(sanitized, true)
    const updateUser = await db.User.updateUser(req.params.id, sanitized)
    
    // Create audit log for user update
    await AuditService.logUpdate(
      req, 
      AuditService.getTableName('users'), 
      req.params.id,
      {
        ...existingUser,
        password: '[HIDDEN]' // Don't log actual password
      },
      {
        ...sanitized,
        password: userData.password ? '[HIDDEN]' : existingUser.password
      }
    )
    
    res.status(200).json(updateUser)
  } catch (error: any) {
    next(error)
  }
}

const deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    User.sanitizeIdExisting(req)
    const existuser = await db.User.doesUserExist(req.params.id)
    if (!existuser) {
      const error: HttpError.Model = {
        status: 404,
        message: 'user does not exist.',
      }
      throw error
    }
    
    // Get user data before deletion for audit log
    const userData = await db.User.getUserById(req.params.id)
    
    const deleteUser = await db.User.deleteUser(req.params.id)
    
    // Create audit log for user deletion (soft delete - status change)
    await AuditService.logDelete(
      req, 
      AuditService.getTableName('users'), 
      req.params.id,
      {
        ...userData,
        password: '[HIDDEN]' // Don't log actual password
      }
    )
    
    res.status(200).json(deleteUser)
  } catch (error: any) {
    next(error)
  }
}

const existingUser = async (user: User.Model, hasId: boolean) => {
  try {
    let userEx
    if (hasId) {
      userEx = await db.User.findUser({
        user_id: user.user_id,
        email: user.email,
        id_number: user.id_number,
        password: user.password,
        user_name: user.user_name,
      })
    } else {
      userEx = await db.User.findUser({
        email: user.email,
        id_number: user.id_number,
        password: user.password,
        user_name: user.user_name,
      })
    }
    if (userEx) {
      try {
        User.sanitizeExistingUser(userEx, user)
      } catch (err) {
        throw err
      }
    }
  } catch (err) {
    throw err
  }
}

export { createUser, getUsers, getUserById, updateUser, deleteUser }
