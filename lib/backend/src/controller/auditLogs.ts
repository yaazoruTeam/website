import { NextFunction, Request, Response } from 'express'
import * as db from '@db/index'
import { AuditLogs, HttpError } from '@model'
import config from '@config/index'

const limit = config.database.limit

const createAuditLog = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    AuditLogs.sanitizeBodyExisting(req)
    const auditLogData: AuditLogs.Model = req.body
    const sanitized: AuditLogs.Model = AuditLogs.sanitize(auditLogData, false)
    
    // Get user info from request (assuming it's set by auth middleware)
    const userInfo = (req as any).user || {};
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent');
    
    // Use the database function directly
    const auditLog = await db.AuditLogs.createAuditLog({
      ...sanitized,
      ip_address: ipAddress,
      user_agent: userAgent,
    });
    
    res.status(201).json(auditLog)
  } catch (error: any) {
    next(error)
  }
}

const getAuditLogs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1
    const offset = (page - 1) * limit

    const { auditLogs, total } = await db.AuditLogs.getAllAuditLogs(offset)
    res.status(200).json({
      data: auditLogs,
      page,
      totalPages: Math.ceil(total / limit),
      total,
    })
  } catch (error: any) {
    next(error)
  }
}

const getAuditLogById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    AuditLogs.sanitizeIdExisting(req)
    const auditLog = await db.AuditLogs.getAuditLogById(req.params.id)
    if (!auditLog) {
      const error: HttpError.Model = {
        status: 404,
        message: 'Audit log not found.',
      }
      throw error
    }
    res.status(200).json(auditLog)
  } catch (error: any) {
    next(error)
  }
}

const getAuditLogsByTable = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const tableName = req.params.tableName
    const page = parseInt(req.query.page as string, 10) || 1
    const offset = (page - 1) * limit

    if (!tableName) {
      const error: HttpError.Model = {
        status: 400,
        message: 'Table name is required.',
      }
      throw error
    }

    const { auditLogs, total } = await db.AuditLogs.getAuditLogsByTableName(tableName, offset)
    res.status(200).json({
      data: auditLogs,
      page,
      totalPages: Math.ceil(total / limit),
      total,
    })
  } catch (error: any) {
    next(error)
  }
}

const getAuditLogsByRecord = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { tableName, recordId } = req.params
    const page = parseInt(req.query.page as string, 10) || 1
    const offset = (page - 1) * limit

    if (!tableName || !recordId) {
      const error: HttpError.Model = {
        status: 400,
        message: 'Table name and record ID are required.',
      }
      throw error
    }

    const { auditLogs, total } = await db.AuditLogs.getAuditLogsByRecordId(tableName, recordId, offset)
    res.status(200).json({
      data: auditLogs,
      page,
      totalPages: Math.ceil(total / limit),
      total,
    })
  } catch (error: any) {
    next(error)
  }
}

const getAuditLogsByUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.params.userId
    const page = parseInt(req.query.page as string, 10) || 1
    const offset = (page - 1) * limit

    if (!userId) {
      const error: HttpError.Model = {
        status: 400,
        message: 'User ID is required.',
      }
      throw error
    }

    const { auditLogs, total } = await db.AuditLogs.getAuditLogsByUser(userId, offset)
    res.status(200).json({
      data: auditLogs,
      page,
      totalPages: Math.ceil(total / limit),
      total,
    })
  } catch (error: any) {
    next(error)
  }
}

const getAuditLogsByDateRange = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { startDate, endDate } = req.query
    const page = parseInt(req.query.page as string, 10) || 1
    const offset = (page - 1) * limit

    if (!startDate || !endDate) {
      const error: HttpError.Model = {
        status: 400,
        message: 'Start date and end date are required.',
      }
      throw error
    }

    const start = new Date(startDate as string)
    const end = new Date(endDate as string)

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      const error: HttpError.Model = {
        status: 400,
        message: 'Invalid date format.',
      }
      throw error
    }

    const { auditLogs, total } = await db.AuditLogs.getAuditLogsByDateRange(start, end, offset)
    res.status(200).json({
      data: auditLogs,
      page,
      totalPages: Math.ceil(total / limit),
      total,
    })
  } catch (error: any) {
    next(error)
  }
}

const deleteAuditLog = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    AuditLogs.sanitizeIdExisting(req)
    const existsAuditLog = await db.AuditLogs.doesAuditLogExist(req.params.id)
    if (!existsAuditLog) {
      const error: HttpError.Model = {
        status: 404,
        message: 'Audit log not found.',
      }
      throw error
    }
    const deletedAuditLog = await db.AuditLogs.deleteAuditLog(req.params.id)
    res.status(200).json(deletedAuditLog)
  } catch (error: any) {
    next(error)
  }
}

// פונקציה להוספת רישום ביקורת (מקוצרת)
const logActivity = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { tableName, recordId, action, oldValues, newValues } = req.body
    
    // Get user info from request (assuming it's set by auth middleware)
    const userInfo = (req as any).user || {};
    const userId = userInfo.id || 'unknown';
    const userName = userInfo.name || 'Unknown User';
    const userRole = userInfo.role || 'admin';
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent');

    if (!tableName || !recordId || !action) {
      const error: HttpError.Model = {
        status: 400,
        message: 'Table name, record ID, and action are required.',
      }
      throw error
    }

    const auditLog = await db.AuditLogs.logActivity(
      tableName,
      recordId,
      action,
      userId,
      userName,
      userRole,
      oldValues,
      newValues,
      ipAddress,
      userAgent
    );
    
    res.status(201).json({
      success: true,
      message: 'Activity logged successfully',
      data: auditLog
    })
  } catch (error: any) {
    next(error)
  }
}

export {
  createAuditLog,
  getAuditLogs,
  getAuditLogById,
  getAuditLogsByTable,
  getAuditLogsByRecord,
  getAuditLogsByUser,
  getAuditLogsByDateRange,
  deleteAuditLog,
  logActivity,
}
