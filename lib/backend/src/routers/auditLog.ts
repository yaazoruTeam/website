import express from 'express'
import { 
  getAuditLogs, 
  getAuditLogById, 
  getAuditLogsByTableAndRecord, 
  deleteOldAuditLogs,
  getAuditStats 
} from '@controller/auditLog'
import { hasRole } from '@middleware/auth'

const router = express.Router()

// GET /audit-logs - Get all audit logs with optional filters
// Query parameters: page, table_name, user_id, action, start_date, end_date, record_id
router.get('/', hasRole('admin'), getAuditLogs)

// GET /audit-logs/stats - Get audit log statistics
router.get('/stats', hasRole('admin'), getAuditStats)

// GET /audit-logs/:id - Get specific audit log by ID
router.get('/:id', hasRole('admin'), getAuditLogById)

// GET /audit-logs/table/:table_name/record/:record_id - Get audit logs for specific table and record
router.get('/table/:table_name/record/:record_id', hasRole('admin', 'branch'), getAuditLogsByTableAndRecord)

// DELETE /audit-logs/cleanup - Delete old audit logs (admin only)
router.delete('/cleanup', hasRole('admin'), deleteOldAuditLogs)

export default router
