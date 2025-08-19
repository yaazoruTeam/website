import { HttpError } from '.'

interface Model {
  audit_id?: number
  table_name: string
  record_id: string
  action: 'INSERT' | 'UPDATE' | 'DELETE'
  old_values?: any
  new_values?: any
  user_id: string
  user_name: string
  user_role: 'admin' | 'branch'
  timestamp: Date
  ip_address?: string
  user_agent?: string
}

function sanitize(auditLog: Model, hasId: boolean): Model {
  const isString = (value: any) => typeof value === 'string'
  
  if (hasId && !auditLog.audit_id) {
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "audit_id".',
    }
    throw error
  }
  
  if (!isString(auditLog.table_name) || auditLog.table_name.trim() === '') {
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "table_name".',
    }
    throw error
  }
  
  if (!isString(auditLog.record_id) || auditLog.record_id.trim() === '') {
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "record_id".',
    }
    throw error
  }
  
  if (!auditLog.action || !['INSERT', 'UPDATE', 'DELETE'].includes(auditLog.action)) {
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "action". Must be INSERT, UPDATE, or DELETE.',
    }
    throw error
  }
  
  if (!isString(auditLog.user_id) || auditLog.user_id.trim() === '') {
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "user_id".',
    }
    throw error
  }
  
  if (!isString(auditLog.user_name) || auditLog.user_name.trim() === '') {
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "user_name".',
    }
    throw error
  }
  
  if (!auditLog.user_role || !['admin', 'branch'].includes(auditLog.user_role)) {
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "user_role". Must be admin or branch.',
    }
    throw error
  }
  
  if (!auditLog.timestamp || !(auditLog.timestamp instanceof Date)) {
    auditLog.timestamp = new Date()
  }

  const sanitizedAuditLog: Model = {
    audit_id: auditLog.audit_id,
    table_name: auditLog.table_name.trim(),
    record_id: auditLog.record_id.trim(),
    action: auditLog.action,
    old_values: auditLog.old_values,
    new_values: auditLog.new_values,
    user_id: auditLog.user_id.trim(),
    user_name: auditLog.user_name.trim(),
    user_role: auditLog.user_role,
    timestamp: auditLog.timestamp,
    ip_address: auditLog.ip_address,
    user_agent: auditLog.user_agent,
  }

  return sanitizedAuditLog
}

const sanitizeIdExisting = (id: any) => {
  if (!id.params.id) {
    const error: HttpError.Model = {
      status: 400,
      message: 'No ID provided',
    }
    throw error
  }
}

const sanitizeBodyExisting = (req: any) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    const error: HttpError.Model = {
      status: 400,
      message: 'No body provided',
    }
    throw error
  }
}

export { Model, sanitize, sanitizeIdExisting, sanitizeBodyExisting }
