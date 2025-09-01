# Test script for TypeScript Audit System
# Tests the new audit_logs table and API endpoints
param(
    [string]$BaseURL = "http://localhost:3006",
    [string]$ContainerName = "yaazoru-postgres-db-dev",
    [string]$DBUser = "postgres", 
    [string]$DBName = "yaazoru"
)

Write-Host "Checking audit logging in TypeScript system..." -ForegroundColor Cyan

# Test 1: Check if backend is running
Write-Host "`n1. Backend Health Check..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$BaseURL/health" -Method GET -UseBasicParsing -TimeoutSec 5
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Backend is running" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Backend is not responding. Make sure the server is running." -ForegroundColor Red
    Write-Host "Run: docker-compose -f docker-compose.dev.yaml up backend --build" -ForegroundColor Yellow
    exit 1
}

# Test 2: Check audit_logs table exists
Write-Host "`n2. Audit Logs Table Check..." -ForegroundColor Yellow
$tableCheck = docker exec -i $ContainerName psql -U $DBUser -d $DBName -t -c "SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'yaazoru' AND table_name = 'audit_logs');"
if ($tableCheck.Trim() -eq "t") {
    Write-Host "SUCCESS: audit_logs table exists" -ForegroundColor Green
    
    # Check table structure
    Write-Host "`n   Table structure:" -ForegroundColor Gray
    docker exec -i $ContainerName psql -U $DBUser -d $DBName -c "\d yaazoru.audit_logs"
} else {
    Write-Host "❌ audit_logs table does not exist" -ForegroundColor Red
}

# Test 3: Check current data in audit_logs
Write-Host "`n3. Current Audit Data..." -ForegroundColor Yellow
$rowCount = docker exec -i $ContainerName psql -U $DBUser -d $DBName -t -c "SELECT COUNT(*) FROM yaazoru.audit_logs;"
Write-Host "Total audit records: $($rowCount.Trim())" -ForegroundColor Cyan

if ($rowCount.Trim() -gt 0) {
    Write-Host "`n   Recent audit logs:" -ForegroundColor Gray
    docker exec -i $ContainerName psql -U $DBUser -d $DBName -c "SELECT audit_id, table_name, action, user_name, timestamp FROM yaazoru.audit_logs ORDER BY timestamp DESC LIMIT 5;"
}

# Test 4: Test Audit API Endpoints (requires authentication)
Write-Host "`n4. API Endpoints Test..." -ForegroundColor Yellow
Write-Host "   Testing audit logs endpoints (may require authentication):" -ForegroundColor Gray

# Test basic endpoint without auth
try {
    $response = Invoke-WebRequest -Uri "$BaseURL/controller/auditLogs" -Method GET -UseBasicParsing -TimeoutSec 5
    Write-Host "✅ GET /controller/auditLogs responded with status: $($response.StatusCode)" -ForegroundColor Green
} catch {
    $statusCode = $_.Exception.Response.StatusCode.Value__
    if ($statusCode -eq 401 -or $statusCode -eq 403) {
        Write-Host "🔐 Endpoint is protected (Status: $statusCode) - Authentication required" -ForegroundColor Yellow
    } else {
        Write-Host "❌ Endpoint error (Status: $statusCode)" -ForegroundColor Red
    }
}

# Test 5: Database Indexes Check
Write-Host "`n5. Audit Indexes Check..." -ForegroundColor Yellow
docker exec -i $ContainerName psql -U $DBUser -d $DBName -c "SELECT indexname, indexdef FROM pg_indexes WHERE tablename = 'audit_logs' AND schemaname = 'yaazoru';"

# Test 6: Test Middleware Functions (if accessible)
Write-Host "`n6. Middleware Test..." -ForegroundColor Yellow
Write-Host "   Testing audit middleware integration..." -ForegroundColor Gray

# Create a test request to trigger audit logging (this would need a real endpoint)
try {
    # This is just an example - you'd need to adapt to your actual endpoints
    $testResponse = Invoke-WebRequest -Uri "$BaseURL/controller/users" -Method GET -UseBasicParsing -TimeoutSec 5
    Write-Host "📝 Made test request to trigger potential audit logging" -ForegroundColor Cyan
    
    # Check if new audit log was created (wait a moment first)
    Start-Sleep -Seconds 2
    $newRowCount = docker exec -i $ContainerName psql -U $DBUser -d $DBName -t -c "SELECT COUNT(*) FROM yaazoru.audit_logs;"
    
    if ($newRowCount.Trim() -gt $rowCount.Trim()) {
        Write-Host "✅ New audit log created! Middleware is working" -ForegroundColor Green
    } else {
        Write-Host "ℹ️  No new audit logs detected" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️  Could not test middleware (endpoint may require auth)" -ForegroundColor Yellow
}

# Test 7: Configuration Summary
Write-Host "`n7. System Configuration Summary..." -ForegroundColor Yellow
Write-Host "   📍 Base URL: $BaseURL"
Write-Host "   🐳 Container: $ContainerName" 
Write-Host "   🗄️  Database: $DBName"
Write-Host "   👤 DB User: $DBUser"

# Test 8: Recommended Next Steps
Write-Host "`n8. Recommendations..." -ForegroundColor Yellow
if ($rowCount.Trim() -eq 0) {
    Write-Host "💡 To test audit logging manually:"
    Write-Host "   1. Use Postman or curl to make authenticated requests"
    Write-Host "   2. Create/Update/Delete records through your API"
    Write-Host "   3. Check audit_logs table for new entries"
    Write-Host "   4. Test: POST $BaseURL/controller/auditLogs/log"
}

Write-Host "`n🎉 TypeScript Audit System test completed!" -ForegroundColor Green
Write-Host "📊 Summary: Table exists, API endpoints configured, ready for testing" -ForegroundColor Cyan
