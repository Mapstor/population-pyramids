# 🚀 SAFE DEPLOYMENT GUIDE - ZERO DOWNTIME

## ⚠️ CRITICAL: FOR LIVE PRODUCTION SITE

This guide ensures you can safely deploy new features without losing traffic or breaking your live site.

## 🔥 EMERGENCY CONTACTS
- **If something breaks**: Immediately run `scripts/rollback.sh`
- **Vercel rollback**: `vercel rollback` (instant)
- **Git rollback**: Restore from backup branch

---

## 🎯 PHASE 1: PRE-DEPLOYMENT SAFETY

### Step 1: Create Complete Backup
```bash
# Run automated backup (CRITICAL!)
./scripts/backup.sh

# This creates:
# - Git backup branch
# - File system backup
# - Rollback scripts
# - Recovery instructions
```

### Step 2: Run Safety Checks
```bash
# Run comprehensive pre-deployment check
./scripts/pre-deploy-check.sh

# Must pass with 0 errors before proceeding
# Fix any critical issues found
```

### Step 3: Record Current Metrics
Document these BEFORE deployment:
- Current traffic: _______ visitors/hour
- Page load time: _______ seconds
- Error rate: _______ %
- Core Web Vitals: _______
- Top 5 pages: _______

---

## 🧪 PHASE 2: STAGING DEPLOYMENT

### Step 1: Deploy to Staging
```bash
# Deploy to staging environment (NOT production)
vercel deploy

# You'll get a preview URL like:
# https://population-pyramids-abc123.vercel.app
```

### Step 2: Test Staging Thoroughly
**Critical Tests** (DO NOT SKIP):
- [ ] Homepage loads correctly
- [ ] All existing country pages work (test 5-10)
- [ ] All existing state pages work (test 5-10)
- [ ] Search functionality works
- [ ] API endpoints respond
- [ ] Mobile view works
- [ ] No 404s on current URLs
- [ ] Page load times acceptable
- [ ] No console errors

**New Features Tests**:
- [ ] Blog page loads
- [ ] Blog articles display correctly
- [ ] SEO meta tags present
- [ ] Sitemap accessible
- [ ] Social sharing works

### Step 3: Performance Testing
```bash
# Test page load times
curl -w "@curl-format.txt" -o /dev/null -s "https://staging-url/"

# Check for memory leaks
# Monitor for 30+ minutes
```

---

## 🚀 PHASE 3: PRODUCTION DEPLOYMENT

### Step 1: Choose Deployment Window
**Best Times**:
- Low traffic hours (check your analytics)
- Weekdays (easier to monitor/fix)
- When you can monitor for 2+ hours after

**Avoid**:
- Friday afternoons
- High traffic periods
- When you can't monitor

### Step 2: Gradual Deployment (Safest)
```bash
# Option A: Blue-Green deployment (recommended)
# Deploy to production but don't switch traffic yet
vercel deploy --prod --no-promote

# Test the production deployment
curl -f "https://your-preview-url/health"

# If tests pass, promote to live
vercel promote
```

```bash
# Option B: Instant deployment (higher risk)
vercel deploy --prod
```

### Step 3: Real-Time Monitoring
**First 5 minutes** (CRITICAL):
- Watch error rates
- Check response times
- Verify key pages load
- Monitor user behavior

**First 30 minutes**:
- Check analytics for traffic drops
- Monitor server performance
- Verify all functionality works
- Watch for user complaints

**First 24 hours**:
- Monitor SEO rankings
- Check Core Web Vitals
- Verify traffic patterns normal
- Ensure no functionality regressions

---

## 🚨 EMERGENCY PROCEDURES

### If Error Rate Spikes (>2%)
```bash
# IMMEDIATE rollback
vercel rollback

# OR use backup rollback script
./backups/backup-[timestamp]/rollback.sh
```

### If Site is Down
```bash
# 1. Immediate rollback
vercel rollback

# 2. Check status
curl -I https://populationpyramids.org

# 3. If still down, restore from backup
git checkout backup-[timestamp]
vercel deploy --prod
```

### If Traffic Drops >20%
1. Check if deployment caused issues
2. Verify Google Search Console
3. Check for 404 errors
4. Consider rollback if persistent

---

## 📊 SUCCESS METRICS

**Deployment is SUCCESSFUL if**:
- [ ] Zero downtime
- [ ] Error rate unchanged or lower
- [ ] Page load times same or better
- [ ] Traffic patterns normal
- [ ] All existing functionality works
- [ ] New features work as expected
- [ ] No SEO ranking drops (24h check)

**Deployment FAILED if**:
- Any downtime occurred
- Error rate increased >1%
- Page load times increased >2s
- Traffic dropped >10%
- Core functionality broken
- Major user complaints

---

## 🔧 RECOVERY PROCEDURES

### Quick Rollback (< 1 minute)
```bash
vercel rollback
```

### Full Recovery (< 5 minutes)
```bash
# 1. Rollback deployment
vercel rollback

# 2. Restore from backup branch
git checkout backup-[timestamp]

# 3. Redeploy known good version
vercel deploy --prod

# 4. Verify functionality
curl -f https://populationpyramids.org
```

### Nuclear Option (< 10 minutes)
```bash
# If all else fails, restore from file backup
cd ../
tar -xzf population-pyramids-backups/backup-[timestamp]/code-backup.tar.gz
cd population-pyramids
vercel deploy --prod
```

---

## 📋 DEPLOYMENT CHECKLIST

### Before Deployment
- [ ] Backup created and verified
- [ ] Pre-deployment checks passed
- [ ] Staging tested thoroughly
- [ ] Team notified of deployment
- [ ] Low traffic period chosen
- [ ] Monitor tools ready

### During Deployment
- [ ] Watch deployment logs
- [ ] Monitor error rates
- [ ] Check response times
- [ ] Verify critical pages
- [ ] Ready to rollback

### After Deployment (30 min)
- [ ] All pages working
- [ ] Error rates normal
- [ ] Response times good
- [ ] Traffic patterns normal
- [ ] Functionality verified
- [ ] Users not complaining

### After Deployment (24 hours)
- [ ] SEO rankings stable
- [ ] Analytics normal
- [ ] No performance regression
- [ ] Core Web Vitals maintained
- [ ] User satisfaction maintained

---

## 🎯 FINAL SAFETY REMINDERS

1. **NEVER deploy on Friday afternoon**
2. **ALWAYS test staging first**
3. **MONITOR for at least 2 hours post-deployment**
4. **Have rollback plan ready**
5. **When in doubt, don't deploy - wait and test more**

Remember: It's better to delay deployment than break production with live traffic!

---

## 📞 Support Contacts
- **Vercel Support**: support@vercel.com
- **Emergency Rollback**: Run `vercel rollback`
- **Backup Recovery**: Check `DEPLOYMENT_SAFETY_PLAN.md`