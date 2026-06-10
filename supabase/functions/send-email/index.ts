const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS_HEADERS });

  try {
    const { to, subject, html } = await req.json();
    if (!to || !subject || !html) {
      return jsonResponse({ error: "Missing required fields: to, subject, html" }, 400);
    }

    const user = Deno.env.get("GOOGLE_SMTP_USER");
    const pass = Deno.env.get("GOOGLE_SMTP_PASS");
    const resendKey = Deno.env.get("RESEND_API_KEY");

    // Prioritise: Resend API (simplest, always works) > Google SMTP
    if (resendKey) {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${resendKey}` },
        body: JSON.stringify({ from: "Transform Health <noreply@transformhealthcoalition.org>", to, subject, html }),
      });
      if (res.ok) return jsonResponse({ ok: true, provider: "Resend" });
    }

    if (user && pass) {
      // Attempt Google SMTP via API-compatible approach or direct SMTP
      return jsonResponse({ error: "SMTP not supported from Supabase runtime. Use RESEND_API_KEY instead." }, 500);
    }

    return jsonResponse({ error: "No email provider configured. Set RESEND_API_KEY in project secrets." }, 500);
  } catch (err) {
    console.error(err);
    return jsonResponse({ error: err.message }, 500);
  }
});
