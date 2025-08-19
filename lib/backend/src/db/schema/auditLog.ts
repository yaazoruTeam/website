import { AuditLog } from '@model'
import getDbConnection from '@db/connection'
import { Knex } from 'knex'

const createAuditLogSchema = async () => {
  const knex = getDbConnection()
  try {
    const actions: Array<AuditLog.Model['action']> = ['INSERT', 'UPDATE', 'DELETE']
    const roles: Array<AuditLog.Model['user_role']> = ['admin', 'branch']
    
    const tableExists = await knex.schema.withSchema('yaazoru').hasTable('audit_logs')
    if (!tableExists) {
      await knex.schema.withSchema('yaazoru').createTable('audit_logs', (table: Knex.TableBuilder) => {
        table.increments('audit_id').primary()
        table.string('table_name', 50).notNullable()
        table.string('record_id', 50).notNullable()
        table.enu('action', actions).notNullable()
        table.jsonb('old_values').nullable()
        table.jsonb('new_values').nullable()
        table.string('user_id', 50).notNullable()
        table.string('user_name', 50).notNullable()
        table.enu('user_role', roles).notNullable()
        table.timestamp('timestamp').notNullable().defaultTo(knex.fn.now())
        table.string('ip_address', 50).nullable()
        table.text('user_agent').nullable()
        
        // Add indexes for better query performance
        table.index(['table_name', 'record_id'])
        table.index('user_id')
        table.index('timestamp')
        table.index('action')
      })
      console.log('Audit logs table created successfully.')
    }
  } catch (err) {
    console.error('Error creating audit_logs schema', err)
  }
}

export { createAuditLogSchema }
