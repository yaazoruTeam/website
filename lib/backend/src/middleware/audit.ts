import { Request, Response, NextFunction } from 'express'
import { AuditLog, JwtPayload } from '@model'
import * as db from '@db/index'
import jwt from 'jsonwebtoken'
import config from '@config/index'

const JWT_SECRET = config.jwt.secret

interface AuditRequest extends Request {
  auditContext?: {
    tableName: string
    recordId: string
    action: 'INSERT' | 'UPDATE' | 'DELETE'
    oldValues?: any
    newValues?: any
  }
}

// Helper function to get user info from token
const getUserFromToken = async (req: Request): Promise<{ user_id: string; user_name?: string; role: 'admin' | 'branch' } | null> => {
  try {
    const authHeader = req.headers['authorization']
    
    const token = authHeader?.split(' ')[1]
    if (!token) {
      return null
    }

    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload.Model
    
    // Fetch the actual user name from the database
    const userRecord = await db.User.getUserById(decoded.user_id)
    const user_name = userRecord ? `${userRecord.first_name} ${userRecord.last_name}` : undefined
    
    return {
      user_id: decoded.user_id.toString(), // Convert to string
      role: decoded.role,
      user_name,
    }
  } catch (error) {
    console.error('Error decoding token:', error instanceof Error ? error.message : error)
    return null
  }
}

// Helper function to get client IP address
const getClientIp = (req: Request): string => {
  return (
    (req.headers['x-forwarded-for'] as string)?.split(',')[0] ||
    (req.headers['x-real-ip'] as string) ||
    req.connection?.remoteAddress ||
    req.socket?.remoteAddress ||
    'unknown'
  )
}

// Create audit log entry
export const createAuditLog = async (
  tableName: string,
  recordId: string,
  action: 'INSERT' | 'UPDATE' | 'DELETE',
  user_id: string,
  user_role: 'admin' | 'branch',
  oldValues?: any,
  newValues?: any,
  ip_address?: string,
  user_agent?: string,
  user_name?: string
) => {
  try {
    // Use provided user_name or fallback to user_id
    const finalUserName = user_name || user_id

    const auditLogData: AuditLog.Model = {
      table_name: tableName,
      record_id: recordId.toString(),
      action,
      old_values: oldValues,
      new_values: newValues,
      user_id: user_id.toString(), // Ensure it's a string
      user_name: finalUserName,
      user_role,
      timestamp: new Date(),
      ip_address,
      user_agent,
    }

    const sanitizedAuditLog = AuditLog.sanitize(auditLogData, false)
    await db.AuditLog.createAuditLog(sanitizedAuditLog)
  } catch (error) {
    console.error('CRITICAL: Failed to create audit log:', {
      error: error instanceof Error ? error.message : error,
      tableName,
      recordId,
      action,
      user_id,
      user_role,
      timestamp: new Date().toISOString()
    })
    
    // TODO: Implement proper alerting mechanism for audit failures
    // This is a compliance issue that needs to be addressed:
    // - Send alert to security team
    // - Store failed audit attempts in separate backup system
    // - Consider triggering compliance violation workflow
    
    // Don't throw the error to avoid breaking the main operation
    // But ensure this failure is properly monitored and alerted
  }
}

// Middleware to set up audit context
export const auditMiddleware = (tableName: string, action: 'INSERT' | 'UPDATE' | 'DELETE') => {
  return async (req: AuditRequest, res: Response, next: NextFunction) => {
    const userInfo = await getUserFromToken(req)
    if (!userInfo) {
      return next() // Skip audit if no user info
    }

    const ip_address = getClientIp(req)
    const user_agent = req.headers['user-agent']

    // Store audit context in request for later use
    req.auditContext = {
      tableName,
      recordId: '', // Will be set after the record is created/updated
      action,
      oldValues: undefined,
      newValues: action === 'INSERT' || action === 'UPDATE' ? req.body : undefined,
    }

    // Intercept the response to capture the result and create audit log
    const originalSend = res.send.bind(res)
    res.send = function (data: any) {
      // Try to extract the record ID from the response
      try {
        const responseData = typeof data === 'string' ? JSON.parse(data) : data
        if (responseData && (responseData.id || responseData.user_id || responseData.customer_id || responseData.device_id)) {
          const recordId = responseData.id || responseData.user_id || responseData.customer_id || responseData.device_id
          
          // Create audit log asynchronously
          setImmediate(() => {
            createAuditLog(
              tableName,
              recordId,
              action,
              userInfo.user_id,
              userInfo.role,
              req.auditContext?.oldValues,
              req.auditContext?.newValues,
              ip_address,
              user_agent,
              userInfo.user_name
            )
          })
        }
      } catch (error) {
        // Silently handle parsing errors to avoid disrupting the main operation
      }

      return originalSend(data)
    }

    next()
  }
}

// Manual audit log function for complex operations
export const logAudit = async (
  req: Request,
  tableName: string,
  recordId: string,
  action: 'INSERT' | 'UPDATE' | 'DELETE',
  oldValues?: any,
  newValues?: any
) => {
  const userInfo = await getUserFromToken(req)
  if (!userInfo) {
    return
  }

  const ip_address = getClientIp(req)
  const user_agent = req.headers['user-agent']

  await createAuditLog(
    tableName,
    recordId,
    action,
    userInfo.user_id,
    userInfo.role,
    oldValues,
    newValues,
    ip_address,
    user_agent,
    userInfo.user_name
  )
}

export default auditMiddleware
