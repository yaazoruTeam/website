# 🔍 Audit System Test Scripts

This directory contains test scripts for the TypeScript Audit System.

## 📋 Available Scripts

### 1. PowerShell Script (Windows)
```powershell
# Run with default settings
.\scripts\Test-AuditSystem.ps1

# Run with custom parameters
.\scripts\Test-AuditSystem.ps1 -BaseURL "http://localhost:3006" -ContainerName "yaazoru-postgres-db-dev"
```

### 2. Bash Script (Linux/WSL/Mac)
```bash
# Make executable (if needed)
chmod +x scripts/test-audit-system.sh

# Run with default settings
./scripts/test-audit-system.sh

# Run with custom parameters
./scripts/test-audit-system.sh "http://localhost:3006" "yaazoru-postgres-db-dev" "postgres" "yaazoru"
```

## 🎯 What These Scripts Test

### ✅ Backend Health
- Checks if the Node.js backend is running
- Verifies API response on `/health` endpoint

### 🗄️ Database Structure
- Confirms `audit_logs` table exists in `yaazoru` schema
- Shows table structure and columns
- Lists database indexes for performance

### 📊 Current Data
- Counts existing audit log records
- Shows recent audit entries (if any)

### 🔌 API Endpoints  
- Tests `/controller/auditLogs` endpoints
- Handles authentication requirements
- Reports HTTP status codes

### 🔧 Middleware Testing
- Makes test requests to trigger audit logging
- Checks if new audit logs are created
- Verifies middleware integration

## 🚀 Prerequisites

Before running these scripts, make sure:

1. **Docker is running**:
   ```bash
   docker-compose -f docker-compose.dev.yaml up backend --build
   ```

2. **Backend is accessible** at `http://localhost:3006`

3. **PostgreSQL container** is running and accessible

## 📈 Expected Output

✅ **Success indicators:**
- Backend health check passes
- `audit_logs` table exists with proper structure
- API endpoints respond (may require authentication)
- Indexes are created for performance

⚠️ **Common issues:**
- Backend not running → Start with docker-compose
- Table missing → Check schema creation in TypeScript
- API authentication errors → Normal for protected endpoints
- No audit data → Expected initially, will populate with usage

## 🔍 Manual Testing

After running the scripts, you can manually test audit logging:

1. **Make API requests** through Postman or curl
2. **Perform CRUD operations** on any entity
3. **Check audit_logs table**:
   ```sql
   SELECT * FROM yaazoru.audit_logs ORDER BY timestamp DESC LIMIT 10;
   ```

## 🛠️ Troubleshooting

- **"Backend not responding"** → Check if port 3006 is available
- **"Table does not exist"** → Verify TypeScript schema creation runs
- **"Authentication required"** → Normal for protected audit endpoints
- **"No audit logs"** → Make authenticated requests to trigger logging

---

*These scripts replace the old pgAudit testing and focus on the new TypeScript-based audit system.*
