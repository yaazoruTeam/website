import knex, { Knex } from 'knex'
import config from '../config'

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

export default getDbConnection
