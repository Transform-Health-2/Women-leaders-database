// Handles all public self-service operations — no admin auth required.
// action: "generate"   → issue HMAC-signed magic link token
// action: "verify"     → verify magic link token signature + expiry
// action: "send-email" → send email via Google Apps Script (rate-limited, recipient-validated)

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "https://tich-labs.github.io",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function respond(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
  });
}

async function hmacSign(secret: string, data: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));
  return btoa(String.fromCharCode(...new Uint8Array(sig)));
}

// In-memory rate limit: max 5 send-email calls per IP per 60 seconds.
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip) ?? { count: 0, resetAt: now + 60_000 };
  if (now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60_000 });
    return false;
  }
  if (entry.count >= 5) return true;
  rateLimitMap.set(ip, { ...entry, count: entry.count + 1 });
  return false;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS_HEADERS });

  try {
    const body = await req.json();
    const { action } = body;

    // ── Token: generate ──────────────────────────────────────────────────────
    if (action === "generate") {
      const secret = Deno.env.get("MAGIC_LINK_SECRET");
      if (!secret) return respond({ error: "server misconfigured" }, 500);

      const { leaderId, mode } = body;
      if (!leaderId || !mode) return respond({ error: "missing fields" }, 400);
      if (!["edit", "delete"].includes(mode)) return respond({ error: "invalid mode" }, 400);

      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      const check = await fetch(
        `${supabaseUrl}/rest/v1/leaders?id=eq.${encodeURIComponent(leaderId)}&select=id`,
        { headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` } },
      );
      const rows: { id: string }[] = await check.json();
      if (!rows?.length) return respond({ error: "leader not found" }, 404);

      // 48-hour expiry matches the "Expires in 48 hours" copy in the email
      const expires = Date.now() + 1000 * 60 * 60 * 48;
      const payload = `${leaderId}:${mode}:${expires}`;
      const sig = await hmacSign(secret, payload);
      const token = btoa(JSON.stringify({ leaderId, mode, expires, sig }));

      return respond({ token });
    }

    // ── Token: verify ────────────────────────────────────────────────────────
    if (action === "verify") {
      const secret = Deno.env.get("MAGIC_LINK_SECRET");
      if (!secret) return respond({ error: "server misconfigured" }, 500);

      const { token } = body;
      if (!token) return respond({ error: "missing token" }, 400);

      let parsed: { leaderId: string; mode: string; expires: number; sig: string };
      try {
        parsed = JSON.parse(atob(token));
      } catch {
        return respond({ error: "invalid token" }, 401);
      }

      const { leaderId, mode, expires, sig } = parsed;
      if (!leaderId || !mode || !expires || !sig) {
        return respond({ error: "malformed token" }, 401);
      }
      if (Date.now() > expires) return respond({ error: "token expired" }, 401);

      const expectedSig = await hmacSign(secret, `${leaderId}:${mode}:${expires}`);
      if (expectedSig !== sig) return respond({ error: "invalid signature" }, 401);

      return respond({ ok: true, leaderId, mode });
    }

    // ── Email: send ──────────────────────────────────────────────────────────
    if (action === "send-email") {
      const ip = req.headers.get("x-forwarded-for") ?? "unknown";
      if (isRateLimited(ip)) return respond({ error: "Rate limit exceeded" }, 429);

      const { to, cc, subject, html } = body;
      if (!to || !subject || !html) return respond({ error: "Missing fields" }, 400);

      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      const adminNotifyEmail = Deno.env.get("ADMIN_NOTIFY_EMAIL") ?? "";

      if (to !== adminNotifyEmail) {
        const res = await fetch(
          `${supabaseUrl}/rest/v1/leaders?leader_email=eq.${encodeURIComponent(to)}&select=id&limit=1`,
          { headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` } },
        );
        const rows: { id: string }[] = await res.json();
        if (!rows?.length) return respond({ error: "Recipient not authorised" }, 403);
      }

      const appsScriptUrl = Deno.env.get("APPS_SCRIPT_URL")!;
      const res = await fetch(appsScriptUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "sendRawEmail", to, cc: cc || "", subject, htmlBody: html }),
      });

      const text = await res.text();
      let data: { ok?: boolean; error?: string };
      try { data = JSON.parse(text); } catch { data = { ok: false, error: text }; }

      if (res.ok && data.ok) return respond({ ok: true, provider: "Google Apps Script" });
      return respond({ error: `Apps Script: ${JSON.stringify(data)}` }, 500);
    }

    return respond({ error: "unknown action" }, 400);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("self-service error:", msg);
    return respond({ error: msg }, 500);
  }
});
