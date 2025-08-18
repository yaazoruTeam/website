import { NextFunction, Request, Response } from 'express'
import * as db from '@db/index'
import { AuditLog, HttpError } from '@model'
import config from '@config/index'

const limit = config.database.limit

interface AuditLogFilters {
  table_name?: string
  user_id?: string
  action?: 'INSERT' | 'UPDATE' | 'DELETE'
  start_date?: string
  end_date?: string
  record_id?: string
}

const getAuditLogs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1
    const offset = (page - 1) * limit

    // Extract filters from query parameters
    const filters: AuditLogFilters = {
      table_name: req.query.table_name as string,
      user_id: req.query.user_id as string,
      action: req.query.action as 'INSERT' | 'UPDATE' | 'DELETE',
      record_id: req.query.record_id as string,
      start_date: req.query.start_date as string,
      end_date: req.query.end_date as string,
    }

    // Clean up empty filters
    Object.keys(filters).forEach(key => {
      if (filters[key as keyof AuditLogFilters] === undefined || filters[key as keyof AuditLogFilters] === '') {
        delete filters[key as keyof AuditLogFilters]
      }
    })

    // Convert date strings to Date objects
    const queryFilters: any = { ...filters }
    if (queryFilters.start_date) {
      queryFilters.start_date = new Date(queryFilters.start_date)
    }
    if (queryFilters.end_date) {
      queryFilters.end_date = new Date(queryFilters.end_date)
    }

    const { auditLogs, total } = await db.AuditLog.getAuditLogs(offset, queryFilters)

    res.status(200).json({
      data: auditLogs,
      page,
      totalPages: Math.ceil(total / limit),
      total,
      filters: filters, // Return applied filters for frontend reference
    })
  } catch (error: any) {
    next(error)
  }
}

const getAuditLogById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    AuditLog.sanitizeIdExisting(req)
    const auditLog = await db.AuditLog.getAuditLogById(req.params.id)
    
    if (!auditLog) {
      const error: HttpError.Model = {
        status: 404,
        message: 'Audit log not found',
      }
      throw error
    }
    
    res.status(200).json(auditLog)
  } catch (error: any) {
    next(error)
  }
}

const getAuditLogsByTableAndRecord = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { table_name, record_id } = req.params
    
    if (!table_name || !record_id) {
      const error: HttpError.Model = {
        status: 400,
        message: 'Table name and record ID are required',
      }
      throw error
    }
    
    const auditLogs = await db.AuditLog.getAuditLogsByTableAndRecord(table_name, record_id)
    res.status(200).json(auditLogs)
  } catch (error: any) {
    next(error)
  }
}

const deleteOldAuditLogs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const daysToKeep = parseInt(req.body.days_to_keep as string, 10) || 365
    
    if (daysToKeep < 30) {
      const error: HttpError.Model = {
        status: 400,
        message: 'Cannot delete audit logs newer than 30 days',
      }
      throw error
    }
    
    const deletedCount = await db.AuditLog.deleteOldAuditLogs(daysToKeep)
    
    res.status(200).json({
      message: `Deleted ${deletedCount} old audit log entries`,
      deleted_count: deletedCount,
      days_kept: daysToKeep,
    })
  } catch (error: any) {
    next(error)
  }
}

// Get audit statistics
const getAuditStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { start_date, end_date } = req.query
    
    const filters: any = {}
    if (start_date) {
      filters.start_date = new Date(start_date as string)
    }
    if (end_date) {
      filters.end_date = new Date(end_date as string)
    }

    // Get all audit logs for the period
    const { auditLogs, total } = await db.AuditLog.getAuditLogs(0, filters)

    // Calculate statistics
    const stats = {
      total_entries: total,
      actions: {
        INSERT: auditLogs.filter(log => log.action === 'INSERT').length,
        UPDATE: auditLogs.filter(log => log.action === 'UPDATE').length,
        DELETE: auditLogs.filter(log => log.action === 'DELETE').length,
      },
      tables: {} as { [key: string]: number },
      users: {} as { [key: string]: number },
      period: {
        start_date: filters.start_date || 'No limit',
        end_date: filters.end_date || 'No limit',
      }
    }

    // Count by table
    auditLogs.forEach(log => {
      stats.tables[log.table_name] = (stats.tables[log.table_name] || 0) + 1
      stats.users[log.user_name] = (stats.users[log.user_name] || 0) + 1
    })

    res.status(200).json(stats)
  } catch (error: any) {
    next(error)
  }
}

export { 
  getAuditLogs, 
  getAuditLogById, 
  getAuditLogsByTableAndRecord, 
  deleteOldAuditLogs,
  getAuditStats 
}
