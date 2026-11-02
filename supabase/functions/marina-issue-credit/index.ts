// Supabase Edge Function: marina-issue-credit
// Payments are explicitly OFF for the public beta.
// No environment variable or request can activate this entrypoint.
// Activation requires an approved replacement and a new deployment.
// The previous implementation is archived outside supabase/functions.
const headers={
  "content-type":"application/json",
  "cache-control":"no-store",
  "access-control-allow-origin":"https://rpgsrl24-ship-it.github.io",
  "access-control-allow-headers":"authorization,apikey,content-type,x-client-info,x-retry-count,traceparent,tracestate,baggage",
  "access-control-allow-methods":"POST,OPTIONS",
  "vary":"Origin"
};
Deno.serve(req=>{
  if(req.method==="OPTIONS")return new Response(null,{status:204,headers});
  if(req.method!=="POST")return Response.json(
    {error:"Method not allowed"},
    {status:405,headers:{...headers,allow:"POST, OPTIONS"}}
  );
  // Do not parse the body, read secrets, authenticate, call a provider or write data.
  return Response.json(
    {error:"Pagamenti e ricariche non ancora attivi",code:"PAYMENTS_DISABLED"},
    {status:503,headers}
  );
});
