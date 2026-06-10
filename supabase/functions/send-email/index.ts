const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function respond(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
  });
}

// Base64url encode (no padding)
function b64url(s: string): string {
  return btoa(s).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

// Convert PEM private key to raw bytes for Web Crypto
function pemToBinary(pem: string): ArrayBuffer {
  const b64 = pem
    .replace(/-----BEGIN PRIVATE KEY-----/g, "")
    .replace(/-----END PRIVATE KEY-----/g, "")
    .replace(/\s/g, "");
  const bin = atob(b64);
  const buf = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i);
  return buf.buffer;
}

async function signRsa256(payload: string, privateKeyPem: string): Promise<string> {
  const keyData = pemToBinary(privateKeyPem);
  const key = await crypto.subtle.importKey(
    "pkcs8",
    keyData,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign(
    { name: "RSASSA-PKCS1-v1_5" },
    key,
    new TextEncoder().encode(payload),
  );
  return b64url(String.fromCharCode(...new Uint8Array(sig)));
}

async function getGoogleAccessToken(
  serviceAccountEmail: string,
  privateKeyPem: string,
  impersonateUser: string,
): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header = b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const payload = b64url(
    JSON.stringify({
      iss: serviceAccountEmail,
      scope: "https://www.googleapis.com/auth/gmail.send",
      aud: "https://oauth2.googleapis.com/token",
      exp: now + 3600,
      iat: now,
      sub: impersonateUser,
    }),
  );
  const signature = await signRsa256(`${header}.${payload}`, privateKeyPem);
  const assertion = `${header}.${payload}.${signature}`;

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`Google auth failed: ${JSON.stringify(data)}`);
  return data.access_token;
}

// Build RFC 2822 raw email and base64url encode it
function buildRawEmail(from: string, to: string, subject: string, html: string): string {
  const email = [
    `From: ${from}`,
    `To: ${to}`,
    `Subject: ${subject}`,
    "MIME-Version: 1.0",
    "Content-Type: text/html; charset=UTF-8",
    "",
    html,
  ].join("\r\n");
  return b64url(email);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS_HEADERS });

  try {
    const { to, subject, html } = await req.json();
    if (!to || !subject || !html) return respond({ error: "Missing fields" }, 400);

    // --- Google Gmail API (service account) ---
    const saEmail = Deno.env.get("GOOGLE_SA_EMAIL");
    const saKey = Deno.env.get("GOOGLE_SA_PRIVATE_KEY");
    const impersonate = Deno.env.get("GOOGLE_IMPERSONATE_USER") || Deno.env.get("GOOGLE_SMTP_USER");

    if (saEmail && saKey && impersonate) {
      const token = await getGoogleAccessToken(saEmail, saKey, impersonate);
      const raw = buildRawEmail(impersonate, to, subject, html);
      const res = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ raw }),
      });
      if (res.ok) return respond({ ok: true, provider: "Gmail API" });
      const errData = await res.json();
      return respond({ error: `Gmail API: ${JSON.stringify(errData)}` }, 500);
    }

    // --- Fallback: Resend ---
    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (resendKey) {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${resendKey}` },
        body: JSON.stringify({
          from: "Transform Health <noreply@transformhealthcoalition.org>",
          to,
          subject,
          html,
        }),
      });
      if (res.ok) return respond({ ok: true, provider: "Resend" });
      const data = await res.json();
      return respond({ error: `Resend: ${JSON.stringify(data)}` }, 500);
    }

    return respond({
      error:
        "No email provider configured. Set GOOGLE_SA_EMAIL + GOOGLE_SA_PRIVATE_KEY + GOOGLE_SMTP_USER, or RESEND_API_KEY in project secrets.",
    }, 500);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(err);
    return respond({ error: msg }, 500);
  }
});
