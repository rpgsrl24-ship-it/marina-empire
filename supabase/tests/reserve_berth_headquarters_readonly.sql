-- Run after the reviewed headquarters guard patch. Never creates an account or booking.
-- READ ONLY also prevents an INSERT if the guard regresses or was not deployed.
begin read only;
set local role authenticated;
select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000001',true);
do $test$
begin
 begin
  perform public.reserve_berth('rose',1,current_date);
  raise exception 'FAIL: player RPC accepted Rose';
 exception when insufficient_privilege then
  if sqlerrm <> 'Isola delle Rose: base operativa riservata a RPG Yacht' then
   raise exception 'FAIL: Rose was denied for an unexpected reason: %',sqlerrm;
  end if;
 end;
 begin
  perform public.reserve_berth('rimini',0,current_date);
  raise exception 'FAIL: non-Rose berth validation was bypassed';
 exception when raise_exception then
  if sqlerrm <> 'Prenotazione non valida' then raise; end if;
 end;
end;
$test$;
select 'PASS: Rose rejected before writes; other-marina validation retained' as result;
rollback;
