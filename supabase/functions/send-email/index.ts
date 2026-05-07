// Supabase Function: send-email
// Sends magic link emails for profile management
// Uses SendGrid (default) or Mailgun — configure via Supabase Dashboard → Settings → Functions → Secrets

import { serve } from "https://deno.land/x/supabase@0.37.3/functions.ts";
import { SmtpClient } from "https://deno.land/x/smtp@0.11.0/mod.ts";

interface EmailPayload {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

serve(async (req: Request) => {
  try {
    const payload: EmailPayload = await req.json();
    const { to, subject, html, from = Deno.env.get("SMTP_FROM") || "noreply@transformhealthcoalition.org" } = payload;

    if (!to || !subject || !html) {
      return new Response(JSON.stringify({ error: "Missing required fields: to, subject, html" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Try SendGrid first (if configured)
    const sendGridKey = Deno.env.get("SENDGRID_API_KEY");
    if (sendGridKey) {
      const sgMsg = {
        personalizations: [{ to: [{ email: to }] }],
        from: { email: from },
        subject,
        content: [{ type: "text/html", value: html }],
      };

      const resp = await fetch("https://api.sendgrid.com/v3/mail/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sendGridKey}`,
        },
        body: JSON.stringify(sgMsg),
      });

      if (resp.ok) {
        return new Response(JSON.stringify({ ok: true, provider: "sendgrid" }), {
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    // Fallback: SMTP (SendGrid not configured)
    const smtpHost = Deno.env.get("SMTP_HOST") || "smtp.sendgrid.net";
    const smtpPort = parseInt(Deno.env.get("SMTP_PORT") || "587");
    const smtpUser = Deno.env.get("SMTP_USERNAME") || "";
    const smtpPass = Deno.env.get("SMTP_PASSWORD") || "";

    if (!smtpUser || !smtpPass) {
      return new Response(JSON.stringify({ error: "No email provider configured. Set SENDGRID_API_KEY or SMTP_* secrets." }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const client = new SmtpClient({
      host: smtpHost,
      port: smtpPort,
      username: smtpUser,
      password: smtpPass,
      tls: true,
    });

    await client.connect();
    await client.send({
      from,
      to,
      subject,
      html,
    });
    await client.close();

    return new Response(JSON.stringify({ ok: true, provider: "smtp" }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("send-email error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
