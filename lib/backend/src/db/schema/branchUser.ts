import getDbConnection from '../connection'
import { Knex } from 'knex'

const createBranchUserSchema = async () => {
  console.log('create branchUser schema')

  const knex = getDbConnection()
  try {
    const tableExists = await knex.schema.withSchema('yaazoru').hasTable('branchUser')
    if (!tableExists) {
      console.log('Creating branchUser table...')
      await knex.schema
        .withSchema('yaazoru')
        .createTable('branchUser', (table: Knex.TableBuilder) => {
          table.increments('branchUser_id').primary()
          table.string('branch_id').notNullable()
          table.string('user_id').notNullable()
        })
      console.log('branchUser table created successfully.')
    } else {
      console.log('branchUser table already exists. Skipping creation.')
    }
  } catch (err) {
    console.error('error creat schema branchUser', err)
  }
}

export { createBranchUserSchema }
