import { Knex } from 'knex'
import getDbConnection from '@db/connection'

const createYaazoruSchema = async () => {
  console.log('create customer schema')

  const knex = getDbConnection()

  try {
    const schemaExists = await knex('information_schema.schemata')
      .select('schema_name')
      .where('schema_name', '=', 'yaazoru')
    if (schemaExists.length === 0) {
      console.log('Schema "yaazoru" does not exist. Creating it now...')
      await knex.schema.createSchema('yaazoru')
      console.log('Schema "yaazoru" created successfully.')
    } else {
      console.log('Schema "yaazoru" already exists.')
    }
  } catch (err) {
    console.error('error creat schema customer', err)
  }
}

export { createYaazoruSchema }
