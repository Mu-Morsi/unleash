#!/bin/bash

# INGKA Fork - OSS Restrictions Removal Verification Script
# This script verifies that all OSS restrictions have been properly removed

echo "=================================================="
echo "OSS Restrictions Removal Verification"
echo "=================================================="
echo ""

FAILED=0

# Check 1: Verify resolveIsOss always returns false
echo "[1/6] Checking resolveIsOss() function..."
if grep -q "// INGKA Fork: Always return false" src/lib/create-config.ts && \
   grep -q "return false;" src/lib/create-config.ts; then
    echo "✅ resolveIsOss() correctly returns false"
else
    echo "❌ resolveIsOss() not properly modified"
    FAILED=1
fi
echo ""

# Check 2: Verify RBAC middleware has no OSS restrictions
echo "[2/6] Checking RBAC middleware..."
if grep -q "// INGKA Fork: OSS restrictions removed" src/lib/middleware/rbac-middleware.ts; then
    echo "✅ RBAC middleware OSS restrictions removed"
else
    echo "❌ RBAC middleware still has OSS restrictions"
    FAILED=1
fi
echo ""

# Check 3: Verify project store has no default project filter
echo "[3/6] Checking project store..."
if grep -q "// INGKA Fork: OSS restriction removed - show all projects" src/lib/features/project/project-store.ts; then
    echo "✅ Project store filter removed"
else
    echo "❌ Project store still has default project filter"
    FAILED=1
fi
echo ""

# Check 4: Verify environment store has no filters
echo "[4/6] Checking environment store..."
OSS_FILTER_COUNT=$(grep -c "// INGKA Fork: OSS" src/lib/features/project-environments/environment-store.ts)
if [ "$OSS_FILTER_COUNT" -eq 3 ]; then
    echo "✅ Environment store filters removed (3 locations)"
else
    echo "❌ Environment store filters not completely removed (found $OSS_FILTER_COUNT, expected 3)"
    FAILED=1
fi
echo ""

# Check 5: Verify feature environment store
echo "[5/6] Checking feature environment store..."
if grep -q "// INGKA Fork: Filtering removed - allow all environments" src/lib/db/feature-environment-store.ts; then
    echo "✅ Feature environment store filter removed"
else
    echo "❌ Feature environment store still has filters"
    FAILED=1
fi
echo ""

# Check 6: Verify frontend hook
echo "[6/6] Checking frontend isOss() hook..."
if grep -q "// INGKA Fork: Always return false (unlimited projects/environments)" frontend/src/hooks/api/getters/useUiConfig/useUiConfig.ts; then
    echo "✅ Frontend isOss() hook returns false"
else
    echo "❌ Frontend isOss() hook not properly modified"
    FAILED=1
fi
echo ""

# Summary
echo "=================================================="
if [ $FAILED -eq 0 ]; then
    echo "✅ ALL CHECKS PASSED"
    echo ""
    echo "OSS restrictions have been successfully removed."
    echo "You can now create unlimited projects and environments."
    exit 0
else
    echo "❌ SOME CHECKS FAILED"
    echo ""
    echo "Please review the failed checks above."
    exit 1
fi
