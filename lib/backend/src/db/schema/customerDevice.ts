import { Knex } from 'knex'
import logger from '@/src/utils/logger'
import getDbConnection from '@db/connection'

const createCustomerDeviceSchema = async () => {
  logger.debug('create customerDevice schema')

  const knex = getDbConnection()
  try {
    const tableExists = await knex.schema.withSchema('yaazoru').hasTable('customerDevice')
    if (!tableExists) {
      logger.debug('Creating customerDevice table...')
      await knex.schema
        .withSchema('yaazoru')
        .createTable('customerDevice', (table: Knex.TableBuilder) => {
          table.increments('customerDevice_id').primary()
          table.string('customer_id').notNullable()
          table.string('device_id').notNullable().unique()
          table.date('receivedAt').nullable()
          table.date('planEndDate').nullable()
        })
      logger.debug('CustomerDevice table created successfully.')
    } else {
      logger.debug('CustomerDevice table already exists. Skipping creation.')
    }
  } catch (err) {
    logger.error('error creat schema customerDevice', err)
  }
}

export { createCustomerDeviceSchema }
