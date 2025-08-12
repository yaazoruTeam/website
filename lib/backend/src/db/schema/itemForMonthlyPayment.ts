import logger from '@/src/utils/logger'
import getDbConnection from '@db/connection'
import { Knex } from 'knex'

const createItem = async () => {
  logger.info('create item schema')

  const knex = getDbConnection()
  try {
    const tableExists = await knex.schema.withSchema('yaazoru').hasTable('item')
    if (!tableExists) {
      logger.info('Creating item table...')
      await knex.schema.withSchema('yaazoru').createTable('item', (table: Knex.TableBuilder) => {
        table.increments('item_id').primary()
        table.string('monthlyPayment_id').notNullable()
        table.string('description').notNullable()
        table.string('quantity').notNullable()
        table.string('price').notNullable()
        table.string('total').notNullable()
        table.string('paymentType').notNullable()
        table.date('created_at').notNullable()
        table.date('update_at').notNullable()
      })
      logger.info('item table created successfully.')
    } else {
      logger.info('item table already exists. Skipping creation.')
    }
  } catch (err) {
    logger.error('error creat schema item', err)
  }
}

export { createItem }
