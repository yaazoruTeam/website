import { Knex } from 'knex'
import logger from '@/src/utils/logger'
import getDbConnection from '@db/connection'

const createBranchUserSchema = async () => {
  logger.debug('create branchUser schema')

  const knex = getDbConnection()
  try {
    const tableExists = await knex.schema.withSchema('yaazoru').hasTable('branchUser')
    if (!tableExists) {
      logger.debug('Creating branchUser table...')
      await knex.schema
        .withSchema('yaazoru')
        .createTable('branchUser', (table: Knex.TableBuilder) => {
          table.increments('branchUser_id').primary()
          table.string('branch_id').notNullable()
          table.string('user_id').notNullable()
        })
      logger.debug('branchUser table created successfully.')
    } else {
      logger.debug('branchUser table already exists. Skipping creation.')
    }
  } catch (err) {
    logger.error('error creat schema branchUser', err)
  }
}

export { createBranchUserSchema }
