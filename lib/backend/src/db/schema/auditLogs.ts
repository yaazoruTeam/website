import getDbConnection from '@db/connection'
import { Knex } from 'knex'

const createAuditLogsSchema = async () => {
  console.log('create audit_logs schema')

  const knex = getDbConnection()
  try {
    const tableExists = await knex.schema.withSchema('yaazoru').hasTable('audit_logs')
    if (!tableExists) {
      console.log('Creating audit_logs table...')
      await knex.schema
        .withSchema('yaazoru')
        .createTable('audit_logs', (table: Knex.TableBuilder) => {
          table.increments('audit_id').primary()
          table.string('table_name', 50).notNullable()
          table.string('record_id', 50).notNullable()
          table.text('action').notNullable()
          table.jsonb('old_values').nullable()
          table.jsonb('new_values').nullable()
          table.string('user_id', 50).notNullable()
          table.string('user_name', 50).notNullable()
          table.text('user_role').notNullable()
          table.timestamp('timestamp', { useTz: true }).defaultTo(knex.fn.now()).notNullable()
          table.string('ip_address', 50).nullable()
          table.text('user_agent').nullable()
          
          // Add constraints
          table.check('action IN (\'INSERT\', \'UPDATE\', \'DELETE\')', [], 'audit_logs_action_check')
          table.check('user_role IN (\'admin\', \'branch\')', [], 'audit_logs_user_role_check')
        })
      
      // Add indexes for better performance
      await knex.schema.withSchema('yaazoru').raw(`
        CREATE INDEX audit_logs_table_name_record_id_index 
        ON yaazoru.audit_logs USING btree (table_name, record_id)
      `)
      
      await knex.schema.withSchema('yaazoru').raw(`
        CREATE INDEX audit_logs_timestamp_index 
        ON yaazoru.audit_logs USING btree (timestamp)
      `)
      
      await knex.schema.withSchema('yaazoru').raw(`
        CREATE INDEX audit_logs_user_id_index 
        ON yaazoru.audit_logs USING btree (user_id)
      `)
      
      console.log('audit_logs table created successfully.')
    } else {
      console.log('audit_logs table already exists. Skipping creation.')
    }
  } catch (err) {
    console.error('error creating audit_logs schema', err)
  }
}

export { createAuditLogsSchema }
