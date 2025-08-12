import logger from '@/src/utils/logger'
import getDbConnection from '@db/connection'
import { Knex } from 'knex'

const createCustomerDeviceSchema = async () => {
  logger.info('create customerDevice schema')

  const knex = getDbConnection()
  try {
    const tableExists = await knex.schema.withSchema('yaazoru').hasTable('customerDevice')
    if (!tableExists) {
      logger.info('Creating customerDevice table...')
      await knex.schema
        .withSchema('yaazoru')
        .createTable('customerDevice', (table: Knex.TableBuilder) => {
          table.increments('customerDevice_id').primary()
          table.string('customer_id').notNullable()
          table.string('device_id').notNullable().unique()
          table.date('receivedAt').nullable()
          table.date('planEndDate').nullable()
          table.enu('filterVersion', ['1.7', '1.8']).nullable()
          table.enu('deviceProgram', ['0', '2']).nullable()
        })
      logger.info('CustomerDevice table created successfully.')
    } else {
      logger.info('CustomerDevice table already exists. Skipping creation.')
    }
  } catch (err) {
    logger.error('error creat schema customerDevice', err)
  }
}

export { createCustomerDeviceSchema }
