import { Request, Response, NextFunction } from 'express';
import * as db from '@db/index';

interface AuditableRequest extends Request {
    user?: {
        id: string;
        username?: string;
        email?: string;
    };
    auditAction?: string;
    auditTable?: string;
    auditQuery?: string;
}

class AuditMiddleware {
    // Middleware לרישום פעילויות CREATE
    static logCreate(tableName: string) {
        return async (req: AuditableRequest, res: Response, next: NextFunction) => {
            const originalSend = res.send;
            
            res.send = function(body) {
                // רק אם הפעולה הצליחה
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    const username = req.user?.username || req.user?.email || 'anonymous';
                    const query = `INSERT INTO ${tableName}`;
                    const bodyData = typeof body === 'string' ? body : JSON.stringify(body);
                    
                    db.AuditLogs.logActivity(
                        tableName,
                        'new_record',
                        'INSERT',
                        req.user?.id || 'anonymous',
                        username,
                        'branch', // ברירת מחדל
                        undefined,
                        req.body,
                        req.ip,
                        req.get('User-Agent')
                    ).catch((err: any) => {
                        console.error('Failed to log audit activity:', err);
                    });
                }
                
                return originalSend.call(this, body);
            };
            
            next();
        };
    }

    // Middleware לרישום פעילויות UPDATE  
    static logUpdate(tableName: string) {
        return async (req: AuditableRequest, res: Response, next: NextFunction) => {
            const originalSend = res.send;
            
            res.send = function(body) {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    const username = req.user?.username || req.user?.email || 'anonymous';
                    const id = req.params.id || 'unknown';
                    const query = `UPDATE ${tableName} SET ... WHERE id = ${id}`;
                    
                    db.AuditLogs.logActivity(
                        tableName,
                        id,
                        'UPDATE',
                        req.user?.id || 'anonymous',
                        username,
                        'branch',
                        undefined, // oldValues - נצטרך להוסיף לוגיקה להשיג
                        req.body,
                        req.ip,
                        req.get('User-Agent')
                    ).catch((err: any) => {
                        console.error('Failed to log audit activity:', err);
                    });
                }
                
                return originalSend.call(this, body);
            };
            
            next();
        };
    }

    // Middleware לרישום פעילויות DELETE
    static logDelete(tableName: string) {
        return async (req: AuditableRequest, res: Response, next: NextFunction) => {
            const originalSend = res.send;
            
            res.send = function(body) {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    const username = req.user?.username || req.user?.email || 'anonymous';
                    const id = req.params.id || 'unknown';
                    const query = `DELETE FROM ${tableName} WHERE id = ${id}`;
                    
                    db.AuditLogs.logActivity(
                        tableName,
                        id,
                        'DELETE',
                        req.user?.id || 'anonymous',
                        username,
                        'branch',
                        undefined,
                        undefined,
                        req.ip,
                        req.get('User-Agent')
                    ).catch((err: any) => {
                        console.error('Failed to log audit activity:', err);
                    });
                }
                
                return originalSend.call(this, body);
            };
            
            next();
        };
    }

    // Middleware לרישום פעילויות READ (אופציונלי)
    static logRead(tableName: string) {
        return async (req: AuditableRequest, res: Response, next: NextFunction) => {
            const originalSend = res.send;
            
            res.send = function(body) {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    const username = req.user?.username || req.user?.email || 'anonymous';
                    const query = `SELECT FROM ${tableName}`;
                    
                    // רק רושמים READ אם זה query מיוחד או רגיש
                    if (req.query.sensitive || req.path.includes('sensitive')) {
                        db.AuditLogs.logActivity(
                            tableName,
                            'read_operation',
                            'DELETE', // אין SELECT אז נשתמש במשהו קרוב
                            req.user?.id || 'anonymous',
                            username,
                            'branch',
                            undefined,
                            { query: req.query },
                            req.ip,
                            req.get('User-Agent')
                        ).catch((err: any) => {
                            console.error('Failed to log audit activity:', err);
                        });
                    }
                }
                
                return originalSend.call(this, body);
            };
            
            next();
        };
    }

    // Middleware כללי לרישום שגיאות
    static logError(tableName: string, action: string) {
        return async (err: Error, req: AuditableRequest, res: Response, next: NextFunction) => {
            const username = req.user?.username || req.user?.email || 'anonymous';
            
            db.AuditLogs.logActivity(
                tableName,
                'error_record',
                'DELETE', // נשתמש ב-DELETE כי אין אופציה של ERROR
                req.user?.id || 'anonymous',
                username,
                'branch',
                undefined,
                { error: err.message, action: action.toUpperCase() },
                req.ip,
                req.get('User-Agent')
            ).catch((logErr: any) => {
                console.error('Failed to log error audit activity:', logErr);
            });
            
            next(err);
        };
    }
}

export default AuditMiddleware;
