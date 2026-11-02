# Archived payment entrypoints — 2 November 2026

These source snapshots were read from the live Supabase Edge Functions before the explicit OFF update. They are historical material, not a deploy bundle. The `.ts.txt` suffix keeps them outside TypeScript entrypoints; nothing imports them.

Do not restore or deploy these files to the public beta. Checkout and voucher redemption can become active through environment flags in these old implementations. A rollback must preserve the constant OFF handlers now stored under `supabase/functions/`.

Future payment work must use a sandbox, satisfy `backend/DIRECT_CHECKOUT_RELEASE_CHECKLIST.md`, obtain explicit owner authorization and deploy a reviewed implementation. Switching environment variables alone cannot activate the current handlers.

No keys, token values, orders or user data are included.

| Function | Previous version | Previous JWT verification |
| --- | --- | --- |
| marina-direct-checkout | 1 | true |
| marina-redeem-credit | 1 | false |
| marina-issue-credit | 1 | true |
