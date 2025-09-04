import logger from '@/src/utils/logger'
import getDbConnection from '@db/connection'
import { Knex } from 'knex'

const createBranchSchema = async () => {
  logger.debug('create branch schema')

  const knex = getDbConnection()
  try {
    const tableExists = await knex.schema.withSchema('yaazoru').hasTable('branches')
    if (!tableExists) {
      logger.debug('Creating branch table...')
      await knex.schema
        .withSchema('yaazoru')
        .createTable('branches', (table: Knex.TableBuilder) => {
          table.increments('branch_id').primary()
          table.string('city', 20).notNullable()
          table.string('address', 20).notNullable()
          table.string('manager_name', 20).notNullable()
          table.string('phone_number', 20).notNullable()
          table.string('additional_phone', 20).nullable()
          table.enum('status', ['active', 'inactive']).notNullable().defaultTo('active')
        })
      logger.debug('branch table created successfully.')
    } else {
      logger.debug('branch table already exists. Skipping creation.')
    }
  } catch (err) {
    logger.error('error creat schema branch', err)
  }
}

export { createBranchSchema }
