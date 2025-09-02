# 🔍 Yaazoru Audit System Documentation

## Overview

The Yaazoru project implements a comprehensive **TypeScript-based audit logging system** that tracks all database operations through a structured `audit_logs` table and secure API endpoints.

## ✅ Current System Status

### 🎯 **Fully Operational TypeScript Audit System**
- **Database Table**: `yaazoru.audit_logs` with 11 columns
- **API Endpoints**: Secured with role-based authentication
- **Real Data**: 6+ actual audit records from production use
- **Performance**: 5 optimized database indexes
- **Type Safety**: Full TypeScript integration

## 🗄️ Database Structure

### Table: `yaazoru.audit_logs`
```sql
audit_id       SERIAL PRIMARY KEY
table_name     VARCHAR(50) NOT NULL    -- Which table was affected
record_id      VARCHAR(50) NOT NULL    -- ID of the affected record  
action         TEXT NOT NULL           -- INSERT/UPDATE/DELETE
old_values     JSONB                   -- Previous values (for UPDATE/DELETE)
new_values     JSONB                   -- New values (for INSERT/UPDATE)
user_id        VARCHAR(50) NOT NULL    -- User who performed the action
user_name      VARCHAR(50) NOT NULL    -- Display name of the user
user_role      TEXT NOT NULL           -- admin/branch
timestamp      TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
ip_address     VARCHAR(50)             -- Client IP address
user_agent     TEXT                    -- Browser/client information
```

### Indexes for Performance
- `audit_logs_pkey` - Primary key on audit_id
- `audit_logs_table_name_record_id_index` - Fast lookups by table+record
- `audit_logs_user_id_index` - Filter by user
- `audit_logs_timestamp_index` - Time-based queries
- `audit_logs_action_index` - Filter by operation type

## 🔌 API Endpoints

### Base URL: `/controller/auditLogs`

| Method | Endpoint | Description | Access Level |
|--------|----------|-------------|--------------|
| POST | `/` | Create new audit log | admin |
| POST | `/log` | Quick activity logging | admin, branch |
| GET | `/` | Get all audit logs | admin |
| GET | `/:id` | Get specific audit log | admin |
| GET | `/table/:tableName` | Get logs by table | admin |
| GET | `/record/:tableName/:recordId` | Get logs for specific record | admin |
| GET | `/user/:userId` | Get logs by user | admin |
| GET | `/date-range` | Get logs by date range | admin |
| DELETE | `/:id` | Delete audit log | admin |

### Authentication
All endpoints are protected with `hasRole()` middleware requiring proper JWT tokens.

## 📊 Real Usage Example

Current system already contains actual audit data:
```
audit_id | table_name        | action | user_name      | timestamp
---------|-------------------|--------|----------------|---------------------------
6        | yaazoru.customers | INSERT | Efrat Grinboim | 2025-08-19 11:42:29.111+00
5        | yaazoru.customers | INSERT | Efrat Grinboim | 2025-08-19 11:18:20.877+00
4        | yaazoru.users     | DELETE | Efrat Grinboim | 2025-08-17 15:28:08.694+00
3        | yaazoru.users     | UPDATE | Efrat Grinboim | 2025-08-17 15:16:59.219+00
2        | yaazoru.customers | INSERT | Efrat Grinboim | 2025-08-17 13:40:01.910+00
```

## 🏗️ Technical Architecture

### TypeScript Files Structure
```
lib/backend/src/
├── db/schema/auditLogs.ts       # Database table creation
├── db/AuditLogs.ts              # CRUD operations
├── controller/auditLogs.ts      # HTTP request handlers
├── routers/auditLogs.ts         # Route definitions
└── middleware/auditMiddleware.ts # Automatic audit logging
```

### Model Definition
```
lib/model/src/AuditLogs.ts       # TypeScript interfaces & validation
```

## 🚀 Usage

### Development Environment
```bash
# Start the system
docker-compose -f docker-compose.dev.yaml up backend --build

# Test the audit system
.\scripts\Test-TypeScript-Audit.ps1
```

### Production Environment  
```bash
# Start production
docker-compose up -d

# Health check
curl http://localhost:3006/health
```

## 🧪 Testing & Validation

### Automated Testing
Run the comprehensive test script:
```powershell
# Windows PowerShell
.\scripts\Test-TypeScript-Audit.ps1

# Linux/WSL/Mac
./scripts/test-audit-system.sh
```

### Expected Results
- ✅ Backend responds on port 3006
- ✅ `audit_logs` table exists with proper structure  
- ✅ API endpoints respond (with authentication requirements)
- ✅ Database indexes are optimized
- ✅ Existing audit data visible

### Manual API Testing
```bash
# Get audit logs (requires authentication)
curl -X GET http://localhost:3006/controller/auditLogs \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Log new activity  
curl -X POST http://localhost:3006/controller/auditLogs/log \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "tableName": "test_table",
    "recordId": "123", 
    "action": "UPDATE",
    "userId": "user_123",
    "userName": "Test User",
    "userRole": "branch"
  }'
```

## 🔧 How It Works

### 1. Automatic Audit Logging
The `auditMiddleware.ts` automatically captures:
- **CREATE operations** - When new records are inserted
- **UPDATE operations** - When records are modified (with old/new values)
- **DELETE operations** - When records are removed

### 2. Manual Audit Logging
Use direct database calls for custom audit events:
```typescript
import { db } from '../db';

await db.AuditLogs.createAuditLog({
  actionType: 'UPDATE',
  tableName: 'customers',
  recordId: 'customer_123',
  userName: 'John Doe',
  ipAddress: '192.168.1.1',
  userAgent: 'Mozilla/5.0...',
  oldValues: JSON.stringify({ name: 'Old Name' }),
  newValues: JSON.stringify({ name: 'New Name' })
});
```

## 📈 Performance & Monitoring

### Database Performance
- **5 strategic indexes** ensure fast queries
- **JSONB columns** for efficient storage of complex data
- **Constraints** maintain data integrity

### Monitoring Queries
```sql
-- Daily audit activity summary
SELECT 
  DATE(timestamp) as date,
  action,
  COUNT(*) as operations
FROM yaazoru.audit_logs 
WHERE timestamp >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY DATE(timestamp), action
ORDER BY date DESC;

-- Top active users
SELECT 
  user_name,
  COUNT(*) as total_operations,
  MAX(timestamp) as last_activity
FROM yaazoru.audit_logs
GROUP BY user_name
ORDER BY total_operations DESC;

-- Table activity overview  
SELECT 
  table_name,
  action,
  COUNT(*) as count
FROM yaazoru.audit_logs
GROUP BY table_name, action
ORDER BY table_name, action;
```

## 🛡️ Security Features

- **Role-based access control** - Different permission levels
- **JWT authentication** - Secure API access
- **IP tracking** - Know who did what from where
- **User agent logging** - Track client applications
- **Immutable logs** - Audit trail cannot be easily modified

## 🔄 Migration from Old Systems

This system **replaces** the previous pgAudit attempts. The old files have been cleaned up:
- ❌ `pgaudit/` directory - Removed
- ❌ `Dockerfile.postgres*` - Removed  
- ❌ `Simple-Audit-Check.ps1` - Replaced with `Test-TypeScript-Audit.ps1`
- ❌ `init-pgaudit.sql` - Replaced with TypeScript schema creation

## 🎯 Why This Approach?

### ✅ Advantages
1. **Type Safety** - Full TypeScript integration
2. **Performance** - Optimized database design
3. **Flexibility** - Easy to query and analyze
4. **Security** - Built-in authentication and authorization
5. **Maintainability** - Standard REST API patterns
6. **Scalability** - Efficient indexing and storage

### 🔄 vs. pgAudit
- **Simpler** - No external extensions required
- **More Flexible** - Custom fields and structure
- **Better Integration** - Native TypeScript support
- **Easier Debugging** - Standard database queries
- **Production Ready** - Already handling real data

## 📞 Support & Troubleshooting

### Common Issues
- **API returns 403** - Normal, authentication required
- **No audit data** - Check middleware is enabled on routes
- **Performance issues** - Verify database indexes exist

### Health Checks
```bash
# System health
curl http://localhost:3006/health

# Database connection
docker exec yaazoru-postgres-db-dev pg_isready

# Audit table status  
docker exec -i yaazoru-postgres-db-dev psql -U postgres -d yaazoru -c "SELECT COUNT(*) FROM yaazoru.audit_logs;"
```

---

**System Status**: ✅ **Fully Operational**  
**Last Updated**: September 1, 2025  
**Current Records**: 6+ real audit entries  
**Performance**: Optimized with 5 database indexes
