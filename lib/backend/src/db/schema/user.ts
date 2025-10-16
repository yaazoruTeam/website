import { Knex } from 'knex'
import { User } from '@model'
import getDbConnection from '@db/connection'
import logger from '@/src/utils/logger'

const createUserSchema = async () => {
  logger.debug('create user schema')

  const knex = getDbConnection()
  try {
    const roles: Array<User.Model['role']> = ['admin', 'branch']
    const tableExists = await knex.schema.withSchema('yaazoru').hasTable('users')
    if (!tableExists) {
      logger.debug('Creating user table...')
      await knex.schema.withSchema('yaazoru').createTable('users', (table: Knex.TableBuilder) => {
        table.increments('user_id').primary()
        table.string('first_name', 20).notNullable()
        table.string('last_name', 20).notNullable()
        table.string('id_number', 9).nullable() // Made nullable for Google users
        table.string('phone_number', 20).nullable() // Made nullable for Google users
        table.string('email', 50).notNullable().unique()
        table.string('password').nullable() // Made nullable for Google users (they don't need password)
        table.string('user_name').notNullable().unique()
        table.enu('role', roles).notNullable()
        table.enum('status', ['active', 'inactive']).notNullable().defaultTo('active')
        // Google OAuth fields
        table.string('google_uid').nullable().unique()
        table.text('photo_url').nullable()
        table.boolean('email_verified').nullable().defaultTo(false)
      })
      logger.debug('User table created successfully.')
    } else {
      logger.debug('User table already exists. Skipping creation.')
    }
  } catch (err) {
    logger.error('error create schema user', err)
  }
}

export { createUserSchema }
