import getDbConnection from '../connection'
import { Knex } from 'knex'

const createPayments = async () => {
  console.log('create payments schema')

  const knex = getDbConnection()
  try {
    const tableExists = await knex.schema.withSchema('yaazoru').hasTable('payments')
    if (!tableExists) {
      console.log('Creating payments table...')
      await knex.schema
        .withSchema('yaazoru')
        .createTable('payments', (table: Knex.TableBuilder) => {
          table.increments('payments_id').primary()
          table.string('monthlyPayment_id').notNullable()
          table.integer('amount').notNullable()
          table.date('date').notNullable()
          table.enum('status', ['failed', 'sucess']).notNullable().defaultTo('active')
          table.date('created_at').notNullable()
          table.date('update_at').notNullable()
        })
      console.log('payments table created successfully.')
    } else {
      console.log('payments table already exists. Skipping creation.')
    }
  } catch (err) {
    console.error('error creat schema payments', err)
  }
}

export { createPayments }
