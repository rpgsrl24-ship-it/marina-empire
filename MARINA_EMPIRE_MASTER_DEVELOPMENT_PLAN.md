# MARINA EMPIRE — MASTER DEVELOPMENT PLAN
**Baseline ufficiale:** 4 novembre 2026  
**Repository:** rpgsrl24-ship-it/marina-empire  
**Branch di riferimento:** main  
**Baseline commit verificato:** 9a5910a596068c4fbe56d2ab064c0bbb09867358

## 1. Obiettivo del progetto

Marina Empire deve diventare un gestionale/tycoon internazionale del mondo nautico reale, non un semplice gioco di missioni.

Percorso giocatore:

**Comandante → Armatore → Operatore Nautico → Marina Manager → Imprenditore Nautico → Marina Empire**

Il mondo deve rimanere vivo anche quando il giocatore non sta completando una missione, con traffico, marine operative, NPC, contratti, eventi, economia e competizione.

## 2. Regole non negoziabili

1. Isola delle Rose resta la base operativa RPG Yacht, non acquistabile e non gestibile dai giocatori.
2. Le scene 3D originali approvate non vengono ridisegnate senza decisione esplicita.
3. Nessuna nuova funzione isolata: ogni sistema deve collegarsi ad almeno due tra economia, reputazione, carriera, mondo vivo, community.
4. Nessuna regressione economica: mutazioni sensibili devono restare protette da persistenza atomica e test.
5. Nessuna attivazione delle prenotazioni reali condivise finché mapping 3D↔database, RLS, collisioni e test multiutente non sono completati.
6. Mobile e desktop devono essere entrambi verificati.
7. Realismo nautico sì, simulatore professionale no: il realismo deve migliorare il gameplay.
8. Prima di iniziare un nuovo macro-blocco, il blocco precedente deve superare il checkpoint.

## 3. Stato attuale del gioco

Le percentuali sono stime di maturità progettuale, non metriche automatiche.

| Area | Stato stimato | Situazione |
|---|---:|---|
| Stabilità tecnica / test | 90% | Deploy, smoke, mission regression, UX audit e Credit Release Gate verdi sulla baseline |
| Home / UI generale | 85% | Struttura consolidata, ancora da alleggerire quando cresceranno i nuovi sistemi |
| Mobile | 82% | Molto migliorato; necessario continuare test reali dopo ogni blocco |
| Navigazione | 82% | Rotte, carburante, meteo simulato, plancia e viaggio funzionanti |
| Flotta / yacht | 80% | Acquisto, selezione, carburante, condizione, rendite charter automatiche |
| Missioni | 78% | Funzionanti, con eventi e varianti; da rendere meno ripetitive |
| Economia | 82% | Crediti, costi, rendite, marina, attività, manutenzione e controlli atomici |
| Progressione carriera | 75% | 5 fasi attive e collegate a viaggi, flotta, attività, reputazione e catene |
| Marine vive | 75% | Traffico 24/7, VHF, NPC, eventi, livelli operativi e catene |
| Reputazione locale | 80% | Benefici e sconti per marina, collegati ai servizi |
| Contratti dinamici | 70% | Bacheca dinamica e catene operative presenti; varietà ancora limitata |
| VHF / Port Control | 78% | Buona base; da separare meglio da VTS e traffico commerciale |
| Eventi / emergenze | 70% | Presenti; da ampliare e collegare maggiormente al mondo |
| Marketplace | 60% | Base presente; non ancora un vero mercato nautico completo |
| Community | 60% | Chat e presenza in beta; da trasformare in sistema sociale permanente |
| Leaderboard | 70% | Assoluta + stagioni settimanali/mensili e premi |
| Obiettivi / achievement | 75% | Daily, weekly, streak, trofei e titoli |
| 3D marine | 68% | Scene originali protette; logica e visualizzazione ancora da integrare meglio |
| Multiplayer persistente | 45% | Account/cloud/leaderboard presenti, economia condivisa ancora parziale |
| Prenotazione posti barca reale | 35% | Schema e protezioni presenti, mapping visuale/database non validato |
| Monetizzazione crediti | 70% | Infrastruttura e release gate presenti; ogni modifica richiede verifica specifica |
| Equipaggi | 5% | Non esiste ancora un vero sistema crew |
| Charter completo | 25% | Charter economico presente, manca il ciclo cliente-equipaggio-ospiti-itinerario-rating |
| Cantieri / refit | 5% | Mancante come sistema gestionale |
| Economia a terra | 30% | Alcune attività nautiche presenti, manca ecosistema completo |
| AIS / traffico marittimo interattivo | 10% | Traffico marina simulato presente, manca navigazione interattiva con traffico |
| Ambiente / Green Marina | 5% | Quasi assente |
| Internazionalizzazione | 15% | Concept internazionale, contenuti e geografia ancora principalmente italiani |

### Valutazione complessiva

- **Beta pubblica attuale:** circa 80%
- **Gestionale nautico italiano completo:** circa 55–60%
- **Visione internazionale Marina Empire:** circa 40–45%

Il problema principale non è più la quantità di funzioni: è integrare i sistemi in cicli di gioco profondi e durevoli.

## 4. Priorità strategiche

Ordine ufficiale di sviluppo:

1. Mondo vivo 2.0 e contratti persistenti
2. Equipaggi
3. Charter 2.0
4. Cantieri / refit
5. Economia a terra
6. Marketplace nautico completo
7. AIS / traffico / VTS
8. Emergenze e SAR avanzati
9. Ambiente / Green Marina
10. Multiplayer economico server-side
11. Espansione geografica e lingue
12. PWA / store mobile

---

# BLOCCO A — CONSOLIDAMENTO DEL MONDO VIVO

## Obiettivo
Completare ciò che è già stato costruito prima di aprire sistemi completamente nuovi.

### Da fare
- ampliare classi NPC: superyacht, vela, tender, pilot boat, pescherecci, traghetti, cargo, rescue;
- dare identità persistente ad alcuni yacht NPC;
- far proseguire la storia dello stesso yacht tra arrivo, servizi e partenza;
- aumentare varietà delle catene operative;
- provisioning;
- water toys;
- security;
- transfer VIP;
- assistenza tecnica differenziata;
- eventi stagionali e marina-specifici;
- rendere più visibile il livello operativo della marina;
- collegare traffico, reputazione, operatività e domanda economica.

### Criterio di completamento
Entrando in una marina per 15–20 minuti il giocatore deve vedere attività diverse e avere sempre almeno una decisione utile da prendere.

## CHECKPOINT A

Prima del Blocco B controllare:
- deploy;
- smoke;
- mission regression;
- UX desktop/mobile;
- economia;
- velocità pagina;
- leggibilità mobile;
- varietà effettiva dei contratti;
- assenza di attività duplicate o troppo redditizie;
- durata percepita del gameplay.

Decisione checkpoint:
**CONTINUA / CORREGGI / SEMPLIFICA**

---

# BLOCCO B — EQUIPAGGI

## Obiettivo
Trasformare lo yacht da semplice asset a unità gestionale.

### Versione 1
Ruoli:
- Captain;
- First Officer;
- Engineer;
- Deckhand;
- Steward/ess;
- Chef.

Statistiche:
- competenza;
- esperienza;
- morale;
- stipendio;
- reputazione;
- specializzazione.

Effetti:
- consumo;
- usura;
- sicurezza;
- qualità charter;
- tempi di manutenzione;
- soddisfazione ospiti.

### Progressione
Reclutamento → contratto → esperienza → specializzazione → equipaggio premium.

### Criterio di completamento
Due yacht identici con equipaggi diversi devono avere risultati economici e operativi diversi.

## CHECKPOINT B
Controllare:
- complessità UI;
- costo stipendi;
- impatto reale ma non eccessivo;
- equilibrio free-to-play;
- gestione da mobile;
- salvataggio e compatibilità partite vecchie.

---

# BLOCCO C — CHARTER 2.0

## Obiettivo
Trasformare il charter da missione a mini-gestionale.

### Ciclo
Richiesta cliente → yacht → equipaggio → itinerario → provisioning → fuel → ospiti → attività → imprevisti → rientro → recensione.

### Clienti
- famiglia;
- corporate;
- VIP;
- luxury;
- honeymoon;
- evento;
- influencer.

### Variabili
- budget;
- preferenze;
- durata;
- destinazioni;
- livello servizio;
- rating.

### Risultato
Rating charter, reputazione e clienti migliori.

## CHECKPOINT C
Misurare:
- durata media charter;
- margine;
- tasso di successo;
- varietà;
- chiarezza per nuovo giocatore;
- differenza reale tra yacht/equipaggi.

---

# BLOCCO D — CANTIERI E REFIT

## Obiettivo
Creare il secondo grande motore economico dopo charter e marine.

### Servizi
- motore;
- generatori;
- elettronica;
- stabilizzatori;
- teak;
- verniciatura;
- interni;
- alaggio;
- dry dock;
- refit completo.

### Progressione
Cliente cantiere → preventivo → risorse → tecnici → tempi → imprevisti → consegna → margine/reputazione.

Il giocatore inizialmente usa cantieri NPC e successivamente può possedere/gestire un cantiere.

## CHECKPOINT D
Controllare:
- equilibrio tra charter, marina e refit;
- tempi;
- ritorno economico;
- rischio;
- varietà contratti;
- rischio di diventare solo un gioco di menu.

---

# BLOCCO E — ECONOMIA A TERRA

## Obiettivo
Trasformare la marina in un ecosistema turistico e commerciale.

### Attività
- ristorante;
- bar;
- yacht club;
- hotel;
- chandlery;
- negozio nautico;
- supermarket;
- lavanderia;
- water toys;
- diving;
- scuola vela;
- rent car;
- taxi boat;
- transfer VIP;
- charter agency;
- broker.

### Formula economica
Rendimento = traffico × stagione × reputazione × eventi × livello marina × qualità gestione.

## CHECKPOINT E
Controllare:
- inflazione;
- rendite passive;
- utilità di visitare marine diverse;
- differenziazione geografica;
- equilibrio acquisto/gestione.

---

# BLOCCO F — MARKETPLACE NAUTICO COMPLETO

Quattro mercati:
1. yacht;
2. attrezzatura;
3. servizi;
4. business.

### Fase iniziale
NPC market dinamico.

### Fase successiva
Mercato tra giocatori solo con logica server-side e antifrode.

## CHECKPOINT F
Controllare:
- prezzi;
- arbitraggio;
- exploit;
- liquidità mercato;
- valore del broker;
- protezione economia.

---

# BLOCCO G — NAVIGAZIONE INTERATTIVA, AIS E VTS

## Obiettivo
Rendere interessante anche il viaggio.

### AIS simulato
- nome;
- tipo;
- rotta;
- velocità;
- destinazione;
- ETA.

### Situazioni
- attraversamento;
- sorpasso;
- canale;
- traghetto;
- cargo;
- maltempo;
- unità SAR.

### Separazione corretta
**Marina VHF** = ormeggio e servizi.  
**Port Control/VTS** = traffico e sicurezza.

Non deve essere presentato come sistema professionale/certificato.

## CHECKPOINT G
Controllare:
- divertimento;
- numero di interazioni;
- rischio di rallentare troppo i viaggi;
- chiarezza mobile;
- coerenza nautica.

---

# BLOCCO H — EMERGENZE, SAR E GREEN MARINA

### Emergenze
MAYDAY, PAN PAN, uomo a mare, incendio, avaria, collisione, deriva, evacuazione medica.

### Ambiente
- shore power;
- pump-out;
- riciclo;
- solare;
- ricarica elettrica;
- gestione rifiuti.

Green Marina = prestigio + domanda premium + eventi.

## CHECKPOINT H
Bilanciamento prestigio, rischi, frequenza emergenze e ritorno economico degli investimenti green.

---

# BLOCCO I — SERVER-SIDE / MULTIPLAYER ECONOMICO

Solo dopo che il single-player/online hybrid è maturo.

Portare lato server:
- economia condivisa;
- marketplace player-to-player;
- prenotazioni;
- stagioni;
- business;
- inventario condiviso;
- transazioni.

### Prenotazioni posti barca
Prima dell'attivazione reale:
- mapping 3D↔DB verificato;
- RLS;
- test due utenti;
- collision test;
- idempotenza;
- protezione Isola delle Rose.

## CHECKPOINT I
Security review completa e test multiutente.

---

# BLOCCO J — ESPANSIONE INTERNAZIONALE

Ordine:
1. Italia completa;
2. Croazia;
3. Francia / Monaco;
4. Spagna;
5. Grecia;
6. Mediterraneo;
7. Caribbean / Florida / Dubai / altri hub.

Lingue:
IT → EN → DE → FR → ES.

Ogni paese deve avere caratteristiche economiche e marine diverse, non solo nuovi punti sulla mappa.

---

# BLOCCO K — MOBILE / APP

Prima PWA stabile.

Poi:
- installazione;
- notifiche;
- sessioni;
- performance;
- touch UX;
- Android / Play Store;
- successivamente iOS se giustificato.

---

## 5. Protocollo di controllo durante lo sviluppo

Non aspettiamo la fine del progetto.

### Mini-checkpoint
Ogni **3–5 commit di funzionalità**:
- test automatici;
- controllo errori console;
- rapido controllo mobile;
- verifica economia;
- verifica che il nuovo sistema sia collegato alla carriera.

### Checkpoint di fase
Alla fine di ogni Blocco A–K:
1. test tecnici;
2. test gameplay;
3. test mobile;
4. bilanciamento economia;
5. durata/varietà;
6. chiarezza UI;
7. confronto con mondo nautico reale;
8. decisione CONTINUA / CORREGGI / SEMPLIFICA.

### Checkpoint strategico
Dopo ogni **3 macro-blocchi**:
- rivalutazione dell'intero gioco;
- aggiornamento percentuali;
- verifica concorrenti/mercato;
- controllo monetizzazione;
- revisione priorità.

---

## 6. KPI da monitorare

Quando disponibili:
- nuovi giocatori;
- registrazioni;
- ritorno D1 / D7;
- durata sessione;
- missioni per sessione;
- catene completate;
- marine visitate;
- yacht acquistati;
- percentuale utenti che arriva ad Armatore / Operatore / Marina Manager;
- utilizzo community;
- utilizzo marketplace;
- errori runtime;
- performance mobile;
- acquisti crediti, se attivi;
- abbandono nei primi minuti.

Il KPI principale non deve essere solo il numero di funzioni.

**Il KPI più importante è: il giocatore sa sempre cosa fare dopo?**

---

## 7. Prossima fase operativa

La prossima fase da sviluppare è **BLOCCO A — Consolidamento del Mondo Vivo**.

Prima di iniziare Equipaggi dobbiamo rendere maturo ciò che esiste già:
- più varietà NPC;
- yacht NPC persistenti;
- catene più numerose;
- provisioning;
- toys;
- transfer;
- security;
- conseguenze economiche visibili;
- differenziazione tra marine.

Solo quando il Checkpoint A sarà superato inizierà il sistema Equipaggi.

---

## 8. Debito tecnico/documentale da risolvere

- README attuale non descrive più correttamente account, cloud, classifiche e infrastruttura crediti.
- index.html resta molto grande e dovrà essere progressivamente modularizzato senza rifacimenti rischiosi.
- prenotazione posti barca condivisa ancora non pronta.
- mapping visuale 3D ↔ posti database da validare.
- sistemi server-side devono restare separati dalle simulazioni client finché non sono pronti.
- ogni nuovo modulo deve avere almeno un test di regressione o un contratto verificabile.

---

## 9. Principio guida

Marina Empire non deve diventare una raccolta di pulsanti.

Ogni sistema deve produrre almeno una catena:

**evento → decisione → costo/rischio → risultato → reputazione/economia → nuova opportunità → crescita dell'impero.**

Questo documento è la roadmap di riferimento. Va aggiornato ai checkpoint, non dopo ogni piccola modifica.
