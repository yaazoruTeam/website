import { Knex } from 'knex'
import logger from '@/src/utils/logger'
import getDbConnection from '@db/connection'

const createCustomerDeviceSchema = async () => {
  logger.debug('create customer_device schema')

  const knex = getDbConnection()
  try {
    const tableExists = await knex.schema.withSchema('yaazoru').hasTable('customer_device')
    if (!tableExists) {
      logger.debug('Creating customer_device table...')
      await knex.schema
        .withSchema('yaazoru')
        .createTable('customer_device', (table: Knex.TableBuilder) => {
          table.increments('customer_device_id').primary()
          table.string('customer_id').notNullable()
          table.string('device_id').notNullable().unique()
          table.date('received_at').nullable()
          table.date('plan_end_date').nullable()
        })
      logger.debug('Customer_device table created successfully.')
    } else {
      logger.debug('Customer_device table already exists. Skipping creation.')
    }
  } catch (err) {
    logger.error('error creat schema customer_device', err)
  }
}

export { createCustomerDeviceSchema }
