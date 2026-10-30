# Marina Empire — Primo bilancio marina: Rimini (modello di ricerca v0.2)
**Data:** 30 ottobre 2026. **Stato:** simulazione economica; NON è il bilancio effettivo della Marina di Rimini e NON va ancora applicato al gioco.

## 1. Fonti e dati osservabili
- Marina di Rimini, tariffario 2025–2026 (prezzi IVA inclusa): https://marinadirimini.com/wp-content/uploads/2025/09/MarinaRimini_Pieghevole-8facciate_Tariffario-2025-2026_ITA.pdf
- 622 posti barca; tariffario campione: 8 m €3.965 annui/€48 giorno; 10 m €5.290/€58; 12 m €6.720/€69; 14 m €8.155/€95; 18 m €12.120/€168; 20 m €14.325/€189; 24 m €19.780/€231.
- Le tariffe sono **riferimenti commerciali reali**, non dati su contratti effettivi, occupazione, redditività, canoni o costi del personale.

## 2. Assunzioni di lavoro da validare (NON dati reali)
- Mix di 622 posti, solo per modellazione: 100 × 8m; 170 × 10m; 145 × 12m; 100 × 14m; 65 × 18m; 30 × 20m; 12 × 24m.
- 78% capacità destinata a contratti annuali; 22% a transiti; ripartizione ipotetica uniforme per classe.
- Contratti annuali venduti: prudente 65%, base 80%, alta 90% della capacità annuale.
- Posti transito occupati: prudente 35%, base 55%, alta 72% delle notti disponibili.
- Tariffa transito media semplificata = tariffa giornaliera pubblicata × 365 giorni; **da sostituire con tariffari stagionali e prezzi medi realmente realizzati**.
- Per confronto ricavi al netto IVA, si divide provvisoriamente il prezzo IVA inclusa per 1,22 (verificare trattamento fiscale di ciascun servizio).
- Ricavi extra (energia, servizi, parcheggio, assistenza) **esclusi** per prudenza e per evitare doppio conteggio.
- Non includere il costo di acquisto della marina nel conto economico: è CAPEX/finanziamento, non spesa operativa annuale.

## 3. Formule riproducibili
Per classe i con N_i posti, quota transiti q, tariffa annuale A_i IVA inclusa e giornaliera D_i IVA inclusa:
- annuale netto = somma[N_i × (1-q) × occupazione_annuale × A_i / 1,22]
- transiti netto = somma[N_i × q × 365 × occupazione_transiti × D_i / 1,22]
- ricavi netti = annuale netto + transiti netto
- margine operativo simulato = ricavi netti - personale - manutenzione - canone - utenze - assicurazioni - amministrazione - altri costi
- cassa = margine operativo - investimenti - debito - imposte (da parametrizzare)

## 4. Ricavi annui simulati (EUR, arrotondati)
Scenario | Annuali | Transiti | Totale ricavi (al netto IVA)
---|---:|---:|---:
Prudente | 1.886.958 | 1.233.095 | **3.120.054**
Base | 2.322.410 | 1.937.721 | **4.260.132**
Alta occupazione | 2.612.712 | 2.536.653 | **5.149.365**

**ATTENZIONE:** questi valori non sono ricavi dichiarati o previsti dalla marina reale. Sono risultati meccanici di un insieme di ipotesi e tariffari pubblici.

## 5. Struttura costi di lavoro (tutte IPOTESI, EUR/anno)
Categoria | Assunzione | Costo aziendale totale
---|---|---:
Direzione / amministrazione | 3 FTE × €55.000 | 165.000
Ormeggi / assistenza nautica | 12 FTE × €43.000 | 516.000
Tecnici / manutenzione | 5 FTE × €46.000 | 230.000
Reception / prenotazioni | 4 FTE × €39.000 | 156.000
Stagionali / turni extra | forfait | 150.000
**Totale personale** | 24 FTE + stagionali | **1.217.000**

FTE = equivalente tempo pieno. I costi aziendali qui non derivano da buste paga o CCNL validati: sono placeholder da verificare con consulente del lavoro, turni e contratto applicabile.

Altri costi annui, **ipotesi**:
- Manutenzione pontili/impianti/dragaggi: €360.000
- Canoni e concessioni: €300.000
- Utenze non ribaltate sui clienti: €180.000
- Assicurazioni e sicurezza: €130.000
- Software, amministrazione, marketing: €120.000
- Fondo imprevisti e ambientale: €140.000
- **Totale altri costi: €1.230.000**
- **Totale costi operativi ipotizzati: €2.447.000/anno**

## 6. Margine operativo per scenario (EUR)
Scenario | Ricavi | Costi operativi ipotizzati | Margine operativo simulato
---|---:|---:|---:
Prudente | 3.120.054 | 2.447.000 | **673.054**
Base | 4.260.132 | 2.447.000 | **1.813.132**
Alta occupazione | 5.149.365 | 2.447.000 | **2.702.365**

Costi tenuti costanti solo per primo confronto: **in realtà personale stagionale, energia, manutenzione e servizi variano con l'attività**. Non sono stati sottratti ammortamenti, interessi, imposte, investimenti e CAPEX. Quindi NON chiamare questi valori utile netto.

## 7. Espansione: esempio incrementale ipotetico
- Nuovo pontile: 20 posti da 12m, investimento iniziale €1.600.000 (**ipotesi**, autorizzazioni e fattibilità escluse).
- Annuali 16 posti × €6.720 /1,22 = €88.131/anno (a pieno incasso), 4 posti transito × 365 × 55% × €69 /1,22 = €45.359/anno.
- Ricavi aggiuntivi simulati €133.490/anno; costi aggiuntivi stimati €95.000/anno.
- Margine incrementale €38.490/anno; payback semplice ~41,6 anni. **In questo scenario l'ampliamento NON è economicamente attraente.**
- Questo esempio serve a evitare che ogni ampliamento dia profitti automatici: richiede domanda, capacità, capitale e costi realistici.

## 8. Come tradurre nel gioco (non ancora applicato)
- Modello per posto barca e lunghezza, non 6 posti fissi per ogni marina.
- Occupazione variabile per stagione, meteo, reputazione, livello servizi, concorrenza e prezzo.
- Personale minimo e turni obbligatori; ampliamenti aumentano ricavi POTENZIALI e costi CERTI.
- Manutenzione arretrata abbassa capacità e reputazione, non solo un indicatore cosmetico.
- Incassi e spese maturano offline, contabilizzati con transazioni idempotenti server-side.
- Nessun acquisto in euro fino a ledger sicuro e conferma dei pagamenti.

## 9. Verifiche prima di approvazione
1. Confrontare mix di lunghezze e contratti annuali/transiti con dati reali disponibili.
2. Acquisire tariffari stagionali, costi concessori e costo del lavoro per CCNL/ruoli.
3. Modellare almeno una marina piccola (50–150 posti), una media (200–400), una grande (600+) e una luxury/megayacht.
4. Costruire modello yacht: costo acquisizione, carburante, manutenzione, equipaggio, assicurazione, ormeggio, charter e inattività.
5. Definire scala crediti/tempo dopo test di sostenibilità, non prima.

**Nessuna modifica al gioco pubblico è stata effettuata da questo documento.**
