# Ripristino controllato della beta

## Vincoli permanenti

- Pagamenti, checkout e accredito di crediti acquistati restano disabilitati.
- L'Isola delle Rose appartiene alla gestione esclusiva RPG Yacht e non è acquistabile dai giocatori.
- Le scene 3D originali devono essere conservate.
- Un ripristino del sito non deve cancellare o riscrivere account, salvataggi cloud o dati dei giocatori.

## Identificare la versione pubblicata

Il workflow `Deploy Marina Empire` genera `release.json` nell'artifact pubblicato, con il commit completo e lo SHA-256 di `index.html`. Il controllo successivo alla pubblicazione verifica sia il commit sia i byte effettivamente restituiti da GitHub Pages. Un workflow verde precedente a questo controllo non certifica la corrispondenza esatta del sito con il commit.

Consultare:

- [Release pubblicata](https://rpgsrl24-ship-it.github.io/marina-empire/release.json).
- [Esecuzioni del deploy](https://github.com/rpgsrl24-ship-it/marina-empire/actions/workflows/pages.yml).
- [Cronologia dei commit](https://github.com/rpgsrl24-ship-it/marina-empire/commits/main).

Il commit `c61a777ea85ff7464929758b63e8b1e4ed2b24d5` è la base dell'audit del 2 novembre 2026: conteneva ancora l'accesso al contenitore `mapDisplay` assente e l'acquisto dell'Isola delle Rose. Non considerarlo una versione sicura da ripubblicare integralmente.

## Procedura

1. Registrare il commit in `release.json`, l'URL del workflow e il problema riprodotto. Individuare l'ultima revisione che supera i controlli P0 e conserva tutti i vincoli sopra.
2. Creare un ramo dall'ultimo `main`. Annullare soltanto la modifica che ha introdotto la regressione tramite un nuovo commit di revert; per un merge usare il genitore principale corretto. Non forzare il ramo `main` e non ripristinare indiscriminatamente file di dati.
3. Se il revert reintroduce acquisti dell'Isola, pagamenti o errori già corretti, conservare le relative protezioni e correggere il solo problema nuovo.
4. Eseguire gli stessi controlli della pubblicazione: smoke, tutti i test offline, inventario marine, mappatura ormeggi e prova browser P0 prevista dal workflow. Una verifica fallita impedisce l'upload del sito.
5. Pubblicare il commit di ripristino tramite il normale percorso GitHub e attendere il completamento del workflow `Deploy Marina Empire`.
6. Verificare il nuovo commit in `release.json`, l'hash della homepage e il percorso ospite su desktop e mobile. Controllare che i tre vincoli permanenti siano ancora rispettati.

La suite locale offline si avvia dalla radice del repository:

```bash
node tests/smoke.cjs
for test in tests/*.test.cjs; do
  if [ "$test" != "tests/prelaunch-browser.test.cjs" ]; then
    node "$test" || exit 1
  fi
done
node scripts/check-marina-inventory.cjs
node scripts/test-visual-berth-resolver.cjs
```

La prova browser viene eseguita separatamente, sia nelle pull request sia prima del deploy:

```bash
npm ci
npx playwright install --with-deps chromium
node tests/prelaunch-browser.test.cjs
```

I test usano le versioni fissate nel lockfile e servizi esterni isolati. Non dimostrano il funzionamento di un servizio esterno o delle autorizzazioni reali del database. L'artifact del sito esclude `node_modules` e i report di collaudo.

## Percorso beta già presente

Il workflow esistente include anche il ramo `beta/private-test-2026-10-29` nella cartella pubblicata `beta-test`. Il nome del ramo non rende privata una pagina GitHub Pages. Questo comportamento non viene modificato dal gate P0: le verifiche e il manifest di versione descritti qui attestano la homepage principale, non certificano il contenuto o la revisione del ramo beta separato.
