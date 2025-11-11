# 🚨 DEPLOYMENT SAFETY PLAN - CRITICAL FOR LIVE SITE

## ⚠️ CURRENT SITUATION
- **Live Site**: Currently receiving traffic
- **Risk Level**: HIGH - Must preserve current functionality
- **Strategy**: Blue-Green deployment with instant rollback capability

## 📦 STEP 1: CREATE COMPLETE BACKUPS

### 1.1 Backup Current Production Code
```bash
# Create timestamped backup branch
git checkout -b backup-production-$(date +%Y%m%d-%H%M%S)
git add -A
git commit -m "BACKUP: Production state before blog update deployment"
git push origin backup-production-$(date +%Y%m%d-%H%M%S)

# Create a local archive
tar -czf ../production-backup-$(date +%Y%m%d).tar.gz .
```

### 1.2 Backup Current Deployment
```bash
# If using Vercel, create production alias
vercel alias production-backup.populationpyramids.org

# Download current deployment
vercel pull --environment=production
```

### 1.3 Database/Data Backup
```bash
# Backup all data files
cp -r src/data ../data-backup-$(date +%Y%m%d)
cp -r public ../public-backup-$(date +%Y%m%d)
```

## 🧪 STEP 2: STAGING DEPLOYMENT TEST

### 2.1 Create Staging Branch
```bash
git checkout -b staging-deployment
git add -A
git commit -m "Staging: Blog features and SEO updates"
```

### 2.2 Deploy to Staging URL
```bash
# Deploy to staging (not production!)
vercel deploy --no-prod
# This gives you a preview URL to test

# Or use a subdomain
vercel alias staging.populationpyramids.org
```

### 2.3 Staging Checklist
- [ ] All existing pages work
- [ ] No 404s on current URLs
- [ ] API endpoints responding
- [ ] Population pyramids loading
- [ ] Search functionality works
- [ ] Mobile responsive
- [ ] Load time acceptable
- [ ] No console errors

## 🔄 STEP 3: ROLLBACK PREPARATION

### 3.1 Create Instant Rollback Script
```bash
#!/bin/bash
# save as rollback.sh

echo "🚨 EMERGENCY ROLLBACK INITIATED"

# Option 1: Vercel rollback (fastest)
vercel rollback

# Option 2: Git revert
git revert HEAD --no-edit
git push origin main

# Option 3: Redeploy last working version
vercel deploy [last-working-deployment-url] --prod

echo "✅ Rollback complete"
```

### 3.2 Save Critical URLs
```txt
LAST_WORKING_DEPLOYMENT=https://population-pyramids-xxxxx.vercel.app
BACKUP_BRANCH=backup-production-[timestamp]
PREVIOUS_COMMIT=[commit-hash]
```

## 🚦 STEP 4: GRADUAL DEPLOYMENT

### 4.1 Canary Deployment (Recommended)
```bash
# Deploy to 10% of traffic first
vercel --prod --regions=sfo1 --scale=0.1

# Monitor for 1 hour
# If stable, increase to 50%
vercel --prod --scale=0.5

# Monitor for 2 hours
# If stable, go to 100%
vercel --prod --scale=1.0
```

### 4.2 Feature Flags (If Available)
```javascript
// Add feature flags to gradually enable features
const FEATURES = {
  NEW_BLOG: process.env.ENABLE_NEW_BLOG === 'true',
  SEO_UPDATES: process.env.ENABLE_SEO === 'true',
};
```

## 📊 STEP 5: MONITORING SETUP

### 5.1 Pre-Deployment Metrics
Record current metrics:
- [ ] Current traffic levels: _______
- [ ] Page load times: _______
- [ ] Error rate: _______
- [ ] Core Web Vitals: _______
- [ ] Conversion rate: _______

### 5.2 Real-Time Monitoring
```bash
# Monitor logs during deployment
vercel logs --follow

# Watch error rates
# Set up alerts for:
# - 404 increase > 5%
# - 500 errors > 1%
# - Load time increase > 2s
```

### 5.3 Health Check Endpoints
```javascript
// Add to pages/api/health.ts
export default function handler(req, res) {
  res.status(200).json({
    status: 'healthy',
    version: process.env.DEPLOYMENT_VERSION,
    timestamp: new Date().toISOString()
  });
}
```

## ✅ STEP 6: DEPLOYMENT CHECKLIST

### Pre-Deployment
- [ ] Full backup created
- [ ] Rollback script tested
- [ ] Staging deployment verified
- [ ] Team notified of deployment window
- [ ] Traffic patterns analyzed (deploy during low traffic)

### During Deployment
- [ ] Monitor error rates
- [ ] Watch server response times
- [ ] Check memory/CPU usage
- [ ] Verify critical user paths
- [ ] Test on multiple devices

### Post-Deployment (First 30 minutes)
- [ ] All pages loading
- [ ] No 404 spikes
- [ ] API responses normal
- [ ] Search working
- [ ] Analytics tracking
- [ ] No console errors
- [ ] User feedback channels monitored

### Post-Deployment (First 24 hours)
- [ ] SEO rankings stable
- [ ] Traffic levels normal
- [ ] No increase in bounce rate
- [ ] Core Web Vitals maintained
- [ ] No user complaints

## 🔴 EMERGENCY PROCEDURES

### If Things Go Wrong:
1. **IMMEDIATE** (< 1 minute):
   ```bash
   vercel rollback  # Instant rollback
   ```

2. **NOTIFY**:
   - Team members
   - Monitoring alerts
   - Status page update

3. **INVESTIGATE**:
   - Check error logs
   - Review recent changes
   - Test in isolation

4. **FIX & RETRY**:
   - Fix issues in staging
   - Re-test thoroughly
   - Schedule new deployment window

## 📝 DEPLOYMENT COMMANDS

### Safe Deployment Sequence:
```bash
# 1. Create backup
git checkout -b backup-$(date +%Y%m%d-%H%M%S)
git add -A
git commit -m "Backup before deployment"
git push origin backup-$(date +%Y%m%d-%H%M%S)

# 2. Test build
npm run build

# 3. Deploy to staging
vercel deploy

# 4. Test staging URL
# [Run through checklist]

# 5. Deploy to production (with monitoring)
vercel deploy --prod

# 6. OR use safer gradual rollout
vercel deploy --prod --scale=0.1  # 10% traffic
# wait and monitor...
vercel deploy --prod --scale=0.5  # 50% traffic
# wait and monitor...
vercel deploy --prod --scale=1.0  # 100% traffic
```

## 🎯 SUCCESS CRITERIA
- Zero downtime
- No increase in error rate
- Page load times maintained or improved
- All existing functionality preserved
- New features working as expected
- SEO rankings maintained

## 📱 CONTACT FOR EMERGENCIES
- Primary: [Your contact]
- Backup: [Team member]
- Vercel Support: support@vercel.com
- Status Page: status.populationpyramids.org

---

**REMEMBER**: It's better to delay deployment than to break production. If anything seems off during staging tests, STOP and investigate.