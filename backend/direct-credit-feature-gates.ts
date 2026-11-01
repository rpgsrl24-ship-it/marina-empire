// Fail-closed feature gates for the direct-credit system.
// These flags must be set on a trusted backend, NEVER in GitHub Pages.
export type CreditFlags={ME_CHECKOUT_ENABLED?:string;ME_DIRECT_GRANTS_ENABLED?:string};
export function checkoutAllowed(flags:CreditFlags){
  return flags.ME_CHECKOUT_ENABLED==="true";
}
export function grantAllowed(flags:CreditFlags){
  return flags.ME_CHECKOUT_ENABLED==="true"&&flags.ME_DIRECT_GRANTS_ENABLED==="true";
}
export function requireCheckoutAllowed(flags:CreditFlags){
  if(!checkoutAllowed(flags)) throw new Error("Credit checkout is disabled");
}
export function requireGrantAllowed(flags:CreditFlags){
  if(!grantAllowed(flags)) throw new Error("Direct credit grants are disabled");
}
