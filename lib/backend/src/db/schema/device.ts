import logger from '@/src/utils/logger'
import getDbConnection from '@db/connection'
import { Knex } from 'knex'

const createDeviceSchema = async () => {
  logger.info('create device schema')

  const knex = getDbConnection()
  try {
    const tableExists = await knex.schema.withSchema('yaazoru').hasTable('devices')
    if (!tableExists) {
      logger.info('Creating devices table...')
      await knex.schema.withSchema('yaazoru').createTable('devices', (table: Knex.TableBuilder) => {
        table.increments('device_id').primary()
        table.string('SIM_number').notNullable().unique()
        table.string('IMEI_1').notNullable().unique()
        table.string('mehalcha_number').notNullable().unique()
        table.string('device_number').notNullable().unique()
        table.string('model').notNullable()
        table.enum('status', ['active', 'inactive']).notNullable().defaultTo('active')
      })
      logger.info('Device table created successfully.')
    } else {
      logger.info('device table already exists. Skipping creation.')
    }
  } catch (err) {
    logger.error('error creat schema device', err)
  }
}

export { createDeviceSchema }
