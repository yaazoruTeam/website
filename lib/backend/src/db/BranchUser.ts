import { BranchUser } from '@model'
import getDbConnection from './connection'
import config from '@/config'

const limit = config.database.limit

const createBranchUser = async (branchUser: BranchUser.Model) => {
  const knex = getDbConnection()
  try {
    const [newBranchUser] = await knex('yaazoru.branchUser')
      .insert({
        branch_id: branchUser.branch_id,
        user_id: branchUser.user_id,
      })
      .returning('*')
    return newBranchUser
  } catch (err) {
    throw err
  }
}

const getAllBranchUser = async (
  offset: number,
): Promise<{ branchUsers: BranchUser.Model[]; total: number }> => {
  const knex = getDbConnection()
  try {
    const branchUsers = await knex('yaazoru.branchUser')
      .select('*')
      .orderBy('branchUser_id')
      .limit(limit)
      .offset(offset)

    const [{ count }] = await knex('yaazoru.branchUser').count('*')
    return {
      branchUsers,
      total: parseInt(count as string, 10),
    }
  } catch (err) {
    throw err
  }
}

const getBranchUserById = async (branchUser_id: string) => {
  const knex = getDbConnection()
  try {
    return await knex('yaazoru.branchUser').where({ branchUser_id }).first()
  } catch (err) {
    throw err
  }
}

const getBranchUserByBranch_id = async (
  branch_id: string,
  offset: number,
): Promise<{ branchUsers: BranchUser.Model[]; total: number }> => {
  const knex = getDbConnection()
  try {
    const branchUsers = await knex('yaazoru.branchUser')
      .select('*')
      .where({ branch_id })
      .orderBy('branchUser_id')
      .limit(limit)
      .offset(offset)

    const [{ count }] = await knex('yaazoru.branchUser').where({ branch_id }).count('*')

    return {
      branchUsers,
      total: parseInt(count as string, 10),
    }
  } catch (err) {
    throw err
  }
}

const getBranchUserByUser_id = async (
  user_id: string,
  offset: number,
): Promise<{ branchUsers: BranchUser.Model[]; total: number }> => {
  const knex = getDbConnection()
  try {
    const branchUsers = await knex('yaazoru.branchUser')
      .select('*')
      .where({ user_id })
      .orderBy('branchUser_id')
      .limit(limit)
      .offset(offset)

    const [{ count }] = await knex('yaazoru.branchUser').where({ user_id }).count('*')

    return {
      branchUsers,
      total: parseInt(count as string, 10),
    }
  } catch (err) {
    throw err
  }
}

const updateBranchUser = async (branchUser_id: string, branchUser: BranchUser.Model) => {
  const knex = getDbConnection()
  try {
    const updateBranchUser = await knex('yaazoru.branchUser')
      .where({ branchUser_id })
      .update(branchUser)
      .returning('*')
    if (updateBranchUser.length === 0) {
      throw { status: 404, message: 'branchUser not found' }
    }
    return updateBranchUser[0]
  } catch (err) {
    throw err
  }
}

const deleteBranchUser = async (branchUser_id: string) => {
  const knex = getDbConnection()
  try {
    const deleteBranchUser = await knex('yaazoru.branchUser')
      .where({ branchUser_id })
      .del()
      .returning('*')
    if (deleteBranchUser.length === 0) {
      throw { status: 404, message: 'BranchUser not found' }
    }
    return deleteBranchUser[0]
  } catch (err) {
    throw err
  }
}

const doesBranchUserExist = async (branchUser_id: string): Promise<boolean> => {
  const knex = getDbConnection()
  try {
    const result = await knex('yaazoru.branchUser')
      .select('branchUser_id')
      .where({ branchUser_id })
      .first()
    return !!result
  } catch (err) {
    throw err
  }
}

const doesBranchExist = async (branch_id: string): Promise<boolean> => {
  const knex = getDbConnection()
  try {
    const result = await knex('yaazoru.branchUser').select('branch_id').where({ branch_id }).first()
    return !!result
  } catch (err) {
    throw err
  }
}

const doesUserExist = async (user_id: string): Promise<boolean> => {
  const knex = getDbConnection()
  try {
    const result = await knex('yaazoru.branchUser').select('user_id').where({ user_id }).first()
    return !!result
  } catch (err) {
    throw err
  }
}

const doesBranchUserCombinationExist = async (
  branch_id: string,
  user_id: string,
): Promise<boolean> => {
  const knex = getDbConnection()
  try {
    const result = await knex('yaazoru.branchUser')
      .select('branch_id', 'user_id')
      .where({ branch_id, user_id })
      .first()
    return !!result
  } catch (err) {
    throw err
  }
}

export {
  createBranchUser,
  getAllBranchUser,
  getBranchUserById,
  getBranchUserByBranch_id,
  getBranchUserByUser_id,
  updateBranchUser,
  deleteBranchUser,
  doesBranchUserExist,
  doesBranchExist,
  doesUserExist,
  doesBranchUserCombinationExist,
}
