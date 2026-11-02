/** Marina Empire voucher crypto primitives. Server-side Deno only.
 * Encryption keys must be provided by the runtime secret manager, never by browser code.
 */
const encoder = new TextEncoder();
const decoder = new TextDecoder();
export type EncryptedVoucher = { ciphertext: string; nonce: string; key_version: number };
const toBase64 = (bytes: Uint8Array) => btoa(String.fromCharCode(...bytes));
const fromBase64 = (value: string) => Uint8Array.from(atob(value), c => c.charCodeAt(0));

export function generateVoucherCode(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(12));
  const hex = Array.from(bytes, x => x.toString(16).padStart(2, "0")).join("").toUpperCase();
  return "ME-" + hex.slice(0, 8) + "-" + hex.slice(8, 16) + "-" + hex.slice(16, 24);
}
export async function hashVoucher(code: string): Promise<string> {
  const digest = new Uint8Array(await crypto.subtle.digest("SHA-256", encoder.encode(code)));
  return Array.from(digest, x => x.toString(16).padStart(2, "0")).join("");
}
async function importKey(keyHex: string, usage: KeyUsage[]): Promise<CryptoKey> {
  if (!/^[a-fA-F0-9]{64}$/.test(keyHex)) throw new Error("Invalid AES-256 key configuration");
  const key = Uint8Array.from(keyHex.match(/.{2}/g)!, x => parseInt(x, 16));
  return crypto.subtle.importKey("raw", key, { name: "AES-GCM" }, false, usage);
}
export async function encryptVoucher(code: string, keyHex: string): Promise<EncryptedVoucher> {
  if (!/^ME-[A-F0-9]{8}-[A-F0-9]{8}-[A-F0-9]{8}$/.test(code)) throw new Error("Invalid voucher format");
  const key = await importKey(keyHex, ["encrypt"]);
  const nonce = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv: nonce }, key, encoder.encode(code)));
  return { ciphertext: toBase64(encrypted), nonce: toBase64(nonce), key_version: 1 };
}
export async function decryptVoucher(payload: EncryptedVoucher, keyHex: string): Promise<string> {
  if (payload.key_version !== 1) throw new Error("Unsupported key version");
  const key = await importKey(keyHex, ["decrypt"]);
  const plaintext = await crypto.subtle.decrypt({ name: "AES-GCM", iv: fromBase64(payload.nonce) }, key, fromBase64(payload.ciphertext));
  const code = decoder.decode(plaintext);
  if (!/^ME-[A-F0-9]{8}-[A-F0-9]{8}-[A-F0-9]{8}$/.test(code)) throw new Error("Invalid decrypted code");
  return code;
}
