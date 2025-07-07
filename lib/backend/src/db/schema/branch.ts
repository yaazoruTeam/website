import getDbConnection from '../connection'
import { Knex } from 'knex'

const createBranchSchema = async () => {
  console.log('create branch schema')

  const knex = getDbConnection()
  try {
    const tableExists = await knex.schema.withSchema('yaazoru').hasTable('branches')
    if (!tableExists) {
      console.log('Creating branch table...')
      await knex.schema
        .withSchema('yaazoru')
        .createTable('branches', (table: Knex.TableBuilder) => {
          table.increments('branch_id').primary()
          table.string('city', 20).notNullable()
          table.string('address', 20).notNullable()
          table.string('manager_name', 20).notNullable()
          table.string('phone_number', 20).notNullable()
          table.string('additional_phone', 20).nullable()
          table.enum('status', ['active', 'inactive']).notNullable().defaultTo('active')
        })
      console.log('branch table created successfully.')
    } else {
      console.log('branch table already exists. Skipping creation.')
    }
  } catch (err) {
    console.error('error creat schema branch', err)
  }
}

export { createBranchSchema }
