# The Belongil — Events & Private Dining Dashboard

A standalone version of the events sales dashboard — same design and
charts as the one in Claude, running as its own website instead of
inside a chat.

Data comes in via CSV upload (File → Download → CSV from your Google
Sheet, then upload it in the dashboard). No live sync, no API keys —
just a reliable ~10-second refresh whenever you want current numbers.

## Run it locally first (recommended)

```bash
npm install
npm run dev
```

Open the URL it prints (usually http://localhost:5173). Click
**"Upload updated CSV"**, choose a CSV exported from your sheet, and
confirm it loads correctly before deploying.

### About the "Enquiries this week" card

This counts enquiries by when they were *received*, not the event
date. It needs a **Date Received** column in your sheet (any column
with "received" in the header) — without it, the card shows "—" and
a reminder in its label.

## Deploy to Vercel (free)

**Option A — no command line, using GitHub:**
1. Create a new GitHub repo and push this folder to it.
2. Go to vercel.com, sign in, click **Add New → Project**.
3. Import that repo. Vercel auto-detects Vite — leave settings as default.
4. Click **Deploy**. You'll get a live URL in about a minute.

**Option B — command line:**
```bash
npm install -g vercel
vercel
```
Follow the prompts (defaults are fine). It deploys and gives you a URL
immediately.

## Updating the dashboard later

If you want to tweak anything (colors, columns, charts), just ask
Claude to edit `src/App.jsx` and re-deploy — `vercel` (or a new git
push, if using GitHub) publishes the update.
