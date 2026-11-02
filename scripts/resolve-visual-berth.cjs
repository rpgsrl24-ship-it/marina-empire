'use strict';
// Numeric candidate only: matching capacity is NOT proof of physical alignment.
const {readSceneLayouts} = require('./audit-scene-berths.cjs');
function resolveVisualBerth(catalog, dock, sceneMarinaId, visualPierIndex, localBerthIndex) {
  if (!Array.isArray(catalog?.marinas)) throw Error('Missing approved catalog');
  const matches = catalog.marinas.filter(m => m.id === sceneMarinaId);
  if (matches.length !== 1) throw Error('Unknown or duplicate marina');
  const marina = matches[0];
  if (!Number.isSafeInteger(visualPierIndex) || visualPierIndex < 1 || visualPierIndex > marina.piers) throw Error('Invalid pier');
  const dbId = marina.database_id || marina.id;
  if (!dock || dock.marina_id !== dbId || dock.dock_number !== visualPierIndex) throw Error('Authoritative dock mismatch');
  if (![dock.berth_start,dock.berth_end,localBerthIndex].every(Number.isSafeInteger)) throw Error('Invalid berth numbers');
  if (dock.berth_start < 1 || dock.berth_end < dock.berth_start || dock.berth_end > marina.berths) throw Error('Invalid dock range');
  const layout = readSceneLayouts(catalog).find(m => m.sceneId === sceneMarinaId);
  const visualCapacity = layout.capacities[visualPierIndex-1];
  if (visualCapacity !== dock.berth_end-dock.berth_start+1) throw Error('Visual and database pier capacities differ: mapping unavailable');
  if (localBerthIndex < 1 || localBerthIndex > visualCapacity) throw Error('Invalid local berth index');
  return Object.freeze({marina_id:dbId, dock_number:visualPierIndex,
    berth_number:dock.berth_start+localBerthIndex-1, mapping_status:'numeric-candidate-only', bookable:false});
}
module.exports = {resolveVisualBerth};
