import knex, { Knex } from 'knex'
import config from '@/config'

let connection: Knex<any, unknown[]> | null = null

function getDbConnection(): Knex<any, unknown[]> {
  if (connection == null) {
    connection = knex({
      client: 'pg',
      connection: {
        host: config.database.host,
        port: config.database.port,
        user: config.database.user,
        database: config.database.name,
        password: config.database.password,
        ssl: false,
      },
      pool: { min: 0, max: 7 },
    })
  }
  return connection
}

export const checkDatabaseConnection = async (): Promise<void> => {
  try {
    const knex = getDbConnection()

    // ביצוע query פשוט לבדיקת החיבור
    await knex.raw('SELECT 1')

    console.log('Database connection successful')
  } catch (error: any) {
    console.error('Database connection failed:', error.message)
    throw new Error(`Database connection failed: ${error.message}`)
  }
}

export default getDbConnection
