# Marina Empire - release checklist

This checklist tracks the Master Plan V1 to V6 without treating unfinished work as production-ready.

## V1 - Functional regression
- Start a new game at Rimini and complete the Rimini-Cervia introductory mission.
- Confirm one reward, one voyage, updated berth and fuel.
- Reload mid-voyage: timer, location and credits must persist.
- Reload after arrival: no duplicate reward.
- Test multi-leg routes, refueling and interruption at the reached stop.
- Check all 15 harbor pairs for coastal crossings; current waypoints are illustrative.
- Verify all buttons in Direzione, Navigazione and Comandante.

## V2 - Career
- Every owned boat can be selected and assigned compatible missions.
- Fuel is per boat, not shared across the fleet.
- Maintenance and charter costs/rewards must be balanced.

## V3 - Marinas
- Purchases, berth occupancy and revenue must persist.
- Prevent repeated purchase or duplicated revenue.

## V4 - Multiplayer
- Validate account ownership and Supabase Row Level Security.
- Moderate chat and report abuse; protect minors.
- Test two accounts in the same marina.

## V5 - Monetization
- No real-money credit granting from client-side JavaScript.
- Verify payment provider webhooks and one-time voucher redemption server-side.
- Add terms, privacy, refunds, tax handling and financial analytics.
- Keep free progression genuinely viable.

## V6 - Expansion
- Validate real geographic maritime routing.
- Improve 3D marina entrances and berth approaches.
- Add countries, events and partnerships after stable core gameplay.

## Known limitations
- Browser localStorage is not a secure source of truth for currency or inventory.
- Existing nautical routes are simulated and not safe for real navigation.
- Visual/browser end-to-end regression has not yet been confirmed.
