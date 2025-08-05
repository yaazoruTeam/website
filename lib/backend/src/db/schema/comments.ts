import getDbConnection from '@db/connection'
import { Knex } from 'knex'

const createCommentsSchema = async () => {
  console.log('create comments schema')

  const knex = getDbConnection()
  try {
    const tableExists = await knex.schema.withSchema('yaazoru').hasTable('comments')
    if (!tableExists) {
      console.log('Creating comments table...')
      await knex.schema
        .withSchema('yaazoru')
        .createTable('comments', (table: Knex.TableBuilder) => {
          table.increments('comment_id').primary()
          table.string('entity_id').notNullable()
          table.enum('entity_type', ['customer', 'device', 'branch']).notNullable()
          table.text('content').notNullable()
          table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
        })
      console.log('Comments table created successfully.')
    } else {
      console.log('Comments table already exists. Skipping creation.')
    }
  } catch (err) {
    console.error('Error creating comments schema', err)
  }
}

export { createCommentsSchema }
