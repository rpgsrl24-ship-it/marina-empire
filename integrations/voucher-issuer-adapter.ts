// Staging-only atomic issuer adapter. Do not deploy until payment verification
// and a reliable encrypted-outbox delivery worker are fully integrated.
import { generateVoucherCode, hashVoucher, encryptVoucher } from "./voucher-crypto.ts";

export interface PaidVoucherUnit {
  orderId: number;
  itemId: number;
  unitIndex: number;
  credits: 50000 | 120000 | 300000 | 900000 | 2000000;
  email: string;
}
export interface VoucherRpcClient {
  rpc(name: string, args: Record<string, unknown>): Promise<{
    data: unknown;
    error: { code?: string; message?: string } | null;
  }>;
}
export type IssueResult = "queued" | "already_queued";

/** Only invoke after independently verifying WooCommerce order payment,
 * amount, currency, refund status, product identity and quantities.
 */
export async function queueVerifiedVoucher(
  admin: VoucherRpcClient,
  unit: PaidVoucherUnit,
  encryptionKeyHex: string
): Promise<IssueResult> {
  if (![unit.orderId, unit.itemId, unit.unitIndex, unit.credits].every(Number.isSafeInteger)) {
    throw new Error("Invalid voucher identifiers");
  }
  if (unit.orderId <= 0 || unit.itemId <= 0 || unit.unitIndex < 0 || unit.unitIndex > 99) {
    throw new Error("Invalid order item or unit");
  }
  const code = generateVoucherCode();
  const encrypted = await encryptVoucher(code, encryptionKeyHex);
  const { error } = await admin.rpc("me_issue_voucher_with_outbox_internal", {
    p_code_hash: await hashVoucher(code),
    p_credits: unit.credits,
    p_order_id: unit.orderId,
    p_item_id: unit.itemId,
    p_unit_index: unit.unitIndex,
    p_recipient_email: unit.email,
    p_ciphertext: encrypted.ciphertext,
    p_nonce: encrypted.nonce,
    p_key_version: encrypted.key_version
  });
  if (!error) return "queued";
  // Database unique constraint prevents duplicate voucher/outbox issuance.
  if (error.code === "23505") return "already_queued";
  throw new Error("Atomic voucher issuance failed");
}
