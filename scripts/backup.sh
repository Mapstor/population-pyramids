#!/bin/bash

# Backup Script for Population Pyramids
# Run this BEFORE any deployment

set -e  # Exit on any error

echo "🔵 Starting backup process..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Create backup directory
BACKUP_DIR="../population-pyramids-backups"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
BACKUP_PATH="$BACKUP_DIR/backup-$TIMESTAMP"

mkdir -p "$BACKUP_PATH"

echo -e "${YELLOW}📁 Creating backup in: $BACKUP_PATH${NC}"

# 1. Git backup
echo "📝 Creating git backup..."
BRANCH_NAME="backup-$TIMESTAMP"
git checkout -b "$BRANCH_NAME"
git add -A
git commit -m "BACKUP: Automated backup before deployment - $TIMESTAMP" || echo "No changes to commit"
echo -e "${GREEN}✅ Git backup branch created: $BRANCH_NAME${NC}"

# 2. File system backup
echo "📦 Creating file system backup..."
tar -czf "$BACKUP_PATH/code-backup.tar.gz" \
  --exclude=node_modules \
  --exclude=.next \
  --exclude=.git \
  .
echo -e "${GREEN}✅ Code backup created${NC}"

# 3. Data backup
echo "💾 Backing up data files..."
cp -r src/data "$BACKUP_PATH/data-backup"
cp -r public "$BACKUP_PATH/public-backup" 2>/dev/null || echo "No public files to backup"
echo -e "${GREEN}✅ Data files backed up${NC}"

# 4. Environment backup
echo "🔐 Backing up environment..."
cp .env* "$BACKUP_PATH/" 2>/dev/null || echo "No env files to backup"
cp package.json "$BACKUP_PATH/"
cp package-lock.json "$BACKUP_PATH/"
echo -e "${GREEN}✅ Environment backed up${NC}"

# 5. Create restore script
cat > "$BACKUP_PATH/restore.sh" << 'EOF'
#!/bin/bash
echo "🔄 Restoring from backup..."
tar -xzf code-backup.tar.gz -C /path/to/project/
cp -r data-backup/* /path/to/project/src/data/
cp -r public-backup/* /path/to/project/public/
echo "✅ Restore complete"
EOF
chmod +x "$BACKUP_PATH/restore.sh"

# 6. Create backup manifest
cat > "$BACKUP_PATH/manifest.json" << EOF
{
  "timestamp": "$TIMESTAMP",
  "branch": "$BRANCH_NAME",
  "node_version": "$(node -v)",
  "npm_version": "$(npm -v)",
  "created_by": "$(whoami)",
  "created_at": "$(date)",
  "git_commit": "$(git rev-parse HEAD)"
}
EOF

echo -e "${GREEN}✅ Backup manifest created${NC}"

# 7. Create deployment rollback script
cat > "$BACKUP_PATH/rollback.sh" << EOF
#!/bin/bash
echo "🚨 EMERGENCY ROLLBACK"
echo "Rolling back to backup: $TIMESTAMP"

# Option 1: Git rollback
git checkout $BRANCH_NAME

# Option 2: Vercel rollback (if using Vercel)
# vercel rollback

echo "✅ Rollback complete"
EOF
chmod +x "$BACKUP_PATH/rollback.sh"

# Summary
echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ BACKUP COMPLETE${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "📍 Backup location: $BACKUP_PATH"
echo "🔧 Git branch: $BRANCH_NAME"
echo "📝 Manifest: $BACKUP_PATH/manifest.json"
echo "🔄 Rollback script: $BACKUP_PATH/rollback.sh"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Push backup branch: git push origin $BRANCH_NAME"
echo "2. Test deployment on staging"
echo "3. If issues occur, run: $BACKUP_PATH/rollback.sh"
echo ""