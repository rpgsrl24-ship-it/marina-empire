/* Local beta-save selection only. This is NOT authentication, authorization,
   purchased credit validation, or permission to write any server data.
   The SDK session is inspected only to avoid using another local player's save.
   Unknown session formats, missing helpers and changed contexts fail closed. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory;
  else {
    let storage = null;
    try { storage = root.localStorage; } catch (_) {}
    root.MarinaLocalSaveContext = factory(storage);
  }
})(typeof window !== 'undefined' ? window : globalThis, function createLocalSaveContext(storage) {
  'use strict';
  const contextKey = 'marina_empire_local_context_v1';
  const authKey = 'sb-zrdetqvnjmqkfyajxjgp-auth-token';
  const guestKey = 'marina_empire_beta_test_session';
  const validId = value => typeof value === 'string' && /^[A-Za-z0-9_-]{1,100}$/.test(value);
  const saveKey = id => id === null ? guestKey : 'marina_empire_user_' + id;
  const validRecord = value => value && value.version === 1 &&
    (value.accountId === null || validId(value.accountId)) &&
    typeof value.revision === 'string' && value.revision.length > 0;
  const seenGameRaw = new Map();
  const seenLayoutRaw = new Map();
  function cachedIdentity() {
    try {
      const raw = storage.getItem(authKey);
      if (raw === null) return {accountId:null};
      const session = JSON.parse(raw), user = session && session.user;
      if (!user || !validId(user.id) || !user.email_confirmed_at || user.is_anonymous) return null;
      return {accountId:user.id};
    } catch (_) { return null; }
  }
  function select(accountId) {
    if (accountId === undefined) accountId = null;
    if (accountId !== null && !validId(accountId)) return false;
    try {
      const old = JSON.parse(storage.getItem(contextKey) || 'null');
      if (validRecord(old) && old.accountId === accountId) return true;
      const revision = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() :
        Date.now().toString(36) + '-' + Math.random().toString(36).slice(2);
      const raw = JSON.stringify({version:1,accountId,revision});
      storage.setItem(contextKey,raw);
      return storage.getItem(contextKey) === raw;
    } catch (_) { return false; }
  }
  function capture() {
    try {
      const raw = storage.getItem(contextKey), record = JSON.parse(raw || 'null'), identity = cachedIdentity();
      if (!validRecord(record) || !identity || identity.accountId !== record.accountId) return null;
      const handle = Object.freeze({raw,accountId:record.accountId,saveKey:saveKey(record.accountId)});
      seenGameRaw.set(handle.raw, storage.getItem(handle.saveKey));
      return handle;
    } catch (_) { return null; }
  }
  function isCurrent(handle) {
    try {
      if (!handle || storage.getItem(contextKey) !== handle.raw) return false;
      const record = JSON.parse(handle.raw), identity = cachedIdentity();
      return !!(validRecord(record) && handle.accountId === record.accountId &&
        handle.saveKey === saveKey(record.accountId) && identity && identity.accountId === record.accountId);
    } catch (_) { return false; }
  }
  function readGame(handle) {
    if (!isCurrent(handle)) return null;
    try {
      const raw = storage.getItem(handle.saveKey);
      seenGameRaw.set(handle.raw, raw);
      const game = JSON.parse(raw || 'null');
      return game && typeof game.name === 'string' && game.name.trim() &&
        Number.isFinite(game.coins) && game.coins >= 0 ? game : null;
    } catch (_) { return null; }
  }
  function writeGame(handle, game) {
    if (!isCurrent(handle) || !game || typeof game.name !== 'string' || !game.name.trim() ||
      !Number.isFinite(game.coins) || game.coins < 0) return false;
    try {
      const before = storage.getItem(handle.saveKey);
      if (!seenGameRaw.has(handle.raw)) seenGameRaw.set(handle.raw,before);
      if (before !== seenGameRaw.get(handle.raw)) return false;
      const raw = JSON.stringify(game);
      if (!isCurrent(handle)) return false;
      storage.setItem(handle.saveKey,raw);
      if (storage.getItem(handle.saveKey) !== raw) return false;
      seenGameRaw.set(handle.raw,raw);
      return true;
    } catch (_) { return false; }
  }
  function layoutKey(handle, marinaId) {
    if (!isCurrent(handle) || typeof marinaId !== 'string' || !/^[a-z0-9_-]{1,64}$/.test(marinaId)) return null;
    return handle.accountId === null ? 'marina-empire-phase1-' + marinaId : handle.saveKey + '_marina_' + marinaId;
  }
  function readLayout(handle, marinaId) {
    const key = layoutKey(handle,marinaId);
    if (!key) return null;
    try {
      const raw=storage.getItem(key);
      seenLayoutRaw.set(handle.raw+'|'+marinaId,raw);
      return JSON.parse(raw || 'null');
    } catch (_) { return null; }
  }
  function writeLayout(handle, marinaId, layout) {
    const key = layoutKey(handle,marinaId);
    if (!key) return false;
    try {
      const tag=handle.raw+'|'+marinaId,before=storage.getItem(key);
      if(!seenLayoutRaw.has(tag))seenLayoutRaw.set(tag,before);
      if(before!==seenLayoutRaw.get(tag))return false;
      const raw = JSON.stringify(layout);
      if (!isCurrent(handle)) return false;
      storage.setItem(key,raw);
      if(storage.getItem(key)!==raw)return false;
      seenLayoutRaw.set(tag,raw);
      return true;
    } catch (_) { return false; }
  }
  function resetLayout(handle, marinaId) {
    const key = layoutKey(handle,marinaId);
    if (!key) return false;
    try {
      const tag=handle.raw+'|'+marinaId,before=storage.getItem(key);
      if(!seenLayoutRaw.has(tag))seenLayoutRaw.set(tag,before);
      if(before!==seenLayoutRaw.get(tag))return false;
      if (!isCurrent(handle)) return false;
      storage.removeItem(key);
      if(storage.getItem(key)!==null)return false;
      seenLayoutRaw.set(tag,null);
      return true;
    } catch (_) { return false; }
  }
  function hasExternalChange(handle,marinaId) {
    if(!isCurrent(handle))return true;
    try{
      if(seenGameRaw.has(handle.raw)&&storage.getItem(handle.saveKey)!==seenGameRaw.get(handle.raw))return true;
      if(marinaId!==undefined){
        const key=layoutKey(handle,marinaId),tag=handle.raw+'|'+marinaId;
        if(!key)return true;
        if(seenLayoutRaw.has(tag)&&storage.getItem(key)!==seenLayoutRaw.get(tag))return true;
      }
      return false;
    }catch(_){return true;}
  }
  return Object.freeze({select,capture,isCurrent,readGame,writeGame,layoutKey,readLayout,writeLayout,resetLayout,hasExternalChange});
});
