import getDbConnection from '@db/connection'
import { Knex } from 'knex'

const createCustomerSchema = async () => {
  console.log('create customer schema')

  const knex = getDbConnection()
  try {
    const tableExists = await knex.schema.withSchema('yaazoru').hasTable('customers')
    if (!tableExists) {
      console.log('Creating customer table...')
      await knex.schema
        .withSchema('yaazoru')
        .createTable('customers', (table: Knex.TableBuilder) => {
          table.increments('customer_id').primary()
          table.string('first_name', 20).notNullable()
          table.string('last_name', 20).notNullable()
          table.string('id_number', 9).notNullable().unique()
          table.string('phone_number', 20).notNullable()
          table.string('additional_phone', 20).nullable()
          table.string('email', 50).notNullable().unique()
          table.string('city', 20).notNullable()
          table.string('address1').notNullable()
          table.string('address2').nullable()
          table.string('zipCode').notNullable()
          table.enum('status', ['active', 'inactive']).notNullable().defaultTo('active')
          table.date('created_at').notNullable()
          table.date('updated_at').notNullable()
          // table.text("customer_notes");
        })
      console.log('Customer table created successfully.')
    } else {
      console.log('Customer table already exists. Skipping creation.')
    }
  } catch (err) {
    console.error('error creat schema customer', err)
  }
}

export { createCustomerSchema }
