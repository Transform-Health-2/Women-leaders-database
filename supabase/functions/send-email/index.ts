const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function timeout<T>(p: Promise<T>, ms: number): Promise<T> {
  return Promise.race([p, new Promise<never>((_, reject) => setTimeout(() => reject(new Error("timeout")), ms))]);
}

function respond(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS_HEADERS });

  try {
    const { to, subject, html } = await req.json();
    if (!to || !subject || !html) return respond({ error: "Missing fields" }, 400);

    const smtpUser = Deno.env.get("GOOGLE_SMTP_USER");
    const smtpPass = Deno.env.get("GOOGLE_SMTP_PASS");
    if (!smtpUser || !smtpPass) return respond({ error: "GOOGLE_SMTP_USER/PASS not set" }, 500);

    const fromEmail = Deno.env.get("SMTP_FROM") || smtpUser;
    const fromName = "Transform Health";

    // Wrap entire send attempt in a 15s timeout
    const result = await timeout((async () => {
      const conn = await Deno.connectTls({ hostname: "smtp.gmail.com", port: 465 });
      const enc = new TextEncoder();
      const dec = new TextDecoder();

      async function read(): Promise<string> {
        const b = new Uint8Array(4096);
        const n = await conn.read(b);
        return dec.decode(b.subarray(0, n ?? 0));
      }
      async function send(cmd: string): Promise<string> {
        await conn.write(enc.encode(cmd + "\r\n"));
        return read();
      }

      await read(); // greeting
      await send("EHLO transformhealth.org");
      await send("AUTH LOGIN");
      await send(btoa(smtpUser));
      await send(btoa(smtpPass));
      await send(`MAIL FROM:<${fromEmail}>`);
      await send(`RCPT TO:<${to}>`);
      await send("DATA"); // server responds 354
      // Send email content + end-of-data marker; send() reads the 250 OK
      await send(
        [
          `From: ${fromName} <${fromEmail}>`,
          `To: ${to}`,
          `Subject: ${subject}`,
          "MIME-Version: 1.0",
          "Content-Type: text/html; charset=UTF-8",
          "",
          html,
        ].join("\r\n") + "\r\n.",
      );
      conn.close();
      return { ok: true, provider: "Google SMTP" };
    })(), 15000);

    return respond(result);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return respond({ error: msg }, 500);
  }
});
