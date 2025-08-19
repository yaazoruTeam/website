import { AuditLog, HttpError } from '@model'
import getDbConnection from '@db/connection'
import config from '@config/index'
const limit = config.database.limit

const createAuditLog = async (auditLog: AuditLog.Model) => {
  const knex = getDbConnection()
  try {
    const [newAuditLog] = await knex('yaazoru.audit_logs')
      .insert({
        table_name: auditLog.table_name,
        record_id: auditLog.record_id,
        action: auditLog.action,
        old_values: auditLog.old_values,
        new_values: auditLog.new_values,
        user_id: auditLog.user_id,
        user_name: auditLog.user_name,
        user_role: auditLog.user_role,
        timestamp: auditLog.timestamp || knex.fn.now(),
        ip_address: auditLog.ip_address,
        user_agent: auditLog.user_agent,
      })
      .returning('*')
    return newAuditLog
  } catch (err) {
    console.error('Error creating audit log:', err)
    throw err
  }
}

const getAuditLogs = async (
  offset: number = 0,
  filters?: {
    table_name?: string
    user_id?: string
    action?: string
    start_date?: Date
    end_date?: Date
    record_id?: string
  }
): Promise<{ auditLogs: AuditLog.Model[]; total: number }> => {
  const knex = getDbConnection()
  try {
    let query = knex('yaazoru.audit_logs').select('*')

    // Apply filters
    if (filters?.table_name) {
      query = query.where('table_name', filters.table_name)
    }
    if (filters?.user_id) {
      query = query.where('user_id', filters.user_id)
    }
    if (filters?.action) {
      query = query.where('action', filters.action)
    }
    if (filters?.record_id) {
      query = query.where('record_id', filters.record_id)
    }
    if (filters?.start_date) {
      query = query.where('timestamp', '>=', filters.start_date)
    }
    if (filters?.end_date) {
      query = query.where('timestamp', '<=', filters.end_date)
    }

    const auditLogs = await query
      .orderBy('timestamp', 'desc')
      .limit(limit)
      .offset(offset)

    // Get total count with same filters
    let countQuery = knex('yaazoru.audit_logs')
    
    if (filters?.table_name) {
      countQuery = countQuery.where('table_name', filters.table_name)
    }
    if (filters?.user_id) {
      countQuery = countQuery.where('user_id', filters.user_id)
    }
    if (filters?.action) {
      countQuery = countQuery.where('action', filters.action)
    }
    if (filters?.record_id) {
      countQuery = countQuery.where('record_id', filters.record_id)
    }
    if (filters?.start_date) {
      countQuery = countQuery.where('timestamp', '>=', filters.start_date)
    }
    if (filters?.end_date) {
      countQuery = countQuery.where('timestamp', '<=', filters.end_date)
    }

    const [{ count }] = await countQuery.count('*')
    
    return {
      auditLogs,
      total: parseInt(count as string, 10),
    }
  } catch (err) {
    console.error('Error getting audit logs:', err)
    throw err
  }
}

const getAuditLogById = async (audit_id: string) => {
  const knex = getDbConnection()
  try {
    return await knex('yaazoru.audit_logs').where({ audit_id }).first()
  } catch (err) {
    console.error('Error getting audit log by id:', err)
    throw err
  }
}

const getAuditLogsByTableAndRecord = async (table_name: string, record_id: string) => {
  const knex = getDbConnection()
  try {
    return await knex('yaazoru.audit_logs')
      .where({ table_name, record_id })
      .orderBy('timestamp', 'desc')
  } catch (err) {
    console.error('Error getting audit logs by table and record:', err)
    throw err
  }
}

const deleteOldAuditLogs = async (daysToKeep: number = 365) => {
  const knex = getDbConnection()
  try {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep)
    
    const deletedCount = await knex('yaazoru.audit_logs')
      .where('timestamp', '<', cutoffDate)
      .del()
    
    return deletedCount
  } catch (err) {
    console.error('Error deleting old audit logs:', err)
    throw err
  }
}

// Get audit statistics with aggregation queries
const getAuditStats = async (filters: any = {}) => {
  const knex = getDbConnection()
  try {
    let query = knex('yaazoru.audit_logs')
    
    // Apply date filters
    if (filters.start_date) {
      query = query.where('timestamp', '>=', filters.start_date)
    }
    if (filters.end_date) {
      query = query.where('timestamp', '<=', filters.end_date)
    }

    // Get total count
    const totalResult = await query.clone().count('* as total')
    const total = totalResult[0].total

    // Get action statistics
    const actionResult = await query.clone()
      .select('action')
      .count('* as count')
      .groupBy('action')
    
    // Get table statistics
    const tableResult = await query.clone()
      .select('table_name')
      .count('* as count')
      .groupBy('table_name')
      .orderBy('count', 'desc')
    
    // Get user statistics
    const userResult = await query.clone()
      .select('user_name')
      .count('* as count')
      .groupBy('user_name')
      .orderBy('count', 'desc')

    // Format results
    const actions = { INSERT: 0, UPDATE: 0, DELETE: 0 }
    actionResult.forEach((row: any) => {
      actions[row.action as keyof typeof actions] = parseInt(row.count)
    })

    const tables: { [key: string]: number } = {}
    tableResult.forEach((row: any) => {
      tables[row.table_name] = parseInt(row.count)
    })

    const users: { [key: string]: number } = {}
    userResult.forEach((row: any) => {
      users[row.user_name] = parseInt(row.count)
    })

    return {
      total_entries: parseInt(total as string),
      actions,
      tables,
      users
    }
  } catch (err: any) {
    console.error('Error getting audit statistics:', err)
    throw err
  }
}

export {
  createAuditLog,
  getAuditLogs,
  getAuditLogById,
  getAuditLogsByTableAndRecord,
  deleteOldAuditLogs,
  getAuditStats,
}
