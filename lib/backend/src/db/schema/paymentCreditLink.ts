import logger from '@/src/utils/logger'
import getDbConnection from '@db/connection'
import { Knex } from 'knex'

const createPaymentCreditLink = async () => {
  logger.debug('create paymentCreditLink schema')

  const knex = getDbConnection()
  try {
    const tableExists = await knex.schema.withSchema('yaazoru').hasTable('paymentCreditLink')
    if (!tableExists) {
      logger.debug('Creating paymentCreditLink table...')
      await knex.schema
        .withSchema('yaazoru')
        .createTable('paymentCreditLink', (table: Knex.TableBuilder) => {
          table.increments('paymentCreditLink_id').primary()
          table.string('monthlyPayment_id').notNullable()
          table.string('creditDetails_id').notNullable()
          table.enum('status', ['active', 'inactive']).notNullable().defaultTo('active')
        })
      logger.debug('paymentCreditLink table created successfully.')
    } else {
      logger.debug('paymentCreditLink table already exists. Skipping creation.')
    }
  } catch (err) {
    logger.error('error creat schema paymentCreditLink', err)
  }
}

export { createPaymentCreditLink }
