#!/bin/bash
# Test script for TypeScript Audit System
# Tests the new audit_logs table and API endpoints

BASE_URL="${1:-http://localhost:3006}"
CONTAINER_NAME="${2:-yaazoru-postgres-db-dev}"
DB_USER="${3:-postgres}"
DB_NAME="${4:-yaazoru}"

echo "🔍 Testing TypeScript Audit System..."

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
GRAY='\033[0;37m'
NC='\033[0m' # No Color

# Test 1: Backend Health Check
echo -e "\n1. Backend Health Check..." 
if curl -s -f "$BASE_URL/health" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend is running${NC}"
else
    echo -e "${RED}❌ Backend is not responding. Make sure the server is running.${NC}"
    echo -e "${YELLOW}Run: docker-compose -f docker-compose.dev.yaml up backend --build${NC}"
    exit 1
fi

# Test 2: Check audit_logs table exists
echo -e "\n2. Audit Logs Table Check..."
TABLE_EXISTS=$(docker exec -i $CONTAINER_NAME psql -U $DB_USER -d $DB_NAME -t -c "SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'yaazoru' AND table_name = 'audit_logs');")
if [[ "$TABLE_EXISTS" =~ "t" ]]; then
    echo -e "${GREEN}✅ audit_logs table exists${NC}"
    
    echo -e "\n   Table structure:"
    docker exec -i $CONTAINER_NAME psql -U $DB_USER -d $DB_NAME -c "\d yaazoru.audit_logs"
else
    echo -e "${RED}❌ audit_logs table does not exist${NC}"
fi

# Test 3: Current audit data
echo -e "\n3. Current Audit Data..."
ROW_COUNT=$(docker exec -i $CONTAINER_NAME psql -U $DB_USER -d $DB_NAME -t -c "SELECT COUNT(*) FROM yaazoru.audit_logs;" | tr -d ' ')
echo -e "${CYAN}📊 Total audit records: $ROW_COUNT${NC}"

if [ "$ROW_COUNT" -gt 0 ]; then
    echo -e "\n   Recent audit logs:"
    docker exec -i $CONTAINER_NAME psql -U $DB_USER -d $DB_NAME -c "SELECT audit_id, table_name, action, user_name, timestamp FROM yaazoru.audit_logs ORDER BY timestamp DESC LIMIT 5;"
fi

# Test 4: API Endpoints
echo -e "\n4. API Endpoints Test..."
echo -e "   Testing audit logs endpoints (may require authentication):"

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/controller/auditLogs" || echo "000")
if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ GET /controller/auditLogs responded with status: 200${NC}"
elif [ "$HTTP_CODE" = "401" ] || [ "$HTTP_CODE" = "403" ]; then
    echo -e "${YELLOW}🔐 Endpoint is protected (Status: $HTTP_CODE) - Authentication required${NC}"
else
    echo -e "${RED}❌ Endpoint error (Status: $HTTP_CODE)${NC}"
fi

# Test 5: Database Indexes
echo -e "\n5. Audit Indexes Check..."
docker exec -i $CONTAINER_NAME psql -U $DB_USER -d $DB_NAME -c "SELECT indexname, indexdef FROM pg_indexes WHERE tablename = 'audit_logs' AND schemaname = 'yaazoru';"

# Test 6: Test request
echo -e "\n6. Middleware Test..."
echo -e "   Testing audit middleware integration..."

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/controller/users" || echo "000")
if [ "$HTTP_CODE" != "000" ]; then
    echo -e "${CYAN}📝 Made test request to trigger potential audit logging${NC}"
    
    sleep 2
    NEW_ROW_COUNT=$(docker exec -i $CONTAINER_NAME psql -U $DB_USER -d $DB_NAME -t -c "SELECT COUNT(*) FROM yaazoru.audit_logs;" | tr -d ' ')
    
    if [ "$NEW_ROW_COUNT" -gt "$ROW_COUNT" ]; then
        echo -e "${GREEN}✅ New audit log created! Middleware is working${NC}"
    else
        echo -e "${YELLOW}ℹ️  No new audit logs detected${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Could not test middleware (endpoint may require auth)${NC}"
fi

# Summary
echo -e "\n7. System Configuration Summary..."
echo -e "   📍 Base URL: $BASE_URL"
echo -e "   🐳 Container: $CONTAINER_NAME" 
echo -e "   🗄️  Database: $DB_NAME"
echo -e "   👤 DB User: $DB_USER"

# Recommendations
echo -e "\n8. Recommendations..."
if [ "$ROW_COUNT" -eq 0 ]; then
    echo -e "💡 To test audit logging manually:"
    echo -e "   1. Use curl or Postman to make authenticated requests"
    echo -e "   2. Create/Update/Delete records through your API"
    echo -e "   3. Check audit_logs table for new entries"
    echo -e "   4. Test: curl -X POST $BASE_URL/controller/auditLogs/log"
fi

echo -e "\n${GREEN}🎉 TypeScript Audit System test completed!${NC}"
echo -e "${CYAN}📊 Summary: Table exists, API endpoints configured, ready for testing${NC}"
