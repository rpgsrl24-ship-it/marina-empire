# MARINA EMPIRE — PROGRESSIONE E BILANCIAMENTO CREDITI
Versione 0.4 — 30 ottobre 2026. **PROPOSTA NON APPROVATA, NON APPLICATA AL GIOCO.**

## 1. Stato attuale verificato nel codice index.html
- Flotta: RPG Academy 8 gratuita; RPG Open 7 80.000 crediti; Cruiser 12 350.000; Prestige 14 650.000; Elite 20 1.800.000; Majesty 30 6.000.000; Imperial 60 45.000.000.
- Marina più economica: Isola delle Rose 5.000.000; Cervia 6.500.000; Rimini 8.000.000; Porto Cervo 85.000.000.
- Missioni campione: S001 premio 1.500, costo 250 => margine diretto 1.250; S002 4.500 - 900 => 3.600; S003 6.900 - 1.900 => 5.000. Altre spese e risorse vanno considerate.
- Premi carriera: 3 missioni +1.500; 6 +3.000; 10 +6.000; 20 +10.000; 35 +18.000; 50 +30.000; 100 +65.000.
- Attuale codice include rendite automatiche marina, posti barca e charter; questi flussi NON sono ancora calibrati su P&L e possono causare inflazione.
- I pacchetti crediti visualizzati nel prototipo sono solo anteprime e non costituiscono un listino approvato.

## 2. Scopo del free-to-play
La monetizzazione deve offrire comodità, personalizzazione e accelerazione moderata, non bloccare il gameplay.
Obiettivi PROPOSTI (non dati reali):
- Prima barca acquistata (Open 7): 4–8 ore di gioco attivo per un nuovo utente che segue il tutorial e le missioni.
- Seconda classe (Cruiser 12): 15–30 ore cumulative, includendo missioni più remunerative e gestione iniziale.
- Prima attività economica/servizio portuale: 8–15 ore cumulative; deve essere possibile PRIMA dell'acquisto di una marina completa.
- Prima quota o gestione in concessione di piccola darsena: 25–50 ore cumulative, senza dover spendere milioni.
- Prima marina completa: obiettivo di medio-lungo periodo, indicativamente 60–120 ore attive + progressione economica offline non garantita.
- Superyacht e marina luxury: obiettivi endgame, con attività economiche e requisiti di reputazione.

**Nota critica:** con il prezzo attuale di 5.000.000 per la prima marina e missioni da 1.250–5.000 netti, senza attività intermedie il percorso è eccessivamente lungo. Non ridurre necessariamente il valore delle marine: introdurre concessioni, quote, contratti di gestione, leasing e imprese di servizio con capitali iniziali inferiori.

## 3. Scala economica proposta
- Mantenere 1 credito come unità nominale interna di contabilità, SENZA dichiarare parità con EUR.
- Conservare temporaneamente i prezzi già mostrati, poi ricalibrare tutto insieme sulla base del modello economico.
- I prezzi delle barche sono **prezzi di acquisto virtuali**, non quotazioni reali.
- Contabilità di ogni asset in crediti/giorno; P&L in EUR usato solo come guida per rapporti relativi, non come cambio fisso.
- Ricompense missioni = corrispettivo - carburante - equipaggio - manutenzione imputata - tasse/commissioni di gioco, non premi gratuiti aggiuntivi.
- Nessun rendimento minimo garantito per yacht o marina.

## 4. Test quantitativo di accessibilità: prima barca
Assunzioni solo per calcolo:
- Prezzo Open 7: 80.000.
- Capitale iniziale ipotetico: 10.000 (da verificare nel codice).
- Risparmio necessario: 70.000.
- Margine medio effettivo missione principiante: 2.500 (ipotesi; S001–S003 variano 1.250–5.000 prima di altri costi).
- Missioni richieste senza premi carriera: 70.000 / 2.500 = **28 missioni**.
- Con premi carriera ottenibili entro 20 missioni (+20.500 cumulativi): 49.500 / 2.500 = **circa 20 missioni** (semplificazione, senza premi ulteriori e spese di gestione).
- Se una missione completa richiede 15 minuti reali tra navigazione e gestione, 20 missioni = **5 ore attive**.
- Questi risultati dipendono dalla durata reale e dalla ripetibilità delle missioni: il gioco oggi usa simulazioni accelerate; servono test e anti-farming.

## 5. Obiettivi di progressione per livelli (PROPOSTA)
Fase | Capitale/asset | Attività principale | Nuovo meccanismo
---|---|---|---
1. Allievo armatore | Academy 8 | missioni locali, navigazione | carburante e costi di viaggio
2. Primo proprietario | Open 7 | servizi brevi e piccoli charter | manutenzione programmata
3. Piccola impresa | Cruiser 12 | charter, consegne, servizi | equipaggio e prenotazioni
4. Gestore portuale | impresa/contratto di marina | posti in gestione, servizi | bilancio attività
5. Armatore professionale | yacht 14–20m | flotta, equipaggi e charter | più contratti e downtime
6. Marina imprenditoriale | quota/concessione | ormeggi, stagionalità, personale | CAPEX, cashflow, rischio
7. Gruppo nautico | marina completa + flotta | espansioni, partnership | finanza e reputazione
8. Luxury empire | superyacht + luxury marina | charter premium, eventi | strategia endgame

## 6. Fonti e sink di crediti
Fonti: missioni NPC, contratti charter NPC, premi carriera una tantum, servizi a NPC, attività portuali NPC.
Trasferimenti: ormeggi e servizi tra giocatori (saldo complessivo invariato).
Sink: carburante NPC, stipendi, manutenzione, concessioni, assicurazioni, commissioni NPC, imposte virtuali se introdotte, asset nuovi acquistati dal sistema.
**KPI**: inflazione (prezzi asset/ricavi), saldo totale emesso, percentuale guadagni passivi, giorni per comprare primo asset, quota utenti con saldo negativo, concentrazione ricchezza.

## 7. Limiti di rendita passiva (DA TESTARE)
- Nessun accredito automatico a tariffa fissa per yacht inutilizzati.
- Contratti NPC finiti, calendario e domanda limitata.
- Costi fissi giornalieri obbligatori.
- Non imporre un tetto arbitrario ai profitti di una marina ben gestita; bilanciare con domanda, costi, investimenti e rischio.
- Evitare che l'utente possa creare moneta infinita ricaricando la pagina o cambiando orologio locale.

## 8. Pacchetti a pagamento: policy proposta
- NON attivare i prezzi del prototipo (€4,99, €9,99, €19,99, €39,99, €99,99, €299,99, €999,99) senza revisione di valore, tutela consumatori, fiscalità e sicurezza.
- Evitare pacchetti molto elevati che consentono di saltare immediatamente tutta la progressione.
- Considerare monetizzazione principalmente cosmetica: livree, personalizzazione marina, bandiere, stemmi, arredi, pass stagionale non pay-to-win.
- Se crediti acquistabili: soglie di spesa e avvisi, politica rimborsi, acquisti autenticati, niente saldo solo localStorage.
- Prima dei pagamenti reali, definire un backend con wallet e ledger, idempotenza, controlli antifrode e webhook provider.

## 9. Test prima dell'implementazione
1. 100 partite simulate senza acquisti: percentuale che raggiunge Open 7, Cruiser 12 e prima gestione portuale entro obiettivi.
2. 100 partite con piccoli acquisti facoltativi: confronto tempi, senza vantaggio impossibile da recuperare.
3. 30 giorni simulati: somma fonti/sink, guadagni medi, mediani e 95° percentile, inflazione.
4. 3 stagioni per 4 taglie marina; scenari perdita e guasto; capacità posti e personale.
5. 3 classi yacht: charter, costi di fermo, assicurazione e manutenzione.
6. Regressione salvataggi attuali: nessuna perdita asset, missioni, crediti, profilo.
7. Test anti-exploit: refresh, due schede, data alterata, chiamate ripetute, saldi negativi.

## 10. Decisioni richieste prima di cambiare il gioco
- Confermare obiettivi temporali free-to-play e introduzione di concessioni/quote come fase intermedia.
- Confermare che i pacchetti a pagamento NON devono comprare direttamente una marina luxury al primo giorno.
- Scegliere se la valuta di gioco sarà solo crediti o crediti + reputazione/licenze.
- Scegliere politica per insolvenza e fallimento: recupero e ristrutturazione preferibili a perdita totale.
- Convalidare tariffari e costi reali prima di trasformare gli importi EUR in parametri di gioco.

**Nessuna modifica al codice pubblico.**
