import { Knex } from 'knex'
import getDbConnection from '@db/connection'

const createBranchCustomerSchema = async () => {
  console.log('create branchCustomer schema')

  const knex = getDbConnection()
  try {
    const tableExists = await knex.schema.withSchema('yaazoru').hasTable('branchCustomer')
    if (!tableExists) {
      console.log('Creating branchCustomer table...')
      await knex.schema
        .withSchema('yaazoru')
        .createTable('branchCustomer', (table: Knex.TableBuilder) => {
          table.increments('branchCustomer_id').primary()
          table.string('branch_id').notNullable()
          table.string('customer_id').notNullable()
        })
      console.log('branchCustomer table created successfully.')
    } else {
      console.log('branchCustomer table already exists. Skipping creation.')
    }
  } catch (err) {
    console.error('error creat schema branchCustomer', err)
  }
}

export { createBranchCustomerSchema }
