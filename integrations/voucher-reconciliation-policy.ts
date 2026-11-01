import { decideRecovery, type DeliveryRecord } from "./voucher-recovery-policy.ts";

export type ReconciliationRow = DeliveryRecord & {
  id: string;
  woo_order_id: number;
};
export type ReconciliationItem = {
  delivery_id: string;
  order_id: number;
  age_minutes: number;
  provider_message_id: string | null;
};

// Pure function: produces review candidates, never updates or retries a delivery.
export function findStaleDeliveries(
  rows: ReconciliationRow[],
  now: Date,
  maxItems = 100
): ReconciliationItem[] {
  if (!Number.isInteger(maxItems) || maxItems < 1 || maxItems > 100) {
    throw new Error("Invalid limit");
  }
  return rows.filter(row =>
    row.status === "sending" &&
    decideRecovery(row, now).action === "manual_provider_reconciliation"
  ).slice(0, maxItems).map(row => ({
    delivery_id: row.id,
    order_id: row.woo_order_id,
    age_minutes: Math.max(0, Math.floor(
      (now.getTime() - new Date(row.updatedAt).getTime()) / 60000
    )),
    provider_message_id: row.providerMessageId
  }));
}
