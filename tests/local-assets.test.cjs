// Catch missing local pages, scripts, styles and media before GitHub Pages deploys.
// Dynamic URLs and remote services are exercised separately by the browser checks.
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

const root = path.resolve(__dirname, '..');
const pending = ['index.html', 'admin.html', 'pubblicita.html',
  'isola-delle-rose-originale.html', 'marine-deluxe-originali.html', 'voyage-3d.html'];
const inspected = new Set();
const checked = new Set();
const errors = [];

function checkReference(from, reference) {
  const value = reference.trim().replace(/&amp;/g, '&');
  if (!value || /^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i.test(value)) return;
  // An interpolated HTML string is not a literal asset URL.
  if (/["'<>${}]/.test(value)) return;
  const pathname = value.split(/[?#]/, 1)[0];
  if (!pathname) return;
  if (pathname.startsWith('/')) {
    errors.push(`${from}: root-relative URL breaks the /marina-empire/ Pages base: ${value}`);
    return;
  }
  let decoded;
  try { decoded = decodeURIComponent(pathname); }
  catch { errors.push(`${from}: invalid local URL: ${value}`); return; }
  let target = path.resolve(root, path.dirname(from), decoded);
  if (target !== root && !target.startsWith(root + path.sep)) {
    errors.push(`${from}: local URL escapes the published site: ${value}`);
    return;
  }
  if (fs.existsSync(target) && fs.statSync(target).isDirectory()) target = path.join(target, 'index.html');
  const relative = path.relative(root, target).split(path.sep).join('/');
  checked.add(relative);
  if (!fs.existsSync(target) || !fs.statSync(target).isFile()) {
    errors.push(`${from}: missing local resource ${value} (${relative})`);
    return;
  }
  if (/\.(?:html|css|webmanifest)$/i.test(relative) && !inspected.has(relative)) pending.push(relative);
}

while (pending.length) {
  const file = pending.shift();
  if (inspected.has(file)) continue;
  inspected.add(file);
  const sourcePath = path.join(root, file);
  if (!fs.existsSync(sourcePath)) { errors.push(`Missing entry page: ${file}`); continue; }
  const source = fs.readFileSync(sourcePath, 'utf8');
  if (file.endsWith('.webmanifest')) {
    const manifest = JSON.parse(source);
    for (const icon of manifest.icons || []) if (icon.src) checkReference(file, icon.src);
    if (manifest.start_url) checkReference(file, manifest.start_url);
    continue;
  }
  for (const tag of source.matchAll(/<[a-z][^>]*>/gi)) {
    for (const attribute of tag[0].matchAll(/\b(?:src|href|poster)\s*=\s*(["'])(.*?)\1/gi)) {
      checkReference(file, attribute[2]);
    }
  }
  const styles = file.endsWith('.css') ? source : [
    ...[...source.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)].map(match => match[1]),
    ...[...source.matchAll(/\bstyle\s*=\s*(["'])(.*?)\1/gi)].map(match => match[2])
  ].join('\n');
  for (const css of styles.matchAll(/\burl\(\s*(["']?)([^)"']+)\1\s*\)/gi)) checkReference(file, css[2]);
  // Include literal filenames used by image loaders, fetch and iframe routing.
  for (const literal of source.matchAll(/(["'])((?:\.{1,2}\/)[^"'<>\\\r\n]*\.(?:html|m?js|css|json|webmanifest|svg|png|jpe?g|webp|gif|ico|mp[34]|woff2?|ttf|md)(?:[?#][^"'<>\\\r\n]*)?)\1/gi)) {
    checkReference(file, literal[2]);
  }
}

assert.deepEqual([...new Set(errors)], [], 'Published pages reference missing or invalid local resources');
console.log(`PASS: ${inspected.size} linked pages/manifests/styles and ${checked.size} local resources exist under the Pages base.`);
