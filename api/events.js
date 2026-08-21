// Shared event storage for the dashboard, backed by a Redis-compatible
// database provisioned through the Vercel Marketplace (Storage tab -> Upstash).
//
// This makes edits genuinely shared across everyone who opens the site —
// unlike localStorage, which is private to each visitor's own browser.
//
// Reads env vars under either naming convention Vercel/Upstash may use,
// since this has changed over time.

const REST_URL =
  process.env.UPSTASH_REDIS_REST_URL ||
  process.env.KV_REST_API_URL ||
  process.env.REDIS_URL;

const REST_TOKEN =
  process.env.UPSTASH_REDIS_REST_TOKEN ||
  process.env.KV_REST_API_TOKEN;

const STORAGE_KEY = "belongil-events-data";

export default async function handler(req, res) {
  if (!REST_URL || !REST_TOKEN) {
    res.status(500).json({
      error:
        "No database connected. In your Vercel project, go to Storage -> Marketplace Database Providers, add Upstash (Redis), and redeploy.",
    });
    return;
  }

  try {
    if (req.method === "GET") {
      const r = await fetch(`${REST_URL}/get/${STORAGE_KEY}`, {
        headers: { Authorization: `Bearer ${REST_TOKEN}` },
      });
      if (!r.ok) throw new Error(`Database read failed (${r.status})`);
      const data = await r.json();
      const events = data.result ? JSON.parse(data.result) : null;
      res.status(200).json({ events });
      return;
    }

    if (req.method === "POST") {
      const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
      const events = Array.isArray(body?.events) ? body.events : [];
      const r = await fetch(`${REST_URL}/set/${STORAGE_KEY}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${REST_TOKEN}` },
        body: JSON.stringify(events),
      });
      if (!r.ok) throw new Error(`Database write failed (${r.status})`);
      res.status(200).json({ ok: true });
      return;
    }

    res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    res.status(500).json({ error: err.message || "Unknown error" });
  }
}
