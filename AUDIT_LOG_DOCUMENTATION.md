# Audit Log System Documentation

## Overview
The audit log system provides comprehensive tracking of all database changes in the application. It automatically records who made changes, what was changed, when it happened, and from where (IP address).

## Features
- **Automatic Logging**: Database changes are automatically logged through middleware
- **Manual Logging**: Controllers can manually create audit entries
- **Comprehensive Data**: Tracks old and new values, user information, timestamps, and request metadata
- **Filtering**: Powerful filtering system for queries
- **Statistics**: Aggregated statistics on audit activities
- **Data Retention**: Configurable cleanup of old audit logs
- **Security**: Admin-only access to full audit logs, branch users can see limited data

## Architecture

### Models
- **AuditLog.Model**: TypeScript interface defining audit log structure
- Located in: `lib/model/src/AuditLog.ts`

### Database
- **Table**: `yaazoru.audit_logs`
- **Schema**: `lib/backend/src/db/schema/auditLog.ts`
- **Operations**: `lib/backend/src/db/AuditLog.ts`

### Middleware
- **File**: `lib/backend/src/middleware/audit.ts`
- **Functions**:
  - `createAuditLog()`: Core function to create audit entries
  - `auditMiddleware()`: Express middleware for automatic logging
  - `logAudit()`: Manual logging function

### Services
- **File**: `lib/backend/src/services/auditService.ts`
- **Class**: `AuditService`
- **Methods**:
  - `logCreate()`: Log INSERT operations
  - `logUpdate()`: Log UPDATE operations  
  - `logDelete()`: Log DELETE operations

### Controllers & Routes
- **Controller**: `lib/backend/src/controller/auditLog.ts`
- **Router**: `lib/backend/src/routers/auditLog.ts`
- **Base URL**: `/controller/audit-logs`

### Frontend
- **API Client**: `lib/frontend/src/api/auditLogApi.ts`
- **Component**: `lib/frontend/src/components/auditLog/AuditLogViewer.tsx`

## Usage

### Automatic Logging with Middleware
Apply the middleware to routes that should be automatically audited:

\`\`\`typescript
import auditMiddleware from '@middleware/audit'

// For automatic logging on user creation
router.post('/users', auditMiddleware('yaazoru.users', 'INSERT'), createUser)
\`\`\`

### Manual Logging in Controllers
For more control over audit logging:

\`\`\`typescript
import { AuditService } from '@services/auditService'

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // ... create user logic
    const user = await db.User.createUser(sanitized)
    
    // Manual audit log
    await AuditService.logCreate(
      req, 
      AuditService.getTableName('users'), 
      user.user_id, 
      sanitized
    )
    
    res.status(201).json(user)
  } catch (error) {
    next(error)
  }
}
\`\`\`

### Direct Audit Log Creation
For custom scenarios:

\`\`\`typescript
import { logAudit } from '@middleware/audit'

await logAudit(
  req,
  'yaazoru.customers',
  customerId,
  'UPDATE',
  oldCustomerData,
  newCustomerData
)
\`\`\`

## API Endpoints

### GET /controller/audit-logs
Get audit logs with optional filtering
- **Access**: Admin only
- **Query Parameters**:
  - `page`: Page number (default: 1)
  - `table_name`: Filter by table
  - `user_id`: Filter by user ID
  - `action`: Filter by action (INSERT/UPDATE/DELETE)
  - `start_date`: Filter by start date
  - `end_date`: Filter by end date  
  - `record_id`: Filter by record ID

### GET /controller/audit-logs/stats
Get audit log statistics
- **Access**: Admin only
- **Query Parameters**:
  - `start_date`: Statistics start date
  - `end_date`: Statistics end date

### GET /controller/audit-logs/:id
Get specific audit log by ID
- **Access**: Admin only

### GET /controller/audit-logs/table/:table_name/record/:record_id
Get audit history for specific record
- **Access**: Admin and Branch users

### DELETE /controller/audit-logs/cleanup
Delete old audit logs
- **Access**: Admin only
- **Body**: `{ "days_to_keep": 365 }`

## Data Structure

### Audit Log Entry
\`\`\`typescript
{
  audit_id: number
  table_name: string          // e.g., 'yaazoru.users'
  record_id: string           // ID of the affected record
  action: 'INSERT' | 'UPDATE' | 'DELETE'
  old_values: any             // Previous values (UPDATE/DELETE)
  new_values: any             // New values (INSERT/UPDATE)
  user_id: string             // ID of user making change
  user_name: string           // Full name of user
  user_role: 'admin' | 'branch'
  timestamp: Date
  ip_address: string          // Client IP address
  user_agent: string          // Browser/client info
}
\`\`\`

## Security Considerations

1. **Passwords**: Sensitive data like passwords are masked as '[HIDDEN]' in audit logs
2. **Access Control**: Only admins can view full audit logs
3. **Data Retention**: Old logs can be automatically cleaned up
4. **Immutable**: Audit logs cannot be modified once created

## Best Practices

1. **Sensitive Data**: Always mask sensitive information before logging
2. **Performance**: Use indexes on frequently queried fields (timestamp, user_id, table_name)
3. **Storage**: Implement regular cleanup of old audit logs
4. **Monitoring**: Monitor audit log growth and set up alerts
5. **Backup**: Include audit logs in backup strategies

## Integration Examples

### User Controller Integration
\`\`\`typescript
// In user controller
const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get existing data for audit
    const existingUser = await db.User.getUserById(req.params.id)
    
    // Perform update
    const updatedUser = await db.User.updateUser(req.params.id, newData)
    
    // Create audit log
    await AuditService.logUpdate(
      req,
      AuditService.getTableName('users'),
      req.params.id,
      { ...existingUser, password: '[HIDDEN]' },
      { ...newData, password: '[HIDDEN]' }
    )
    
    res.json(updatedUser)
  } catch (error) {
    next(error)
  }
}
\`\`\`

### Customer Operations
\`\`\`typescript
// Customer creation with audit
const createCustomer = async (req: Request, res: Response) => {
  const customer = await db.Customer.createCustomer(customerData)
  
  await AuditService.logCreate(
    req,
    AuditService.getTableName('customers'),
    customer.customer_id,
    customerData
  )
  
  res.json(customer)
}
\`\`\`

## Troubleshooting

### Common Issues

1. **Missing User Info**: Ensure JWT token is properly included in requests
2. **Audit Failures**: Audit failures don't break main operations (fail gracefully)
3. **Performance**: Large audit logs may slow queries; implement pagination and cleanup
4. **Storage**: Monitor disk space usage for audit log storage

### Debugging
Enable debug logging for audit operations:
\`\`\`typescript
console.log('Audit log created:', auditLogData)
\`\`\`

## Future Enhancements

1. **Real-time Notifications**: WebSocket notifications for critical changes
2. **Advanced Analytics**: More detailed reporting and dashboards
3. **Export Features**: Export audit logs to CSV/PDF
4. **Compliance**: Enhanced features for regulatory compliance (SOX, GDPR)
5. **Alerting**: Automatic alerts for suspicious activities
