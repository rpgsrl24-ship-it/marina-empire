// Marina Empire shared berth availability adapter (read-only).
// This is independent of the local demo booking economy.
// Never use the publishable key as a server credential.
export const ONLINE_BERTH_MARINAS = new Set(["rose","rimini","ancona","lignano","cervia","bari"]);
export function parseOccupiedBerths(rows:unknown):Set<number> {
 if(!Array.isArray(rows))throw new Error("Invalid availability response");
 const occupied=new Set<number>();
 for(const row of rows){
  if(!row||typeof row!=="object"||!Number.isInteger((row as {berth_number?:number}).berth_number))throw new Error("Invalid berth record");
  const berth=(row as {berth_number:number}).berth_number;
  if(berth<1||berth>60)throw new Error("Out-of-range berth");
  occupied.add(berth);
 }
 return occupied;
}
export async function getOnlineBerthAvailability(
 client:{rpc:(name:string,args:Record<string,unknown>)=>Promise<{data:unknown;error:unknown}>},
 marinaId:string,bookingDate:string
):Promise<Set<number>> {
 if(!ONLINE_BERTH_MARINAS.has(marinaId))throw new Error("Marina not enabled for online booking");
 if(!/^\d{4}-\d{2}-\d{2}$/.test(bookingDate)||Number.isNaN(Date.parse(bookingDate+"T00:00:00Z")))throw new Error("Invalid booking date");
 const {data,error}=await client.rpc("me_berth_availability",{p_marina_id:marinaId,p_booking_date:bookingDate});
 if(error)throw new Error("Online berth availability unavailable");
 return parseOccupiedBerths(data);
}
