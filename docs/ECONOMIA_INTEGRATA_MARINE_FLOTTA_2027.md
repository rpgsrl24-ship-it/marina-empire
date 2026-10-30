# MARINA EMPIRE — ECONOMIA INTEGRATA MARINE + FLOTTA
Versione 0.3 | 30 ottobre 2026 | STATO: PROPOSTA DA VALIDARE, NON APPLICATA AL GIOCO

## 0. Documenti di riferimento
- docs/PIANO_ECONOMICO_MASTER_2027.md
- docs/DATI_REALTA_MARINE_2026.md
- docs/BILANCIO_MARINA_RIMINI_MODELLO_2027.md
- docs/BILANCIO_IMBARCAZIONI_MODELLO_2027.md

Tutti i valori EUR nei bilanci di esempio sono ipotesi e simulazioni, non conti economici effettivi. Tariffari pubblicati e dati osservati vanno tenuti distinti da prezzi, occupazione, personale e costi stimati. Non usare il prezzo di una marina come se fosse il valore commerciale della concessione.

## 1. Obiettivi
1. Simulazione nautica credibile e comprensibile: una marina e uno yacht possono essere in utile o perdita.
2. Flussi monetari coerenti: una spesa del giocatore A può essere un ricavo del giocatore B, senza duplicare moneta.
3. Nessuna rendita garantita: attività, domanda, costi, stagionalità, eventi e rischio contano.
4. Progressione free-to-play realmente possibile, acquisti facoltativi senza rendere inutile la gestione.
5. Contabilità riproducibile anche offline, con controllo server-side prima di attivare acquisti in denaro reale.

## 2. Tre livelli monetari rigorosamente separati
- EUR_REAL: dati di mercato, listini, simulazioni di benchmark e costo economico reale. Non spendibile nel gioco.
- CREDITI_GAME: valuta virtuale per asset, salari, carburante, canoni, riparazioni e pagamenti tra giocatori.
- EUR_PAGAMENTO: euro pagati a RPG Yacht per pacchetti facoltativi; transazioni reali gestite da provider e backend, mai da JavaScript client.

Non assumere che 1 credito = 1 euro, né ricavare il cambio dal prezzo dei pacchetti. Definire una scala economica globale solo dopo avere testato la progressione.

## 3. Entità del modello
PLAYER(id, wallet_id, reputazione, livello, regione, company_id)
MARINA(id, owner_id, capacity_by_length, occupancy_by_season, annual_contracts, transit_berths, tariffs, concession_cost, staff_roster, utilities, maintenance_status, upgrades, reserve_cash)
BERTH(id, marina_id, length_class, occupied_from, occupied_to, customer_id, tariff, service_bundle)
YACHT(id, owner_id, home_marina_id, length, age, value, engine_profile, fuel, crew, insurance, maintenance_schedule, commercial_license, charter_availability, current_trip)
CHARTER_CONTRACT(id, yacht_id, customer_id, marina_departure, marina_arrival, dates, gross_fee, broker_fee, fuel_terms, status)
LEDGER_ENTRY(id, batch_id, account_id, asset_id, currency, amount_signed, category, event_id, timestamp, source)
ECONOMY_EVENT(id, event_type, simulation_period, deterministic_seed, status, processed_at)
WORLD_DEMAND(marina_id, date, season, weather, reputation, competitor_pressure, demand_by_length)

## 4. Partita doppia semplificata per flussi tra utenti
Ogni evento ha un identificativo univoco, timestamp, causale, saldo prima/dopo e registrazioni collegate.
Esempio: yacht di A paga 1.000 crediti alla marina di B.
- Conto A: -1.000 (costo ormeggio).
- Conto B: +1.000 (ricavo ormeggio).
- Bilancio dei wallet dei giocatori: 0 crediti netti creati.
Se la marina appartiene allo stesso giocatore, contabilizzare trasferimento interno per il P&L degli asset ma NON aumentare/diminuire il wallet consolidato due volte.
I pagamenti a NPC, stipendi, manutenzione e carburante sono sink di crediti; ricompense missioni e domanda NPC sono fonti controllate di crediti. Misurare sempre emissione netta.

## 5. Ricavi e costi delle marine
Ricavi:
- Ormeggi annuali = posti annuali effettivamente contrattualizzati × tariffa per classe.
- Transiti = notti effettivamente vendute × tariffa stagionale per classe.
- Servizi = margine su energia, acqua, assistenza, alaggio, parcheggi, attività e concessioni commerciali.
Costi:
- Personale: FTE e turni × costo aziendale + stagionali.
- Concessione/canone; utenze; manutenzione ordinaria e straordinaria; sicurezza; assicurazioni; pulizia; amministrazione; marketing; riserva imprevisti.
- Investimento pontili (CAPEX) e finanziamenti separati dai costi operativi.
- Non contare la stessa capacità sia come annuale sia come transito nello stesso intervallo.
- Se occupazione bassa, spese fisse restano. Se capacità ampliata, aumentano costi certi e ricavi solo potenziali.

## 6. Ricavi e costi della flotta
Ricavi:
- Charter confermati × tariffa, con stagionalità, reputazione, disponibilità e commissioni.
- Missioni, trasferimenti e servizi nautici, evitando doppia remunerazione dello stesso viaggio.
Costi:
- Ormeggio, equipaggio, assicurazione, manutenzione a tempo e ore motore, rifornimenti, provviste, pulizia, commissioni, gestione e guasti.
- Costi fissi anche a barca ferma; ricavi soltanto con contratto.
- Se yacht fermo per manutenzione, non può generare charter.
- Se yacht assegnato a missione attiva, non può essere contemporaneamente in charter NPC.
- Il prezzo di acquisto non va sottratto tutto dal P&L annuale; va trattato come investimento e ammortamento/valore residuo separati.

## 7. Integrazione marina ↔ yacht
1. Assegnazione ormeggio: yacht cerca posto compatibile con lunghezza/pescaggio, paga tariffa e servizi.
2. Contratto: ormeggio annuale o transito; occupazione aggiornata.
3. Arrivo/partenza yacht: slot liberato o occupato; eventuale lista d'attesa.
4. Servizi: fuel, acqua, energia, assistenza e manutenzione creano eventi con costi e margini.
5. Marina di altro giocatore: pagamento tra wallet; marina NPC: sink e quota di ricavi NPC.
6. Yacht e marina dello stesso giocatore: costi/ricavi interni visibili nei singoli bilanci, eliminati nel consolidato.
7. Nessun doppio accredito se un giocatore aggiorna pagina o entra da due dispositivi.

## 8. Stagioni, domanda e attività visiva
- Per ogni marina, occupazione per classe e periodo con limiti di capacità.
- Domanda dipende da stagione, meteo, reputazione, prezzi, servizi, eventi e concorrenza.
- Traffico visivo NPC sempre presente, ma solo una parte delle barche genera contratti economici reali nel motore di simulazione.
- Yacht visibili su rotte coerenti e tempi di transito; simulazione grafica interpolata, non movimento reale di imbarcazioni AIS.
- Variazione meteo e domanda possono far diminuire i ricavi e aumentare le spese.

## 9. Offline e tempo
Proposta iniziale: 1 giorno reale = 1 giorno economico; missioni e rotte visivamente accelerate, senza creare ricavi moltiplicati.
- Il server calcola eventi giornalieri/orari e li registra una sola volta, con event_id univoco.
- Al rientro, il client riceve saldo, bilancio e lista eventi, senza simulare/accreditare autonomamente.
- Eventi di charter devono avere inizio/fine, imbarcazione assegnata e risorse bloccate per la durata.
- Definire una finestra offline e la politica di inattività, senza cancellare costi fissi in modo arbitrario.
- Se saldo insufficiente: debito operativo, reputazione in calo, attività sospese o liquidazione, con limiti e UX appropriati; nessuna richiesta automatica di pagamento reale.

## 10. KPI del bilancio
MARINA: fatturato annuali, fatturato transiti, ricavi servizi, occupazione per classe, costo personale, canone, manutenzione, EBITDA, CAPEX, liquidità, ROI, payback.
YACHT: settimane charter vendute, tariffa media, costi fissi, costi per missione, margine per charter, downtime, ore motore, manutenzione arretrata, liquidità, ROI.
GIOCATORE: liquidità, valore asset, debiti, ricavi, costi, utile operativo, cash flow, patrimonio netto virtuale.
MONDO: emissioni crediti, sink, crediti acquistati, inflazione, concentrazione ricchezza, progressione senza acquisti, frodi.

## 11. Esempio integrato di una giornata (CREDITI, SOLO ESEMPIO)
A possiede uno yacht e B una marina.
- A incassa da NPC 20.000 per un charter completato: A +20.000; economia NPC -20.000.
- A paga B 2.000 per ormeggio: A -2.000; B +2.000.
- A paga 6.000 tra carburante, equipaggio e manutenzione: A -6.000 (sink).
- B paga 1.200 per personale e utenze: B -1.200 (sink).
- A netto +12.000; B netto +800; somma wallet giocatori +12.800.
- Fonte netta NPC +20.000 meno sink 7.200 = +12.800. Nessun credito duplicato tra A e B.
**Valori inventati per mostrare la quadratura contabile, NON benchmark reali.**

## 12. Roadmap prima del rilascio
Fase A: raccogliere fonti ufficiali, validare costi, prezzi e domanda per marine piccole/medie/grandi/luxury e yacht 7–60m.
Fase B: modello parametrico EUR e tre scenari per asset; test di ROI e casi in perdita.
Fase C: definire scala crediti, tempi di progressione e limiti dei pacchetti facoltativi.
Fase D: prototipo server-side di wallet, ledger e simulazione offline, con migrazione dei salvataggi.
Fase E: UI bilanci per singolo asset, ormeggi reali nel gioco, traffico e contratti NPC.
Fase F: test automatizzati di quadratura, idempotenza, capacità, concorrenza, saldi negativi e frodi.
Fase G: pagamenti veri solo con webhook verificati, riconciliazione e policy utenti.

## 13. Test di accettazione obbligatori
- Due giocatori, trasferimento 1.000: saldo totale invariato.
- Acquisto in-game: wallet diminuisce, asset compare, evento unico.
- Ricarica browser/ripresa offline: nessuna duplicazione.
- Stesso yacht non accetta due charter contemporanei.
- Posto occupato non può essere venduto due volte.
- Costi fissi vengono applicati anche senza clienti.
- Ampliamento senza domanda può generare perdita.
- Stessa proprietà yacht+marina non gonfia il consolidato.
- Ricompensa missione e contratto charter non pagano due volte lo stesso servizio.
- Crediti acquistati non vengono accreditati senza pagamento confermato lato server.

## Decisioni ancora aperte
- Scala crediti rispetto ai valori EUR di riferimento.
- Occupazione media e mix annuale/transito per singola marina.
- Costi equipaggio e gestione verificati per yacht e dimensioni.
- Regole di finanziamento, insolvenza, concessionari e ampliamenti.
- Finestra offline e granularità simulazione.
- Protezione minori, limiti di spesa, rimborsi e policy per vendite di crediti.

**Nessuna modifica al codice di gioco è prevista finché il piano non è validato.**
