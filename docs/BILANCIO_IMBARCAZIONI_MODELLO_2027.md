# Marina Empire — Bilancio economico delle imbarcazioni v0.1
Data: 30 ottobre 2026. **Ricerca e simulazione, NON applicare ancora al gioco.** Importi in EUR; prezzi di acquisto, utilizzo e costi qui sono IPOTESI PROGETTUALI, non offerte o preventivi verificati.

## Evidenze esterne raccolte
- [Splendid Yachting — listino charter effettivamente pubblicato](https://splendidyachting.com/charter/): esempi di prezzi "from" per Azimut 47 (14,46m) €7.450/settimana, Azimut 68 (20,98m) €27.450/settimana, Azimut 82 (24,79m) €49.950/settimana, Riva 100 (29,9m) €100.000/settimana, Princess 40M (40,16m) €175.000/settimana. Sono prezzi richiesti, NON settimane vendute o ricavi realizzati.
- [YachtFinder — rilevazione charter ottobre 2026](https://yachtfinder.co/terminal): mediane indicativamente €30.000/settimana sotto 24m, €40.000 24–30m, €89.000 30–50m, €250.000 50–70m. Campione aggregato, composizione eterogenea e tariffe 'from'.
- [International Yacht Solutions — FAQ costi operativi](https://yachtownership-solutions.com/en/faq): la regola del 10% non è universale; per 40–60m il personale può rappresentare 35–50% delle spese operative.
- [Foreland Marine — yacht running costs](https://www.forelandmarine.com/insights/understanding-yacht-management-costs-10-percent-rule): riferimento indicativo 7–15% del valore annuo, variabile per età, impiego ed equipaggio. Non è un preventivo e non si applica meccanicamente a tutte le classi.

## Distinzioni obbligatorie
- Ricavo charter: **tariffa base × settimane effettivamente vendute**, non giorni di calendario.
- APA, IVA, mance, rimborsi e depositi NON sono automaticamente fatturato del proprietario.
- Costi fissi: equipaggio, assicurazione, ormeggio, manutenzione programmata, gestione e riserva refit; costi variabili: carburante non riaddebitato, usura, pulizia, commissioni e consumabili.
- **EBITDA operativo semplificato** = tariffa base incassata - commissioni - costi di gestione; non equivale all'utile netto né al flusso di cassa. Ammortamento, finanziamento, imposte e investimenti sono separati.
- Charter commerciale solo se abilitato e conforme alla normativa: nel gioco rappresenta un requisito di operatività.

## Bilanci campione (TUTTI I VALORI NON CITATI SONO IPOTESI)
Classe | Valore acquisto ipotetico | Tariffa charter/settimana ipotetica | Settimane vendute base | Ricavo lordo | Costi annui esclusa commissione | Margine dopo commissione 20%
---|---:|---:|---:|---:|---:|---:
Open 7m | 85.000 | 2.100 | 12 | 25.200 | 18.000 | **2.160**
Cruiser 12m | 350.000 | 7.500 | 12 | 90.000 | 56.500 | **15.500**
Yacht 20m | 1.800.000 | 26.000 | 10 | 260.000 | 303.000 | **-95.000**
Yacht 30m | 6.500.000 | 60.000 | 9 | 540.000 | 1.002.500 | **-570.500**
Superyacht 50m | 38.000.000 | 300.000 | 8 | 2.400.000 | 4.650.000 | **-2.730.000**
Megayacht 60m | 65.000.000 | 450.000 | 8 | 3.600.000 | 7.310.000 | **-4.430.000**

### Scomposizione costi annuali ipotizzati (EUR)
Classe | Equipaggio | Manutenzione | Assicurazione | Ormeggio | Management | Altri (refit, servizi, consumabili)
---|---:|---:|---:|---:|---:|---:
Open 7m | 2.500 | 5.500 | 1.600 | 4.000 | 1.400 | 3.000
Cruiser 12m | 12.000 | 17.000 | 6.000 | 8.500 | 4.000 | 9.000
Yacht 20m | 110.000 | 80.000 | 27.000 | 24.000 | 20.000 | 42.000
Yacht 30m | 360.000 | 260.000 | 97.500 | 70.000 | 65.000 | 150.000
Superyacht 50m | 1.600.000 | 1.300.000 | 380.000 | 280.000 | 240.000 | 850.000
Megayacht 60m | 2.400.000 | 2.100.000 | 650.000 | 420.000 | 390.000 | 1.350.000

**Nota metodologica:** per alcune classi, il costo personale include presidio e servizi minimi; le cifre NON sono buste paga o stime convalidate per uno yacht specifico. Il 20% di commissione è un'ipotesi aggregata prudenziale, non una commissione di mercato certificata.

## Soglia di pareggio charter (settimane intere, a tariffe e costi ipotizzati)
Open 7m: 11; Cruiser 12m: 10; Yacht 20m: 15; Yacht 30m: 21; Superyacht 50m: 20; Megayacht 60m: 21. Queste soglie mostrano che possedere uno yacht grande NON garantisce un utile da charter; l'occupazione necessaria può essere poco realistica.

## Scenari dinamici
- Prudente: settimane vendute al 60% del caso base; imprevisti e manutenzione +15%.
- Base: valori della tabella.
- Alta domanda: settimane vendute al 140% del caso base (senza superare disponibilità e calendario), costi variabili crescenti e tariffe di stagione coerenti.
- Una barca ferma non produce ricavi ma sostiene costi fissi; manutenzione e certificazioni scadute bloccano il charter.

## Specifiche tecniche per il gioco (proposta, non implementazione)
- Yacht: prezzo, valore residuo, lunghezza, velocità, litri/ora per profilo di andatura, ore motore, crew minima, costo giornaliero equipaggio, assicurazione, ormeggio, manutenzione a ore e calendario, disponibilità charter.
- Calendario incarichi: ogni charter occupa la barca per un intervallo e comporta spostamento reale tra marine, rischio ritardi e costo operativo.
- Contratti charter NPC assegnati in base a domanda, stagionalità, reputazione e capacità; nessun accredito orario garantito.
- Ricavi/costi maturano offline con ledger server-side idempotente; saldi acquistati in EUR richiedono verifica pagamento e audit.
- Costi ormeggio di yacht posseduti e redditi della marina di proprietà devono essere trattati come trasferimenti interni quando appartengono allo stesso giocatore, per evitare doppio conteggio.

## Dati da acquisire prima di approvare
1. Listini **acquisto** verificabili per 6 classi (nuovo e usato, anno e motorizzazione), con date e IVA.
2. Specifiche tecniche carburante per modelli reali a velocità definite; non usare consumo generico per miglio.
3. Preventivi o benchmark equipaggio, assicurazione, ormeggio e manutenzione per classe.
4. Tariffe charter di 3–5 operatori per lunghezza, stagione e servizi inclusi.
5. Bilanci stagionali con commissioni, APA, IVA e rischi di fermo.
6. Collegare il modello yacht al bilancio delle marine, poi definire conversione crediti e progressione.

**Nessuna modifica ai prezzi o ai ricavi del gioco pubblico è autorizzata da questa bozza.**
