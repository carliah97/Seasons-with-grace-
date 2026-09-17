# Seasons With Grace — 48-Hour Launch Plan

This package is intentionally smaller than the full V8 business platform. It is the public-facing version to put online first and send paid-ad traffic to.

## BEFORE YOU PUBLISH — REQUIRED

Open `launch-config.js` and enter:

1. `phone`
2. `smsNumber`
3. `email`
4. `leadEndpoint`
5. `websiteUrl`

Do not run paid ads until the quote form sends a real test lead to you.

## Fast lead setup

A fast option is a hosted form endpoint such as Formspree.

1. Create the form in your own account.
2. Copy its endpoint.
3. Paste it into `leadEndpoint` in `launch-config.js`.
4. Submit a real test request from your phone.
5. Confirm you receive it.
6. Submit another test using cellular data, not just Wi-Fi.

The website sends the form as JSON and includes:
- customer/contact details
- route
- pet details
- service type
- care notes
- UTM source/medium/campaign/content/term
- gclid / fbclid when present
- landing page
- referrer
- unique lead reference

## DAY 1 — Website + leads

### 1. Final contact details
Set the phone, text number and business email in `launch-config.js`.

### 2. Connect lead delivery
Set and test `leadEndpoint`.

### 3. Real business proof
Add only information you can verify:
- actual business phone/email
- real transport photos you have permission to publish
- real customer reviews you have permission to publish
- accurate insurance / registration / certification wording
- actual cancellation/deposit terms

Do not publish the old demo tracking, fake reviews, or unfinished customer/driver/admin pages.

### 4. Domain + hosting
Recommended fast path:
- deploy this folder to Vercel
- connect your domain
- make sure HTTPS is active
- replace `YOURDOMAIN.com` in `robots.txt` and `sitemap.xml`

### 5. Test mobile
Test:
- iPhone/Safari
- Android/Chrome if available
- desktop Chrome/Edge
- quote form
- click-to-call
- click-to-text
- privacy/terms
- thank-you page

## DAY 2 — Advertising setup

### Meta / Instagram
Add your Meta Pixel ID to `launch-config.js` after the pixel is created.

The site supports:
- PageView
- Lead
- Call click
- Text click
- Quote click

### Google
Add:
- `ga4MeasurementId`
- `googleAdsId`
- `googleAdsConversionLabel`

The site can fire:
- `generate_lead`
- Google Ads conversion
- call / quote click events

Analytics/ad scripts are not loaded until a visitor accepts analytics.

## Best ad URL

Send paid traffic to:

`https://YOURDOMAIN.com/quote.html`

That page removes most distractions and focuses on the quote request.

Use your main homepage for:
- Facebook profile link
- Google Business Profile
- organic sharing
- customer research

Use `quote.html` for:
- Facebook/Instagram ads
- Google Search ads
- breeder/rescue outreach campaigns

## After leads start coming in

For the first launch, handle:
Quote request → manually review route → contact customer → give price/deposit → confirm trip.

This avoids waiting on the full customer portal / Stripe / dispatch backend before advertising.

Then connect the full V8 admin/customer/driver platform in phases without stopping lead generation.

## Legal / advertising caution

The included Privacy Policy and Website Terms are starter drafts, not legal advice. Have counsel review the final policies and transport agreement.

Only advertise claims you can substantiate. Do not advertise credentials, insurance limits, guaranteed delivery times, review ratings, or safety claims unless they are accurate and documented.
