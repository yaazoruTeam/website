import logger from '@/src/utils/logger'
import getDbConnection from '@db/connection'
import { Knex } from 'knex'

const createMonthlyPayment = async () => {
  logger.debug('create monthlyPayment schema')

  const knex = getDbConnection()
  try {
    const tableExists = await knex.schema.withSchema('yaazoru').hasTable('monthlyPayment')
    if (!tableExists) {
      logger.debug('Creating monthlyPayment table...')
      await knex.schema
        .withSchema('yaazoru')
        .createTable('monthlyPayment', (table: Knex.TableBuilder) => {
          table.increments('monthlyPayment_id').primary()
          table.string('customer_id').notNullable()
          table.string('customer_name').notNullable().defaultTo('')
          table.string('belongsOrganization').notNullable()
          table.date('start_date').notNullable()
          table.date('end_date').notNullable()
          table.decimal('amount').notNullable()
          table.decimal('total_amount').notNullable()
          table.decimal('oneTimePayment').notNullable()
          table.string('frequency').notNullable()
          table.integer('amountOfCharges').notNullable()
          table.string('dayOfTheMonth').notNullable()
          table.date('next_charge').notNullable()
          table.date('last_attempt').notNullable()
          table.date('last_sucsse').notNullable()
          table.date('created_at').notNullable()
          table.date('update_at').notNullable()
          table.enum('status', ['active', 'inactive']).notNullable().defaultTo('active')
        })
      logger.debug('monthlyPayment table created successfully.')
    } else {
      logger.debug('monthlyPayment table already exists. Skipping creation.')
    }
  } catch (err) {
    logger.error('error creat schema monthlyPayment', err)
  }
}

export { createMonthlyPayment }
