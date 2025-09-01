import { AuditLogs } from '@model'
import getDbConnection from '@db/connection'
import config from '@config/index'
const limit = config.database.limit

const createAuditLog = async (auditLog: AuditLogs.Model) => {
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
    throw err
  }
}

const getAllAuditLogs = async (
  offset: number,
): Promise<{ auditLogs: AuditLogs.Model[]; total: number }> => {
  const knex = getDbConnection()
  try {
    const auditLogs = await knex('yaazoru.audit_logs')
      .select('*')
      .orderBy('timestamp', 'desc')
      .limit(limit)
      .offset(offset)

    const [{ count }] = await knex('yaazoru.audit_logs').count('*')
    return {
      auditLogs,
      total: parseInt(count as string, 10),
    }
  } catch (err) {
    throw err
  }
}

const getAuditLogById = async (audit_id: string): Promise<AuditLogs.Model> => {
  const knex = getDbConnection()
  try {
    const auditLog = await knex('yaazoru.audit_logs').where({ audit_id }).first()
    return auditLog
  } catch (err) {
    throw err
  }
}

const getAuditLogsByTableName = async (
  tableName: string,
  offset: number,
): Promise<{ auditLogs: AuditLogs.Model[]; total: number }> => {
  const knex = getDbConnection()
  try {
    const auditLogs = await knex('yaazoru.audit_logs')
      .where('table_name', tableName)
      .orderBy('timestamp', 'desc')
      .limit(limit)
      .offset(offset)

    const [{ count }] = await knex('yaazoru.audit_logs')
      .where('table_name', tableName)
      .count('*')
    
    return {
      auditLogs,
      total: parseInt(count as string, 10),
    }
  } catch (err) {
    throw err
  }
}

const getAuditLogsByRecordId = async (
  tableName: string,
  recordId: string,
  offset: number,
): Promise<{ auditLogs: AuditLogs.Model[]; total: number }> => {
  const knex = getDbConnection()
  try {
    const auditLogs = await knex('yaazoru.audit_logs')
      .where({ 
        table_name: tableName,
        record_id: recordId 
      })
      .orderBy('timestamp', 'desc')
      .limit(limit)
      .offset(offset)

    const [{ count }] = await knex('yaazoru.audit_logs')
      .where({ 
        table_name: tableName,
        record_id: recordId 
      })
      .count('*')
    
    return {
      auditLogs,
      total: parseInt(count as string, 10),
    }
  } catch (err) {
    throw err
  }
}

const getAuditLogsByUser = async (
  userId: string,
  offset: number,
): Promise<{ auditLogs: AuditLogs.Model[]; total: number }> => {
  const knex = getDbConnection()
  try {
    const auditLogs = await knex('yaazoru.audit_logs')
      .where('user_id', userId)
      .orderBy('timestamp', 'desc')
      .limit(limit)
      .offset(offset)

    const [{ count }] = await knex('yaazoru.audit_logs')
      .where('user_id', userId)
      .count('*')
    
    return {
      auditLogs,
      total: parseInt(count as string, 10),
    }
  } catch (err) {
    throw err
  }
}

const getAuditLogsByDateRange = async (
  startDate: Date,
  endDate: Date,
  offset: number,
): Promise<{ auditLogs: AuditLogs.Model[]; total: number }> => {
  const knex = getDbConnection()
  try {
    const auditLogs = await knex('yaazoru.audit_logs')
      .whereBetween('timestamp', [startDate, endDate])
      .orderBy('timestamp', 'desc')
      .limit(limit)
      .offset(offset)

    const [{ count }] = await knex('yaazoru.audit_logs')
      .whereBetween('timestamp', [startDate, endDate])
      .count('*')
    
    return {
      auditLogs,
      total: parseInt(count as string, 10),
    }
  } catch (err) {
    throw err
  }
}

const deleteAuditLog = async (audit_id: string): Promise<AuditLogs.Model> => {
  const knex = getDbConnection()
  try {
    const [deletedAuditLog] = await knex('yaazoru.audit_logs')
      .where({ audit_id })
      .del()
      .returning('*')
    return deletedAuditLog
  } catch (err) {
    throw err
  }
}

const doesAuditLogExist = async (audit_id: string): Promise<boolean> => {
  const knex = getDbConnection()
  try {
    const auditLog = await knex('yaazoru.audit_logs').where({ audit_id }).first()
    return !!auditLog
  } catch (err) {
    throw err
  }
}

// Helper function to log an activity (shortcut for common use cases)
const logActivity = async (
  tableName: string,
  recordId: string,
  action: 'INSERT' | 'UPDATE' | 'DELETE',
  userId: string,
  userName: string,
  userRole: 'admin' | 'branch',
  oldValues?: Record<string, any>,
  newValues?: Record<string, any>,
  ipAddress?: string,
  userAgent?: string
): Promise<AuditLogs.Model> => {
  const auditLog: AuditLogs.Model = {
    audit_id: '', // Will be set by database
    table_name: tableName,
    record_id: recordId,
    action,
    old_values: oldValues,
    new_values: newValues,
    user_id: userId,
    user_name: userName,
    user_role: userRole,
    timestamp: new Date(),
    ip_address: ipAddress,
    user_agent: userAgent,
  }

  return createAuditLog(auditLog)
}

export {
  createAuditLog,
  getAllAuditLogs,
  getAuditLogById,
  getAuditLogsByTableName,
  getAuditLogsByRecordId,
  getAuditLogsByUser,
  getAuditLogsByDateRange,
  deleteAuditLog,
  doesAuditLogExist,
  logActivity,
}
