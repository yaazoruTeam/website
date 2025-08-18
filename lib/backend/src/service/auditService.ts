import { Request } from 'express'
import { logAudit } from '@middleware/audit'

/**
 * Service for creating audit log entries in controllers
 */
export class AuditService {
  
  /**
   * Log a CREATE operation
   */
  static async logCreate(
    req: Request,
    tableName: string,
    recordId: string,
    newValues: any
  ) {
    await logAudit(req, tableName, recordId, 'INSERT', undefined, newValues)
  }

  /**
   * Log an UPDATE operation
   */
  static async logUpdate(
    req: Request,
    tableName: string,
    recordId: string,
    oldValues: any,
    newValues: any
  ) {
    await logAudit(req, tableName, recordId, 'UPDATE', oldValues, newValues)
  }

  /**
   * Log a DELETE operation
   */
  static async logDelete(
    req: Request,
    tableName: string,
    recordId: string,
    oldValues: any
  ) {
    await logAudit(req, tableName, recordId, 'DELETE', oldValues, undefined)
  }

  /**
   * Get table name mapping for consistency
   */
  static getTableName(entity: string): string {
    const tableMap: { [key: string]: string } = {
      'users': 'yaazoru.users',
      'customers': 'yaazoru.customers', 
      'devices': 'yaazoru.devices',
      'customer_devices': 'yaazoru.customer_devices',
      'branches': 'yaazoru.branches',
      'branch_customers': 'yaazoru.branch_customers',
      'branch_users': 'yaazoru.branch_users',
      'credit_details': 'yaazoru.credit_details',
      'monthly_payments': 'yaazoru.monthly_payments',
      'payments': 'yaazoru.payments',
      'items': 'yaazoru.items',
      'payment_credit_links': 'yaazoru.payment_credit_links',
      'comments': 'yaazoru.comments',
    }
    
    return tableMap[entity] || entity
  }
}
