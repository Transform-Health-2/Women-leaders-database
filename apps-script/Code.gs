/**
 * Transform Health Directory — Email Relay (via Google Apps Script MailApp)
 *
 * Called by the Supabase Edge Function (send-email) to send magic link emails
 * using Google Workspace's MailApp.
 *
 * POST { action: 'sendRawEmail', to, subject, htmlBody }
 *
 * Defence-in-depth: validate email format and optionally a shared secret.
 * Set RELAY_SECRET in Script Properties (Project Settings → Script Properties)
 * and set the same value as APPS_SCRIPT_KEY in Supabase Edge Function Secrets.
 */

function doPost(e) {
  try {
    var payload = {};
    if (e.postData && e.postData.type === 'application/json') {
      payload = JSON.parse(e.postData.contents);
    } else {
      payload = e.parameter || {};
    }

    var action = payload.action || '';

    if (action === 'sendRawEmail') {
      return jsonResponse(sendRawEmail(payload));
    }

    return jsonResponse({ ok: false, error: 'unknown_action' });

  } catch (err) {
    return jsonResponse({ ok: false, error: err.toString() });
  }
}

function sendRawEmail(payload) {
  // Shared-secret check — set RELAY_SECRET in Script Properties to enable
  var relaySecret = PropertiesService.getScriptProperties().getProperty('RELAY_SECRET');
  if (relaySecret && payload.secret !== relaySecret) {
    return { ok: false, error: 'unauthorized' };
  }

  var to       = payload.to       || '';
  var cc       = payload.cc       || '';
  var subject  = payload.subject  || '';
  var htmlBody = payload.htmlBody || '';

  if (!to || !subject || !htmlBody) {
    return { ok: false, error: 'missing_fields' };
  }

  // Basic email format validation — defence against misconfigured callers
  var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(to)) {
    return { ok: false, error: 'invalid_to_address' };
  }
  if (cc && !emailRegex.test(cc)) {
    return { ok: false, error: 'invalid_cc_address' };
  }

  var params = {
    to: to,
    subject: subject,
    htmlBody: htmlBody,
  };

  if (cc) {
    params.cc = cc;
  }

  MailApp.sendEmail(params);

  return { ok: true };
}

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
