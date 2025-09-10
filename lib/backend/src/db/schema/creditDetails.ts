import { Knex } from 'knex'
import logger from '@/src/utils/logger'
import getDbConnection from '@db/connection'

const createCreditDetailsSchema = async () => {
  logger.debug('create creditDetails schema')

  const knex = getDbConnection()
  try {
    const tableExists = await knex.schema.withSchema('yaazoru').hasTable('creditDetails')
    if (!tableExists) {
      logger.debug('Creating creditDetails table...')
      await knex.schema
        .withSchema('yaazoru')
        .createTable('creditDetails', (table: Knex.TableBuilder) => {
          table.increments('credit_id').primary()
          table.string('customer_id').notNullable() // האם יש צורך לעשות את זה unique
          table.string('token').notNullable().unique() // האם יש צורך לעשות את זה unique
          table.integer('expiry_month').notNullable()
          table.integer('expiry_year').notNullable()
          table.date('created_at').notNullable()
          table.date('update_at').notNullable()
          // האם צריך סטטוס בשביל מחיקה ומה קורה במחיקה
        })
      logger.debug('creditDetails table created successfully.')
    } else {
      logger.debug('creditDetails table already exists. Skipping creation.')
    }
  } catch (err) {
    logger.error('error creat schema creditDetails', err)
  }
}

export { createCreditDetailsSchema }
