import knex, { Knex } from 'knex'
import config from '@config/index'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let connection: Knex<any, unknown[]> | null = null

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

export default getDbConnection
