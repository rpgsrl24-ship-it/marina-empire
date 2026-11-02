// Voucher recovery decisions: conservative, no duplicate emails.
export type DeliveryStatus = "pending" | "sending" | "sent" | "retry" | "failed" | "cancelled";
export type DeliveryRecord = {
  status: DeliveryStatus;
  attempts: number;
  updatedAt: string;
  providerMessageId: string | null;
};
export type RecoveryAction =
  | { action: "none"; reason: string }
  | { action: "manual_provider_reconciliation"; reason: string }
  | { action: "retry"; reason: string }
  | { action: "cancel"; reason: string };

export function decideRecovery(record: DeliveryRecord, now: Date): RecoveryAction {
  if (record.status === "sent") return { action: "none", reason: "Already sent" };
  if (record.status === "cancelled") return { action: "none", reason: "Cancelled" };
  if (record.status === "sending") {
    const ageMs = now.getTime() - new Date(record.updatedAt).getTime();
    if (!Number.isFinite(ageMs)) return { action: "manual_provider_reconciliation", reason: "Invalid timestamp" };
    return ageMs >= 30 * 60_000
      ? { action: "manual_provider_reconciliation", reason: "Delivery may have succeeded; check provider" }
      : { action: "none", reason: "Delivery in progress" };
  }
  if (record.providerMessageId) return { action: "manual_provider_reconciliation", reason: "Provider receipt exists" };
  if (record.attempts >= 8) return { action: "manual_provider_reconciliation", reason: "Retry limit reached" };
  if (record.status === "failed") return { action: "manual_provider_reconciliation", reason: "Failed delivery requires review" };
  return { action: "retry", reason: "Pending or retryable delivery" };
}

export function decideRefundDeliveryAction(
  record: DeliveryRecord,
  voucherRedeemed: boolean,
  verifiedRefund: boolean
): RecoveryAction {
  if (!verifiedRefund) return { action: "none", reason: "Refund not verified" };
  if (voucherRedeemed) return { action: "manual_provider_reconciliation", reason: "Redeemed voucher requires balance review" };
  if (record.status === "pending" || record.status === "retry" || record.status === "failed") {
    return { action: "cancel", reason: "Unredeemed voucher on refunded order" };
  }
  return { action: "manual_provider_reconciliation", reason: "Email may already have been sent" };
}
