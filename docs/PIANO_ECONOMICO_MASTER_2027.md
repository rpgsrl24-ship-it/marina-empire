# MARINA EMPIRE — Piano economico master v0.1
Data: 30 ottobre 2026 · Stato: **bozza di ricerca, NON applicare al gioco**
Responsabile: progetto Marina Empire / RPG Yacht

## Principi
- Distinguere rigorosamente **EUR reali**, **crediti virtuali**, **tempo reale** e **tempo di simulazione**.
- Non fissare il cambio EUR/crediti sulla base dei pacchetti in vendita: il prezzo dei crediti è una leva commerciale separata.
- Nessuna marina o barca produce utile garantito: domanda, stagionalità, occupazione, manutenzione, eventi e personale possono portare perdite.
- Separare ricavi lordi, costi operativi, EBITDA simulato, ammortamenti, investimenti (CAPEX), cassa e finanziamenti.
- Il prototipo oggi usa salvataggi locali: prima di vendere crediti, spostare ledger, acquisti e ricavi offline su server autenticato e verificabile.
- NON modificare i prezzi nel codice finché la versione master non è approvata.

## Fonti iniziali da validare
1. CCNL Approdi Marittimi: porti turistici, approdi e punti di ormeggio; livelli e minimi contrattuali, che **non** equivalgono al costo aziendale completo. https://www.lavorareturismo.it/ccnl-turismo-alberghi-pubblici-esercizi/
2. Ministero del Lavoro, tabelle costo lavoro 2026: fonte metodologica, da verificare l'applicabilità del contratto alla singola attività. https://www.lavoro.gov.it/temi-e-priorita/rapporti-di-lavoro-e-relazioni-industriali/focus-on/analisi-economiche-costo-lavoro/pagine/settore-dei-servizi-della-cultura-del-turismo-dello-sport-e-del-tempo-libero
3. Yacht management: la regola del 10% del valore annuo è una scorciatoia, non un costo universalmente valido; equipaggio, età, utilizzo, carburante, assicurazione, manutenzione e porto sono determinanti. https://yachtownership-solutions.com/en/faq
4. Stime di settore sui superyacht: range operativo orientativo 7–15% del valore annuo, da non estendere indiscriminatamente alle barche piccole. https://www.forelandmarine.com/insights/understanding-yacht-management-costs-10-percent-rule
5. Lega Navale Rimini: dati infrastrutturali reali di un punto di ormeggio, non tariffario commerciale di una marina privata. https://www.leganavale.it/rimini/ormeggio

## 1. Modello economico marina
### Variabili per ogni marina
Località, capacità totale, distribuzione per classi lunghezza (fino 8m, 8–12m, 12–18m, 18–24m, 24–40m, oltre 40m), pescaggio, concessione, canoni, servizi, stagionalità, domanda, concorrenza, rischio meteo, qualità, reputazione, occupazione e tariffe per classe e periodo.

**Ricavi annui (EUR)** = somma per classe e stagione di (posti × giorni disponibili × occupazione × tariffa giornaliera netta) + contratti annuali + energia/acqua riaddebitata + transiti + servizi tecnici + parcheggi + carburante (solo margine) + attività commerciali. Evitare doppio conteggio fra annuali e giornalieri.

**Costi annui (EUR)** = personale aziendale completo + turni stagionali + canone/concessione + energia/acqua non riaddebitata + pulizie + vigilanza + dragaggi + manutenzione pontili + assicurazioni + software/amministrazione + marketing + fondo imprevisti + costi ambientali.

**Utile operativo** = ricavi - costi. **Flusso di cassa** = incassi - uscite operative - CAPEX - servizio debito - imposte (quando modellate).

### Ampliamento
Ogni pontile: investimento iniziale, posti nuovi per classe, eventuali lavori, autorizzazioni e tempi; personale incrementale e utenze; occupazione NON garantita. L'ampliamento conviene solo se il flusso di cassa incrementale atteso ripaga l'investimento entro una soglia coerente con il gioco.

### Scenari (assunzioni da calibrare, NON dati di mercato)
Prudente: occupazione -25% vs base, costi +15%; Base: domanda e costi stimati per porto; Alta stagione: occupazione +15% con limite 100%, tariffe variabili e costo personale stagionale +10%. Le percentuali sono stress test progettuali.

## 2. Modello economico yacht
### Classi
Open 6–8m; cruiser 9–12m; yacht 13–20m; luxury 21–30m; superyacht 31–50m; mega yacht oltre 50m. Ogni classe richiede dati specifici.

**Costi fissi**: ormeggio, assicurazione, manutenzione periodica, rimessaggio, gestione, eventuale equipaggio, certificazioni.
**Costi variabili**: carburante = miglia / velocità × litri/ora × prezzo/litro; consumabili; pulizia; provvigioni charter; usura motore; ore equipaggio; rifornimenti.
**Costi straordinari**: guasti, refit, carenaggio, motori, aggiornamenti di sicurezza, fermo nave.
**Ricavi charter**: giorni venduti × tariffa per stagione/classe, meno commissioni, rimborsi e cancellazioni. Le barche inattive continuano a generare costi fissi.

### Regola fondamentale
**Nessun charter automatico senza capacità e domanda**: la flotta ha incarichi simulati, utilizzo variabile, tempi di navigazione, fermo tecnico e ricavi netti registrati con ID transazione.

## 3. Tempo e offline
- Valutare 1 giorno reale = 1 giorno economico; rotte accelerate soltanto come visualizzazione/missione, senza creare arbitraggio.
- Durante assenza: simulare in modo deterministico domanda, occupazione, charter, costi e manutenzioni; applicare un limite di recupero motivato e visibile.
- Il client mostra il riepilogo, il server è fonte autorevole. Operazioni idempotenti per evitare doppio accredito.
- Generare traffico visivo con imbarcazioni NPC in entrata/uscita: **la presenza visiva non equivale automaticamente a una prenotazione pagata**.

## 4. Progressione e monetizzazione
- Il percorso gratuito deve consentire yacht e marine con tempo e abilità, senza barriere a pagamento.
- Separare crediti acquistati e guadagnati nel ledger; controllare rimborsi, chargeback, antifrode, limiti di spesa e policy.
- Pacchetti €4,99–€999,99 attualmente mostrati nel prototipo sono **solo ipotesi**, non approvati; valutare impatto su progressione, tutela utenti e sostenibilità.
- Vietato accreditare crediti acquistati direttamente da JS/browser; serve conferma webhook server-side con identificativo ordine univoco.

## 5. Tabelle dati da costruire
MARINE: id, porto, classe, posti_per_lunghezza, tariffa_stagione, occupazione, canone, personale_FTE, costo_lavoro, utilities, manutenzione, assicurazione, investimenti, finanziamenti.
YACHT: id, classe, lunghezza, prezzo, età, valore residuo, litri_ora, velocità, equipaggio, assicurazione, manutenzione, ormeggio, charter_tariffa, giorni_venduti, commissione.
TRANSAZIONI: id_univoco, owner_id, asset_id, timestamp, categoria, lordo, costi, netto, valuta, scenario, fonte, stato.
ASSUNZIONI: valore, unità, fonte URL, data, livello_confidenza, aggiornato_il.

## 6. Lavoro ancora necessario prima dell'implementazione
1. Raccogliere listini ufficiali 2025–2027 per 5–10 marine italiane (Rimini, Cervia, Lignano, Ancona, Porto Cervo, ecc.) con lunghezza barca e stagione.
2. Raccogliere listini prezzi di acquisto e charter per yacht rappresentativi di ogni classe.
3. Definire costo aziendale del personale per mansione e copertura turni, verificando CCNL applicabile.
4. Costruire modello comparabile per marina piccola/media/grande e yacht per classe, con P&L e flusso di cassa.
5. Stress-test su almeno 3 scenari e progressione giocatore gratuito vs acquisti facoltativi.
6. Approvazione del modello, migrazione compatibile con i salvataggi e test in staging prima di pubblicazione.

## Avvertenze
I numeri attualmente codificati nel gioco (prezzi marina, rendite giornaliere, tariffa ormeggi e charter automatici) sono provvisori e **non derivano da una stima integrata di mercato**. Questo documento costituisce la base di progettazione, non un business plan finanziario validato.
