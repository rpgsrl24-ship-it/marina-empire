// Server-only webhook handler for staging. Fail closed until a separate
// encrypted-outbox delivery worker, refund policy and E2E tests are complete.
import { validatePaidWooOrder, type WooOrder } from "./woo-order-validator.ts";
import { queueVerifiedVoucher, type VoucherRpcClient } from "./voucher-issuer-adapter.ts";
import { createClient } from "npm:@supabase/supabase-js@2.95.0";
const env = (key: string) => Deno.env.get(key) || "";
const reply = (data: unknown, status = 200) => new Response(JSON.stringify(data), {
  status, headers: { "content-type": "application/json", "cache-control": "no-store" }
});
async function verifySignature(raw: string, supplied: string, secret: string): Promise<boolean> {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const expected = new Uint8Array(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(raw)));
  let actual: Uint8Array;
  try { actual = Uint8Array.from(atob(supplied), x => x.charCodeAt(0)); } catch { return false; }
  if (expected.length !== actual.length) return false;
  let mismatch = 0;
  for (let i = 0; i < expected.length; i++) mismatch |= expected[i] ^ actual[i];
  return mismatch === 0;
}
Deno.serve(async request => {
  if (request.method !== "POST") return reply({ error: "Method not allowed" }, 405);
  if (env("ME_ISSUE_ENABLED") !== "true" || env("ME_RECOVERABLE_DELIVERY_READY") !== "true") {
    return reply({ error: "Issuance disabled pending delivery verification" }, 503);
  }
  const required = ["ME_WOO_WEBHOOK_SECRET", "ME_WOO_API_KEY", "ME_WOO_API_SECRET", "ME_WOO_BASE_URL",
    "ME_VOUCHER_ENCRYPTION_KEY", "SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"];
  if (required.some(k => !env(k))) return reply({ error: "Server configuration incomplete" }, 503);
  const raw = await request.text();
  if (raw.length > 200000) return reply({ error: "Payload too large" }, 413);
  if (!await verifySignature(raw, request.headers.get("x-wc-webhook-signature") || "", env("ME_WOO_WEBHOOK_SECRET"))) {
    return reply({ error: "Invalid webhook signature" }, 401);
  }
  let payload: { id?: number };
  try { payload = JSON.parse(raw); } catch { return reply({ error: "Invalid payload" }, 400); }
  if (!Number.isSafeInteger(payload.id) || !payload.id || payload.id < 1) return reply({ error: "Invalid order ID" }, 400);
  let store:string;
  try {
    const parsed=new URL(env("ME_WOO_BASE_URL"));
    if(parsed.protocol!=="https:" || !["rpgyacht.com","www.rpgyacht.com"].includes(parsed.hostname) ||
       parsed.username || parsed.password || parsed.port || parsed.search || parsed.hash)
      return reply({ error: "Invalid store configuration" }, 503);
    store=parsed.origin;
  } catch {
    return reply({ error: "Invalid store configuration" }, 503);
  }
  const auth = btoa(env("ME_WOO_API_KEY") + ":" + env("ME_WOO_API_SECRET"));
  const response = await fetch(store + "/wp-json/wc/v3/orders/" + payload.id, {
    headers: { authorization: "Basic " + auth }
  });
  if (!response.ok) return reply({ error: "Order lookup failed" }, 502);
  let units;
  try { units = validatePaidWooOrder(await response.json() as WooOrder); }
  catch { return reply({ error: "Order ineligible for automatic issuance" }, 422); }
  const client = createClient(env("SUPABASE_URL"), env("SUPABASE_SERVICE_ROLE_KEY"), {
    auth: { persistSession: false, autoRefreshToken: false }
  }) as unknown as VoucherRpcClient;
  let queued = 0, duplicate = 0;
  for (const unit of units) {
    try {
      const status = await queueVerifiedVoucher(client, unit, env("ME_VOUCHER_ENCRYPTION_KEY"));
      if (status === "queued") queued++; else duplicate++;
    } catch { return reply({ error: "Issuance interrupted; retry webhook", queued, duplicate }, 503); }
  }
  return reply({ ok: true, queued, duplicate });
});
