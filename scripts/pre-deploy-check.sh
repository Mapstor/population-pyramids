#!/bin/bash

# Pre-Deployment Safety Check
# Run this BEFORE deploying to production

set -e

echo "🔍 PRE-DEPLOYMENT SAFETY CHECK"
echo "================================"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

ERRORS=0
WARNINGS=0

# Function to check and report
check() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
        ERRORS=$((ERRORS + 1))
    fi
}

warn() {
    echo -e "${YELLOW}⚠️  $1${NC}"
    WARNINGS=$((WARNINGS + 1))
}

# 1. Check if build succeeds
echo ""
echo "📦 Checking build..."
npm run build > /dev/null 2>&1
check $? "Build successful"

# 2. Check for TypeScript errors
echo ""
echo "📝 Checking TypeScript..."
npx tsc --noEmit > /dev/null 2>&1
check $? "No TypeScript errors"

# 3. Check for console.log statements (shouldn't be in production)
echo ""
echo "🔍 Checking for console.log..."
CONSOLE_COUNT=$(grep -r "console.log" src/ --include="*.tsx" --include="*.ts" | wc -l)
if [ $CONSOLE_COUNT -gt 10 ]; then
    warn "Found $CONSOLE_COUNT console.log statements (consider removing)"
fi

# 4. Check for localhost references
echo ""
echo "🌐 Checking for localhost references..."
LOCALHOST_COUNT=$(grep -r "localhost\|127.0.0.1\|:3000" src/ --include="*.tsx" --include="*.ts" | wc -l)
check $((LOCALHOST_COUNT)) "No hardcoded localhost references"

# 5. Check for TODO comments
echo ""
echo "📋 Checking for TODOs..."
TODO_COUNT=$(grep -r "TODO\|FIXME\|XXX" src/ --include="*.tsx" --include="*.ts" | wc -l)
if [ $TODO_COUNT -gt 0 ]; then
    warn "Found $TODO_COUNT TODO/FIXME comments"
fi

# 6. Check critical files exist
echo ""
echo "📁 Checking critical files..."
[ -f "src/app/page.tsx" ] && echo -e "${GREEN}✅ Homepage exists${NC}" || check 1 "Homepage missing"
[ -f "src/app/sitemap.ts" ] && echo -e "${GREEN}✅ Sitemap exists${NC}" || check 1 "Sitemap missing"
[ -f "public/robots.txt" ] && echo -e "${GREEN}✅ robots.txt exists${NC}" || check 1 "robots.txt missing"
[ -f "src/app/not-found.tsx" ] && echo -e "${GREEN}✅ 404 page exists${NC}" || check 1 "404 page missing"
[ -f "src/app/error.tsx" ] && echo -e "${GREEN}✅ Error page exists${NC}" || check 1 "Error page missing"

# 7. Check data files
echo ""
echo "💾 Checking data files..."
DATA_COUNT=$(ls src/data/countries/*.json 2>/dev/null | wc -l)
if [ $DATA_COUNT -gt 100 ]; then
    echo -e "${GREEN}✅ Country data files found: $DATA_COUNT${NC}"
else
    check 1 "Country data files missing or incomplete"
fi

STATE_COUNT=$(ls src/data/states/*.json 2>/dev/null | wc -l)
if [ $STATE_COUNT -gt 40 ]; then
    echo -e "${GREEN}✅ State data files found: $STATE_COUNT${NC}"
else
    check 1 "State data files missing or incomplete"
fi

# 8. Check environment
echo ""
echo "🔐 Checking environment..."
if [ -f ".env.local" ] || [ -f ".env.production" ]; then
    echo -e "${GREEN}✅ Environment file found${NC}"
else
    warn "No environment file found (may be okay if using platform env vars)"
fi

# 9. Check package.json
echo ""
echo "📦 Checking dependencies..."
node -e "
const pkg = require('./package.json');
if (!pkg.scripts.build) process.exit(1);
if (!pkg.scripts.start) process.exit(1);
" 2>/dev/null
check $? "Build scripts configured"

# 10. Check for large files
echo ""
echo "📏 Checking for large files..."
LARGE_FILES=$(find src public -type f -size +1M 2>/dev/null | wc -l)
if [ $LARGE_FILES -gt 0 ]; then
    warn "Found $LARGE_FILES files larger than 1MB (consider optimization)"
    find src public -type f -size +1M -exec ls -lh {} \; 2>/dev/null | head -5
fi

# 11. Check Git status
echo ""
echo "📝 Checking Git status..."
UNCOMMITTED=$(git status --porcelain | wc -l)
if [ $UNCOMMITTED -gt 0 ]; then
    warn "You have $UNCOMMITTED uncommitted changes"
fi

# 12. Test critical API endpoints
echo ""
echo "🔌 Checking API endpoints..."
# Start server in background for testing
npm run build > /dev/null 2>&1
npm run start > /dev/null 2>&1 &
SERVER_PID=$!
sleep 5

# Test endpoints
curl -f -s "http://localhost:3000/" > /dev/null 2>&1
check $? "Homepage loads"

curl -f -s "http://localhost:3000/api/countries" > /dev/null 2>&1
check $? "Countries API works"

curl -f -s "http://localhost:3000/sitemap.xml" > /dev/null 2>&1
check $? "Sitemap accessible"

# Kill test server
kill $SERVER_PID 2>/dev/null || true

# Summary
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✅ PRE-DEPLOYMENT CHECK PASSED${NC}"
    echo -e "${GREEN}Ready for deployment!${NC}"
else
    echo -e "${RED}❌ PRE-DEPLOYMENT CHECK FAILED${NC}"
    echo -e "${RED}Found $ERRORS critical errors${NC}"
    echo -e "${RED}Fix these issues before deploying!${NC}"
fi

if [ $WARNINGS -gt 0 ]; then
    echo -e "${YELLOW}⚠️  $WARNINGS warnings (non-critical)${NC}"
fi
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

exit $ERRORS