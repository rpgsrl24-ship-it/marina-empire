// Pure order validation for Marina Empire credit packs.
// Never issue vouchers based only on the WooCommerce webhook body.
// Fetch the authoritative order using WooCommerce server credentials.
export const PACKS: Record<number, { sku: string; credits: number; price: string }> = {
  38090: { sku: "ME-CREDITS-50000", credits: 50000, price: "4.99" },
  38091: { sku: "ME-CREDITS-120000", credits: 120000, price: "9.99" },
  38092: { sku: "ME-CREDITS-300000", credits: 300000, price: "19.99" },
  38093: { sku: "ME-CREDITS-900000", credits: 900000, price: "49.99" },
  38094: { sku: "ME-CREDITS-2000000", credits: 2000000, price: "99.99" }
};
type OrderLine = {
  id: number; product_id: number; sku?: string; quantity: number;
  total?: string; total_tax?: string; subtotal?: string; subtotal_tax?: string;
};
export type WooOrder = {
  id: number; status: string; currency: string; date_paid: string | null;
  billing?: { email?: string }; line_items: OrderLine[];
  refunds?: Array<{ id: number }>;
};
export type VerifiedUnit = { orderId: number; itemId: number; unitIndex: number; credits: 50000 | 120000 | 300000 | 900000 | 2000000; email: string };
function cents(value: string | undefined): number {
  if (!value || !/^\d+(\.\d{1,2})?$/.test(value)) throw new Error("Invalid price");
  const [whole, fraction = ""] = value.split(".");
  const n = Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
  if (!Number.isSafeInteger(n)) throw new Error("Price overflow");
  return n;
}
export function validatePaidWooOrder(order: WooOrder): VerifiedUnit[] {
  if (!Number.isSafeInteger(order.id) || order.id <= 0) throw new Error("Invalid order");
  if (!["processing", "completed"].includes(order.status) || !order.date_paid) throw new Error("Order not paid");
  if (order.currency !== "EUR") throw new Error("Unexpected currency");
  if (order.refunds?.length) throw new Error("Refunded order requires manual review");
  const email = order.billing?.email?.trim();
  if (!email || email.length > 320 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Invalid recipient");
  const result: VerifiedUnit[] = [];
  for (const line of order.line_items) {
    const pack = PACKS[line.product_id];
    if (!pack) continue;
    if (line.sku !== pack.sku) throw new Error("SKU/product mismatch");
    if (!Number.isSafeInteger(line.id) || line.id <= 0 || !Number.isSafeInteger(line.quantity) || line.quantity < 1 || line.quantity > 100) throw new Error("Invalid line");
    // WooCommerce line total/subtotal exclude tax. The approved Marina Empire
    // retail prices are gross EUR amounts, so validate gross totals exactly.
    // total gross must also equal subtotal gross: coupons/discounts remain
    // unsupported in the initial release and go to manual review.
    const totalGross = cents(line.total) + cents(line.total_tax ?? "0.00");
    const subtotalGross = cents(line.subtotal) + cents(line.subtotal_tax ?? "0.00");
    const expectedGross = cents(pack.price) * line.quantity;
    if (totalGross !== expectedGross || subtotalGross !== expectedGross) {
      throw new Error("Price mismatch; manual review required");
    }
    for (let i = 0; i < line.quantity; i++) {
      result.push({ orderId: order.id, itemId: line.id, unitIndex: i, credits: pack.credits as VerifiedUnit["credits"], email });
    }
  }
  if (result.length > 100) throw new Error("Excessive voucher quantity");
  return result;
}
