import { HttpError, User } from '../model'
import getDbConnection from './connection'
const limit = Number(process.env.LIMIT) || 10

const createUser = async (user: User.Model) => {
  const knex = getDbConnection()
  try {
    const [newUser] = await knex('yaazoru.users')
      .insert({
        first_name: user.first_name,
        last_name: user.last_name,
        id_number: user.id_number,
        phone_number: user.phone_number,
        additional_phone: user.additional_phone,
        email: user.email,
        city: user.city,
        address1: user.address1,
        address2: user.address2,
        zipCode: user.zipCode,
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

const findUser = async (criteria: {
  user_id?: string
  email?: string
  id_number?: string
  password?: string
  user_name?: string
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

export { createUser, getUsers, getUserById, updateUser, deleteUser, findUser, doesUserExist }
