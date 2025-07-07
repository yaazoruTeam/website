import getDbConnection from '../connection'
import { Knex } from 'knex'

const createDeviceSchema = async () => {
  console.log('create device schema')

  const knex = getDbConnection()
  try {
    const tableExists = await knex.schema.withSchema('yaazoru').hasTable('devices')
    if (!tableExists) {
      console.log('Creating devices table...')
      await knex.schema.withSchema('yaazoru').createTable('devices', (table: Knex.TableBuilder) => {
        table.increments('device_id').primary()
        table.string('SIM_number').notNullable().unique()
        table.string('IMEI_1').notNullable().unique()
        table.string('mehalcha_number').notNullable().unique()
        table.string('device_number').notNullable().unique()
        table.string('model').notNullable()
        table.enum('status', ['active', 'inactive']).notNullable().defaultTo('active')
      })
      console.log('Device table created successfully.')
    } else {
      console.log('device table already exists. Skipping creation.')
    }
  } catch (err) {
    console.error('error creat schema device', err)
  }
}

export { createDeviceSchema }
