import { NextFunction, Request, Response } from 'express'
import * as db from '@db/index'
import { User, HttpError } from '@model'
import { hashPassword } from '@utils/password'
import config from '@config/index'

const limit = config.database.limit

const createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    User.sanitizeBodyExisting(req)
    const userData = req.body
    const sanitized = User.sanitize(userData, false)
    await existingUser(sanitized, false)
    sanitized.password = await hashPassword(sanitized.password)
    const user = await db.User.createUser(sanitized)
    res.status(201).json(user)
  } catch (error: unknown) {
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
  } catch (error: unknown) {
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
  } catch (error: unknown) {
    next(error)
  }
}

const updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    User.sanitizeIdExisting(req)
    User.sanitizeBodyExisting(req)
    const userData = req.body
    if (userData.password) {
      userData.password = await hashPassword(userData.password)
    }
    const sanitized = User.sanitize(userData, true)
    await existingUser(sanitized, true)
    const updateUser = await db.User.updateUser(req.params.id, sanitized)
    res.status(200).json(updateUser)
  } catch (error: unknown) {
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
    const deleteUser = await db.User.deleteUser(req.params.id)
    res.status(200).json(deleteUser)
  } catch (error: unknown) {
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
