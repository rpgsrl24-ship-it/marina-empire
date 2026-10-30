# Marina Empire — Simulatore economico v0.1

Questo prototipo **non modifica il gioco**. Aprire `simulatore-economico.html` in un browser per confrontare tre scenari. I parametri sono **ipotesi progettuali**: le tariffe di Rimini derivano dal tariffario pubblico 2025–2026, ma mix di posti, occupazione e costi sono assunzioni, non risultati economici effettivi.

Le formule del simulatore sono tutte visibili nel file HTML e non usano servizi esterni.

## Verifiche
- 622 posti nel mix di Rimini; nessuna sovrapposizione tra annuali e transiti.
- Ricavi al netto dell'IVA ipotizzata al 22%.
- Costi fissi e variabili separati.
- Yacht con charter limitati a 52 settimane e commissione sulle settimane vendute.
- Scenario prudente/base/alta domanda.
- Risultati separati per marina, yacht e consolidato.
- Nessuna conversione diretta euro/crediti: scala crediti da definire dopo validazione.
- Nessun salvataggio o acquisto: simulazione illustrativa locale.

## Riferimenti
- `docs/BILANCIO_MARINA_RIMINI_MODELLO_2027.md`
- `docs/BILANCIO_IMBARCAZIONI_MODELLO_2027.md`
- `docs/ECONOMIA_INTEGRATA_MARINE_FLOTTA_2027.md`
- `docs/PROGRESSIONE_CREDITI_E_MONETIZZAZIONE_2027.md`

**Da validare:** stagionalità delle tariffe, IVA applicabile, prezzi d'acquisto, organico, costi charter, domanda e modello di finanziamento.
