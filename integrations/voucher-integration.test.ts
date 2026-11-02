import { validatePaidWooOrder, type WooOrder } from "./woo-order-validator.ts";
import { generateVoucherCode, hashVoucher, encryptVoucher, decryptVoucher } from "./voucher-crypto.ts";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}
function order(): WooOrder {
  return {
    id: 12345, status: "processing", currency: "EUR",
    date_paid: "2026-11-01T10:00:00", billing: { email: "buyer@example.com" },
    refunds: [],
    line_items: [{ id: 901, product_id: 38090, sku: "ME-CREDITS-50000",
      quantity: 2, total: "8.18", total_tax: "1.80", subtotal: "8.18", subtotal_tax: "1.80" }]
  };
}
Deno.test("paid order produces one voucher unit per purchased item", () => {
  const units = validatePaidWooOrder(order());
  assert(units.length === 2, "Expected two units");
  assert(units[0].unitIndex === 0 && units[1].unitIndex === 1, "Wrong unit indexes");
  assert(units.every(u => u.credits === 50000), "Wrong credit amount");
});
Deno.test("unpaid orders are rejected", () => {
  const sample = order(); sample.date_paid = null;
  let rejected = false;
  try { validatePaidWooOrder(sample); } catch { rejected = true; }
  assert(rejected, "Unpaid order was accepted");
});
Deno.test("refunded orders are rejected", () => {
  const sample = order(); sample.refunds = [{ id: 10 }];
  let rejected = false;
  try { validatePaidWooOrder(sample); } catch { rejected = true; }
  assert(rejected, "Refunded order was accepted");
});
Deno.test("gross Woo price including tax is accepted", () => {
  const units = validatePaidWooOrder(order());
  assert(units.length === 2, "Expected tax-inclusive order to validate");
});
Deno.test("changed gross prices are rejected", () => {
  const sample = order(); sample.line_items[0].total = "0.00";
  let rejected = false;
  try { validatePaidWooOrder(sample); } catch { rejected = true; }
  assert(rejected, "Price mismatch was accepted");
});
Deno.test("discounted subtotal or total is rejected", () => {
  const sample = order(); sample.line_items[0].subtotal = "8.00";
  let rejected = false;
  try { validatePaidWooOrder(sample); } catch { rejected = true; }
  assert(rejected, "Discounted order was accepted");
});
Deno.test("product and SKU mismatches are rejected", () => {
  const sample = order(); sample.line_items[0].sku = "OTHER";
  let rejected = false;
  try { validatePaidWooOrder(sample); } catch { rejected = true; }
  assert(rejected, "SKU mismatch was accepted");
});
Deno.test("voucher encryption round trip and unique nonces", async () => {
  const key = "A1".repeat(32);
  const code = generateVoucherCode();
  assert(/^ME-[A-F0-9]{8}-[A-F0-9]{8}-[A-F0-9]{8}$/.test(code), "Invalid voucher code");
  const first = await encryptVoucher(code, key);
  const second = await encryptVoucher(code, key);
  assert(first.nonce !== second.nonce, "Nonce unexpectedly repeated");
  assert(await decryptVoucher(first, key) === code, "Decryption mismatch");
  assert((await hashVoucher(code)).length === 64, "Invalid hash length");
});
Deno.test("wrong encryption key cannot decrypt", async () => {
  const encrypted = await encryptVoucher(generateVoucherCode(), "A1".repeat(32));
  let rejected = false;
  try { await decryptVoucher(encrypted, "B2".repeat(32)); } catch { rejected = true; }
  assert(rejected, "Wrong key was accepted");
});


Deno.test("live rehearsal: first EUR 4.99 pack validates exactly one 50k voucher", () => {
  const sample: WooOrder = {
    id: 50001,
    status: "processing",
    currency: "EUR",
    date_paid: "2026-11-02T18:00:00Z",
    billing: { email: "buyer@example.com" },
    refunds: [],
    line_items: [{
      id: 70001,
      product_id: 38090,
      sku: "ME-CREDITS-50000",
      quantity: 1,
      total: "4.09",
      total_tax: "0.90",
      subtotal: "4.09",
      subtotal_tax: "0.90"
    }]
  };
  const units = validatePaidWooOrder(sample);
  assert(units.length === 1, "Expected exactly one voucher unit");
  assert(units[0].orderId === 50001, "Wrong order id");
  assert(units[0].itemId === 70001, "Wrong item id");
  assert(units[0].unitIndex === 0, "Wrong unit index");
  assert(units[0].credits === 50000, "Wrong credit amount");
  assert(units[0].email === "buyer@example.com", "Wrong recipient");
});

Deno.test("live rehearsal: first pack rejects wrong gross price, sku, currency, unpaid and refunded states", () => {
  const base = (): WooOrder => ({
    id: 50002,
    status: "processing",
    currency: "EUR",
    date_paid: "2026-11-02T18:00:00Z",
    billing: { email: "buyer@example.com" },
    refunds: [],
    line_items: [{
      id: 70002,
      product_id: 38090,
      sku: "ME-CREDITS-50000",
      quantity: 1,
      total: "4.09",
      total_tax: "0.90",
      subtotal: "4.09",
      subtotal_tax: "0.90"
    }]
  });
  for (const mutate of [
    (x: WooOrder) => { x.currency = "USD"; },
    (x: WooOrder) => { x.date_paid = null; },
    (x: WooOrder) => { x.refunds = [{ id: 1 }]; },
    (x: WooOrder) => { x.line_items[0].sku = "OTHER"; },
    (x: WooOrder) => { x.line_items[0].total = "3.00"; }
  ]) {
    const sample = base();
    mutate(sample);
    let rejected = false;
    try { validatePaidWooOrder(sample); } catch { rejected = true; }
    assert(rejected, "Invalid live rehearsal order was accepted");
  }
});
