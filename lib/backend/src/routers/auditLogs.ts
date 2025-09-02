import { Router } from 'express'
import * as auditLogsController from '@controller/auditLogs'
import { hasRole } from '@middleware/auth'

const auditLogsRouter = Router()

// יצירת רישום ביקורת חדש (רק למנהלים)
auditLogsRouter.post('/', hasRole('admin'), auditLogsController.createAuditLog)

// פונקציה מקוצרת לרישום פעילות
auditLogsRouter.post('/log', hasRole('admin', 'branch'), auditLogsController.logActivity)

// שליפת כל רישומי הביקורת (רק למנהלים)
auditLogsRouter.get('/', hasRole('admin'), auditLogsController.getAuditLogs)

// שליפת רישום ביקורת לפי ID
auditLogsRouter.get('/:id', hasRole('admin'), auditLogsController.getAuditLogById)

// שליפת רישומי ביקורת לפי שם טבלה
auditLogsRouter.get('/table/:tableName', hasRole('admin'), auditLogsController.getAuditLogsByTable)

// שליפת רישומי ביקורת לפי רשומה ספציפית
auditLogsRouter.get('/record/:tableName/:recordId', hasRole('admin'), auditLogsController.getAuditLogsByRecord)

// שליפת רישומי ביקורת לפי משתמש
auditLogsRouter.get('/user/:userId', hasRole('admin'), auditLogsController.getAuditLogsByUser)

// שליפת רישומי ביקורת לפי טווח תאריכים
// Query params: ?startDate=2024-01-01&endDate=2024-12-31&page=1
auditLogsRouter.get('/date-range', hasRole('admin'), auditLogsController.getAuditLogsByDateRange)

// מחיקת רישום ביקורת (רק למנהלים - זהירות!)
auditLogsRouter.delete('/:id', hasRole('admin'), auditLogsController.deleteAuditLog)

export default auditLogsRouter
