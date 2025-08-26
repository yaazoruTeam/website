import { Knex } from 'knex'
import getDbConnection from '@db/connection'

const createItem = async () => {
  console.log('create item schema')

  const knex = getDbConnection()
  try {
    const tableExists = await knex.schema.withSchema('yaazoru').hasTable('item')
    if (!tableExists) {
      console.log('Creating item table...')
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
      console.log('item table created successfully.')
    } else {
      console.log('item table already exists. Skipping creation.')
    }
  } catch (err) {
    console.error('error creat schema item', err)
  }
}

export { createItem }
