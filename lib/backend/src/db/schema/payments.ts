import logger from '@/src/utils/logger'
import getDbConnection from '@db/connection'
import { Knex } from 'knex'

const createPayments = async () => {
  logger.debug('create payments schema')

  const knex = getDbConnection()
  try {
    const tableExists = await knex.schema.withSchema('yaazoru').hasTable('payments')
    if (!tableExists) {
      logger.debug('Creating payments table...')
      await knex.schema
        .withSchema('yaazoru')
        .createTable('payments', (table: Knex.TableBuilder) => {
          table.increments('payments_id').primary()
          table.string('monthlyPayment_id').notNullable()
          table.integer('amount').notNullable()
          table.date('date').notNullable()
          table.enum('status', ['failed', 'sucess']).notNullable().defaultTo('active')
          table.date('created_at').notNullable()
          table.date('update_at').notNullable()
        })
      logger.debug('payments table created successfully.')
    } else {
      logger.debug('payments table already exists. Skipping creation.')
    }
  } catch (err) {
    logger.error('error creat schema payments', err)
  }
}

export { createPayments }
