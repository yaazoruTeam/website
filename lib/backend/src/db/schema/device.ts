import { Knex } from 'knex'
import logger from '@/src/utils/logger'
import getDbConnection from '@db/connection'

const createDeviceSchema = async () => {
  logger.debug('create device schema')

  const knex = getDbConnection()
  try {
    const tableExists = await knex.schema.withSchema('yaazoru').hasTable('devices')
    if (!tableExists) {
      logger.debug('Creating devices table...')
      await knex.schema.withSchema('yaazoru').createTable('devices', (table: Knex.TableBuilder) => {
        table.increments('device_id').primary()
        table.string('SIM_number').notNullable().unique()
        table.string('IMEI_1').notNullable().unique()
        table.string('mehalcha_number').notNullable().unique()
        table.string('device_number').notNullable().unique()
        table.string('model').notNullable()
        table.enum('status', ['active', 'inactive']).notNullable().defaultTo('active')
      })
      logger.debug('Device table created successfully.')
    } else {
      logger.debug('device table already exists. Skipping creation.')
    }
  } catch (err) {
    logger.error('error creat schema device', err)
  }
}

export { createDeviceSchema }
