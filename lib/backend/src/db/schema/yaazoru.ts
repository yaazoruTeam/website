import logger from '@/src/utils/logger'
import getDbConnection from '@db/connection'
import { Knex } from 'knex'

const createYaazoruSchema = async () => {
  logger.info('create customer schema')

  const knex = getDbConnection()

  try {
    const schemaExists = await knex('information_schema.schemata')
      .select('schema_name')
      .where('schema_name', '=', 'yaazoru')
    if (schemaExists.length === 0) {
      logger.info('Schema "yaazoru" does not exist. Creating it now...')
      await knex.schema.createSchema('yaazoru')
      logger.info('Schema "yaazoru" created successfully.')
    } else {
      logger.info('Schema "yaazoru" already exists.')
    }
  } catch (err) {
    logger.error('error creat schema customer', err)
  }
}

export { createYaazoruSchema }
