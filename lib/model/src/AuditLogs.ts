import { HttpError } from '.'

interface Model {
  audit_id: string
  table_name: string
  record_id: string
  action: 'INSERT' | 'UPDATE' | 'DELETE'
  old_values?: Record<string, unknown>
  new_values?: Record<string, unknown>
  user_id: string
  user_name: string
  user_role: 'admin' | 'branch'
  timestamp: Date
  ip_address?: string
  user_agent?: string
}

function sanitize(auditLog: Model, hasId: boolean): Model {
  const isString = (value: unknown): value is string => typeof value === 'string'
  const isValidAction = (action: unknown): action is Model['action'] => 
    typeof action === 'string' && ['INSERT', 'UPDATE', 'DELETE'].includes(action)
  const isValidRole = (role: unknown): role is Model['user_role'] => 
    typeof role === 'string' && ['admin', 'branch'].includes(role)

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

  if (!isValidAction(auditLog.action)) {
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid "action". Must be INSERT, UPDATE, or DELETE.',
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

  if (!isValidRole(auditLog.user_role)) {
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid "user_role". Must be admin or branch.',
    }
    throw error
  }

  const newAuditLog: Model = {
    audit_id: auditLog.audit_id,
    table_name: auditLog.table_name,
    record_id: auditLog.record_id,
    action: auditLog.action,
    old_values: auditLog.old_values || undefined,
    new_values: auditLog.new_values || undefined,
    user_id: auditLog.user_id,
    user_name: auditLog.user_name,
    user_role: auditLog.user_role,
    timestamp: auditLog.timestamp || new Date(),
    ip_address: auditLog.ip_address || undefined,
    user_agent: auditLog.user_agent || undefined,
  }

  return newAuditLog
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
