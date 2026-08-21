# The Belongil — Events & Private Dining Dashboard

Same dashboard, running as its own site instead of inside a Claude chat.

Event data is now genuinely shared and editable — add, edit, or delete
events directly on the site, and everyone who opens it sees the same
data. This needs a small database connected to the project (steps below).
A Google Sheets CSV export can still be used as an optional bulk import.

## One-time setup: connect a database

1. Go to your project on vercel.com → **Storage** tab
2. Under **Marketplace Database Providers**, find **Upstash** (Redis) → **Create**
3. Choose the free plan, pick a region, click through to connect it to this project
4. Vercel automatically adds the required environment variables — no manual copying needed
5. Redeploy the project once (Vercel usually does this automatically after connecting storage; if not, go to Deployments → the latest one → **Redeploy**)

Without this step, the site still loads and looks right, but edits won't
save anywhere — the "Add event" and "Edit details" buttons will silently
fail. If that happens, double-check the database is actually connected
in the Storage tab.

## Run it locally first (optional)

```bash
npm install
vercel dev
```

Use `vercel dev` rather than `npm run dev` here — the `/api/events`
endpoint only works through Vercel's own dev server, since it's a
serverless function, not part of the Vite frontend.

## Deploy to Vercel

Same as before — either import the repo through vercel.com, or run
`vercel` from this folder. The `api/events.js` file is picked up
automatically; no extra configuration needed.

## Updating the dashboard later

Ask Claude to edit `src/App.jsx` (or `api/events.js` for the backend)
and push the change — if Claude has push access to this repo via a
GitHub token, it can commit directly; otherwise, paste the updated file
into GitHub's web editor the same way as before.
