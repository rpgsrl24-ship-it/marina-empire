'use strict';
// Read-only bridge from visual berth selection to an authoritative marina_docks row.
// Not a booking API: never changes ownership, availability, credits or reservations.
function resolveVisualBerth(catalog, dock, sceneMarinaId, visualPierIndex, localBerthIndex) {
  if (!Array.isArray(catalog?.marinas)) throw Error('Missing approved catalog');
  const marina = catalog.marinas.find(m => m.id === sceneMarinaId);
  if (!marina) throw Error('Unknown marina');
  if (!Number.isSafeInteger(visualPierIndex) || visualPierIndex < 1 || visualPierIndex > marina.piers) throw Error('Invalid pier');
  const dbId = marina.database_id || marina.id;
  if (!dock || dock.marina_id !== dbId || dock.dock_number !== visualPierIndex) throw Error('Authoritative dock mismatch');
  if (![dock.berth_start,dock.berth_end,localBerthIndex].every(Number.isSafeInteger)) throw Error('Invalid berth numbers');
  if (dock.berth_start < 1 || dock.berth_end < dock.berth_start) throw Error('Invalid dock range');
  const visualCapacity = Math.floor(marina.berths / marina.piers) + (visualPierIndex <= marina.berths % marina.piers ? 1 : 0);
  const databaseCapacity = dock.berth_end - dock.berth_start + 1;
  if (visualCapacity !== databaseCapacity) throw Error('Visual and database pier capacities differ: mapping unavailable');
  if (localBerthIndex < 1 || localBerthIndex > visualCapacity) throw Error('Invalid local berth index');
  return Object.freeze({marina_id:dbId,dock_number:visualPierIndex,berth_number:dock.berth_start + localBerthIndex - 1});
}
module.exports = {resolveVisualBerth};
