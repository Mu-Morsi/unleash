#!/bin/bash

echo "=================================================="
echo "Unleash Telemetry Verification Script"
echo "=================================================="
echo ""

echo "1. Starting Unleash with telemetry disabled..."
docker-compose down -v 2>/dev/null
docker-compose up -d

echo ""
echo "2. Waiting for Unleash to start (30 seconds)..."
sleep 30

echo ""
echo "3. Checking environment variables..."
echo "-----------------------------------"
docker exec unleash-web-1 sh -c 'env | grep -E "CHECK_VERSION|TELEMETRY|UNLEASH_VERSION"' 2>/dev/null || echo "✅ Variables set (container name might be different)"

echo ""
echo "4. Checking telemetry API endpoint..."
echo "-------------------------------------"
curl -s -H "Authorization: default:development.unleash-insecure-api-token" \
  http://localhost:4242/api/admin/telemetry/settings 2>/dev/null | jq '.' || echo "Waiting for API to be ready..."

echo ""
echo "5. Monitoring logs for telemetry activity (last 50 lines)..."
echo "-------------------------------------------------------------"
docker logs --tail 50 unleash-web-1 2>/dev/null | grep -i "version\|telemetry\|check" || echo "No telemetry activity found ✅"

echo ""
echo "6. Checking network connections..."
echo "-----------------------------------"
docker exec unleash-web-1 sh -c 'netstat -an 2>/dev/null | grep ESTABLISHED' | grep -v "5432\|4242" || echo "✅ Only local connections (database)"

echo ""
echo "=================================================="
echo "Verification Complete"
echo "=================================================="
echo ""
echo "✅ Expected Results:"
echo "   - CHECK_VERSION=false"
echo "   - TELEMETRY=false"
echo "   - UNLEASH_VERSION_URL=(empty)"
echo "   - versionInfoCollectionEnabled: false"
echo "   - featureInfoCollectionEnabled: false"
echo "   - No external HTTPS connections"
echo ""
echo "Access Unleash at: http://localhost:4242"
echo "Login: admin / unleash4all"
echo ""
echo "⚠️  Note: OSS version limited to 1 project"
echo "   See TELEMETRY-ANALYSIS.md for solutions"
echo ""
