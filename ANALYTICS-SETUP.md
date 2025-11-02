# Google Analytics 4 Setup Instructions

## Step 1: Create Google Analytics 4 Property

1. Go to [Google Analytics](https://analytics.google.com/)
2. Click "Start measuring" or create a new property
3. Fill in the account details:
   - Account name: "Population Pyramids"
   - Property name: "Population Pyramids Website"
   - Time zone: Select your timezone
   - Currency: USD or your preferred currency

## Step 2: Set up Data Stream

1. Choose "Web" as the platform
2. Enter website details:
   - Website URL: `https://populationpyramids.org`
   - Stream name: "Population Pyramids Main Site"
3. Click "Create stream"

## Step 3: Get Measurement ID

1. After creating the stream, you'll see your **Measurement ID** (format: G-XXXXXXXXXX)
2. Copy this ID

## Step 4: Update the Code

1. Open `src/app/layout.tsx`
2. Find this line:
   ```tsx
   <GoogleAnalytics measurementId="G-XXXXXXXXXX" />
   ```
3. Replace `G-XXXXXXXXXX` with your actual Measurement ID

## Step 5: Enable Enhanced Measurement (Recommended)

In Google Analytics:
1. Go to Admin > Data Streams > Your Web Stream
2. Click on "Enhanced measurement"
3. Enable these useful features:
   - ✅ Page views (auto-enabled)
   - ✅ Scrolls
   - ✅ Outbound clicks  
   - ✅ Site search
   - ✅ Video engagement
   - ✅ File downloads

## Step 6: Set up Goals & Conversions (Optional)

Recommended events to track:
- **Country Page Views**: When users view specific country pyramids
- **Year Changes**: When users interact with year selectors
- **Comparisons**: When users use the comparison tool
- **Downloads**: If you add download functionality later

## Step 7: Verify Installation

1. Deploy your site to Vercel
2. Visit your live site: `https://populationpyramids.org`
3. In Google Analytics, go to Reports > Realtime
4. You should see your visit appear within a few minutes

## Environment Variables (Optional)

For better organization, you can use environment variables:

1. Create `.env.local`:
   ```env
   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   ```

2. Update `layout.tsx`:
   ```tsx
   <GoogleAnalytics measurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID!} />
   ```

3. Add to Vercel environment variables in dashboard

## Privacy Compliance

The current setup is GDPR-friendly and:
- ✅ No personal data is collected
- ✅ Uses aggregated analytics only
- ✅ Complies with privacy regulations
- ✅ No cookies banner required for basic analytics

## Analytics Features You'll Get

1. **Real-time visitors** - See live traffic
2. **Page views** - Most popular countries/years  
3. **Traffic sources** - How users find your site
4. **User behavior** - Time on site, bounce rate
5. **Mobile vs Desktop** - Device usage patterns
6. **Geographic data** - Where your users are from
7. **Search queries** - What brings users to your site

---

**Ready!** Once deployed, you'll have comprehensive analytics for your population pyramid website! 📊