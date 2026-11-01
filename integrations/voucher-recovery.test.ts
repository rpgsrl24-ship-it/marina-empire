import { decideRecovery, decideRefundDeliveryAction, type DeliveryRecord } from "./voucher-recovery-policy.ts";

const now = new Date("2026-11-01T12:00:00.000Z");
const base: DeliveryRecord = {
  status: "pending", attempts: 0,
  updatedAt: "2026-11-01T11:00:00.000Z", providerMessageId: null
};
function check(value: boolean, message: string) { if (!value) throw new Error(message); }

Deno.test("pending voucher can be retried", () => {
  check(decideRecovery(base, now).action === "retry", "Expected retry");
});
Deno.test("already sent voucher is not resent", () => {
  check(decideRecovery({ ...base, status: "sent" }, now).action === "none", "Expected no action");
});
Deno.test("stale sending requires provider reconciliation", () => {
  check(decideRecovery({ ...base, status: "sending" }, now).action === "manual_provider_reconciliation", "Expected manual check");
});
Deno.test("recent sending is left in progress", () => {
  check(decideRecovery({ ...base, status: "sending", updatedAt: "2026-11-01T11:59:00.000Z" }, now).action === "none", "Expected no action");
});
Deno.test("retry limit requires manual review", () => {
  check(decideRecovery({ ...base, status: "retry", attempts: 8 }, now).action === "manual_provider_reconciliation", "Expected manual check");
});
Deno.test("provider receipt prevents automatic resend", () => {
  check(decideRecovery({ ...base, status: "retry", providerMessageId: "mail-1" }, now).action === "manual_provider_reconciliation", "Expected manual check");
});
Deno.test("unverified refund cannot cancel delivery", () => {
  check(decideRefundDeliveryAction(base, false, false).action === "none", "Expected no action");
});
Deno.test("verified refund cancels pending unredeemed voucher", () => {
  check(decideRefundDeliveryAction(base, false, true).action === "cancel", "Expected cancel");
});
Deno.test("redeemed voucher on refund needs manual review", () => {
  check(decideRefundDeliveryAction(base, true, true).action === "manual_provider_reconciliation", "Expected manual review");
});
Deno.test("already sent voucher on refund needs manual review", () => {
  check(decideRefundDeliveryAction({ ...base, status: "sent" }, false, true).action === "manual_provider_reconciliation", "Expected manual review");
});
