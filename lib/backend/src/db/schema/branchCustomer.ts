import logger from '@/src/utils/logger'
import getDbConnection from '@db/connection'
import { Knex } from 'knex'

const createBranchCustomerSchema = async () => {
  logger.info('create branchCustomer schema')

  const knex = getDbConnection()
  try {
    const tableExists = await knex.schema.withSchema('yaazoru').hasTable('branchCustomer')
    if (!tableExists) {
      logger.info('Creating branchCustomer table...')
      await knex.schema
        .withSchema('yaazoru')
        .createTable('branchCustomer', (table: Knex.TableBuilder) => {
          table.increments('branchCustomer_id').primary()
          table.string('branch_id').notNullable()
          table.string('customer_id').notNullable()
        })
      logger.info('branchCustomer table created successfully.')
    } else {
      logger.info('branchCustomer table already exists. Skipping creation.')
    }
  } catch (err) {
    logger.error('error creat schema branchCustomer', err)
  }
}

export { createBranchCustomerSchema }
