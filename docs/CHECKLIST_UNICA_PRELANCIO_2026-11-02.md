# Marina Empire — Checklist unica di sviluppo e pre-lancio

**RPG Yacht · Revisione del 2 novembre 2026 · Fuso di riferimento: Europe/Rome**

Documento operativo unico per proseguire lo sviluppo su GitHub e preparare la beta pubblica. Il gioco è già promosso sui social: si risolvono per primi gli errori che impediscono l'ingresso, la prima missione, il salvataggio e l'uso corretto delle aree riservate.

## Fonti e deduplicazione

Sono stati riuniti i tre PDF forniti: la **Checklist operativa pre-lancio del 2 novembre 2026** e i due allegati **Checklist Master di sviluppo RPG Yacht 2026–2028**. I due Master hanno contenuto e impronta SHA-256 identici: sono considerati una sola fonte. Le attività comuni sono accorpate; ogni tema presente nelle due fonti distinte rimane tracciato qui.

La fonte pre-lancio indicava il 3 novembre come obiettivo della beta pubblica. Questa data è un obiettivo organizzativo, non una certificazione di completamento né un motivo per saltare i controlli.

## Vincoli del titolare

- **Isola delle Rose:** base operativa gestita esclusivamente da RPG Yacht. Non è in vendita e i giocatori non possono acquistarla, migliorarla come proprietà privata o gestirne le attività economiche riservate.
- **Pagamenti disabilitati:** checkout, acquisti e accredito di crediti a pagamento restano spenti. L'attivazione reale richiede il collaudo e l'autorizzazione esplicita del titolare.
- **Grafica 3D originale:** conservare scene, geometria, stile, camera e identità visiva approvati. Le correzioni funzionali devono evitare regressioni grafiche.
- **Collaudo finale del titolare:** i test automatici e tecnici preparano il collaudo; non lo sostituiscono.
- Le operazioni già autorizzate su GitHub proseguono con modifiche piccole, reversibili e verificabili. Questa checklist non autorizza nuovi acquisti, campagne o pubblicazioni commerciali.

## Come leggere e aggiornare gli stati

Gli identificativi **P0-xx, P1-xx e P2-xx sono stabili**: non rinumerarli quando cambia lo stato. Ogni chiusura deve indicare commit, prova eseguita, risultato e limiti. Una funzione presente nel codice o un test statico verde non bastano a dichiarare completo un percorso reale.

**DA VERIFICARE** = nessun esito completo registrato in questa versione; **IN CORSO** = intervento o verifica parziale; **VERIFICATO** = criterio soddisfatto con prova allegata; **BLOCCATO** = impedimento concreto e prossimo passo documentati. Un test con servizi simulati va indicato come tale; non dimostra l'accesso reale, la sincronizzazione su un secondo dispositivo o i permessi del database.

Gli stati includono gli esiti tecnici del ciclo corrente. **VERIFICATO** indica la prova descritta nel registro, nel suo ambito dichiarato; non equivale a certificare tutta la beta. Le voci prive di prove complete restano aperte. Il collaudo reale del titolare resta separato.

## Esito del primo ciclo P0

**Correzioni integrate tramite [PR #20](https://github.com/rpgsrl24-ship-it/marina-empire/pull/20), revisione codice [e99ab32](https://github.com/rpgsrl24-ship-it/marina-empire/commit/e99ab32ea13a6fe3cb57fa60ec302dba9d4b3fb1).** La PR è stata unita in main con commit 683a6c0. Il [deploy del merge](https://github.com/rpgsrl24-ship-it/marina-empire/actions/runs/41410025881) è verde. Alle 09:05 CET del 2 novembre, il manifest pubblico riportava quel commit e i sei file funzionali controllati corrispondevano byte per byte ai sorgenti testati.

**Stato complessivo: 68 controlli, di cui 26 P0, 24 P1 e 18 P2.** Sono verificati 8 controlli; 17 sono in corso, 2 bloccati e 41 da verificare. Le prove e i loro limiti sono riportati nel registro finale.

- Corretto il richiamo al contenitore mappa rimosso che bloccava il primo ingresso e il resto del rendering.
- Il refresh di un viaggio riapre la plancia; i test seguono partenza, consumo, arrivo, premio unico e invito alla registrazione.
- Isola delle Rose senza vendita, upgrade, attività o rendite dei giocatori. La RPC di prenotazione del server rifiuta Rose prima di qualsiasi scrittura, con prova reale in transazione di sola lettura.
- Logout e cambio account invalidano pannelli amministrativi, saldi e risposte in ritardo. La prima registrazione conserva la prova ospite senza duplicarla fra account.
- Le marine 3D addebitano il salvataggio del giocatore corretto; contesti cambiati o ambigui bloccano le scritture. Geometria, camera, modelli e rendering originali conservati.
- La vecchia copia pubblica beta, che permetteva ancora di acquistare Rose a 35.000 crediti, è sostituita nel deploy da un collegamento alla versione corrente.
- **25 suite offline verdi anche su GitHub** ([regressione](https://github.com/rpgsrl24-ship-it/marina-empire/actions/runs/41409668871)); percorso ospite completo in Chromium verificato anche su GitHub ([browser](https://github.com/rpgsrl24-ship-it/marina-empire/actions/runs/41409668911)) a 1440×1000, 390×844 e 844×390. Verificata anche la plancia espansa su telefono. Servizi account, pagamenti e analytics isolati nei test browser: nessun ordine o email di prova.

**Aperti da affrontare per primi:** informativa specifica del gioco assente (P0-18); prova reale di conferma/recupero email e secondo dispositivo (P0-04/P0-06); controllo completo dei percorsi di pagamento lato server (P0-09); chat con autorizzazione ancora soltanto nell'interfaccia (P1-11). Le ricariche reali rispondono 503; checkout e emissione respingono la richiesta non autenticata con 401. Il 401 non prova il valore del flag checkout.

Per gli ormeggi, l'audit copre 295 pontili e rileva ancora **136 disallineamenti** tra capacità visuali e snapshot dei dati. Il test verde conferma che i casi ambigui vengono respinti, non che la mappatura sia terminata (P1-09).

## P0 — Funzionamento e protezioni prima dell'afflusso pubblico

| ID | Attività e criterio di completamento | Prova richiesta | Stato |
| --- | --- | --- | --- |
| P0-01 | **Stato iniziale GitHub.** Leggere repository, issue, pull request aperte, ultimo commit e deploy; individuare modifiche concorrenti e versione effettivamente pubblicata. | Riferimenti al commit di partenza, PR pertinenti, esecuzione Actions e versione pubblica. | VERIFICATO |
| P0-02 | **Avvio e collegamenti.** Desktop e mobile caricano il gioco senza eccezioni bloccanti; menu, pulsanti e passaggi tra pagine portano alla destinazione corretta; le risorse locali esistono. | Prova browser su partita nuova e già salvata, console errori e verifica risorse/pagine. | VERIFICATO |
| P0-03 | **Percorso ospite.** Nome, ingresso, configurazione, prima missione, ricompensa e invito alla registrazione funzionano; il proseguimento oltre la prova rispetta il requisito di registrazione gratuita. | Percorso completo senza account, premio assegnato una sola volta e prova del blocco della seconda missione. | VERIFICATO |
| P0-04 | **Account e recupero accesso.** Registrazione, conferma email, login, logout e recupero password consentono di rientrare; errori e attese sono comprensibili e non lasciano controlli inutilizzabili. | Test del flusso completo, compreso il ritorno dal link email e l'uso della nuova password; distinguere simulazione da servizio reale. | IN CORSO |
| P0-05 | **Salvataggio locale.** Refresh, chiusura e riapertura, viaggio interrotto e arrivo conservano posizione, flotta, carburante e crediti; salvataggi non validi o falliti non causano perdita silenziosa. | Riapertura a metà missione e dopo arrivo; confronto dello stato e controllo del messaggio di errore di salvataggio. | IN CORSO |
| P0-06 | **Sincronizzazione account.** Logout/login e secondo dispositivo recuperano i dati del proprietario corretto; cambio account e conflitti di salvataggio non sovrascrivono un'altra partita. | Due account e due sessioni/dispositivi, backup prima del ripristino e confronto dei dati letti. | IN CORSO |
| P0-07 | **Database e dati personali.** I permessi reali impediscono a ospiti e altri account di leggere o modificare dati riservati; le operazioni consentite corrispondono al proprietario autenticato. | Verifica delle regole applicate e richieste negative con account non autorizzato; il solo nascondere un pannello non chiude la voce. | IN CORSO |
| P0-08 | **Direzione amministrativa.** Dashboard, dati dei giocatori e operazioni riservate richiedono autorizzazione amministrativa verificata dal server; gli accessi negati restano negati anche da link diretto. | Prove ospite, utente normale e amministratore; verifica delle richieste dati e della revoca al logout. | IN CORSO |
| P0-09 | **Pagamenti OFF.** Nessun pulsante, link o chiamata attiva checkout, addebiti o accrediti a pagamento; anche i percorsi diretti devono restare chiusi. | Ispezione UI e richieste, test dei controlli disabilitati e delle protezioni applicative, senza acquisti reali. | IN CORSO |
| P0-10 | **Integrità dei crediti virtuali.** Costi, premi e acquisti rifiutano saldi negativi, richieste non valide e ripetizioni; un premio già liquidato non viene erogato di nuovo. I crediti locali beta non sono denaro acquistato. | Casi saldo insufficiente, doppio clic, replay dell'arrivo, dati alterati e operazione non autorizzata. | IN CORSO |
| P0-11 | **Isola delle Rose esclusiva RPG Yacht.** Rimuovere offerte e prezzi di acquisto ai giocatori; bloccare acquisto, upgrade e gestione economica riservata anche attraverso azioni dirette. Un vecchio salvataggio non deve attribuire proprietà o rendite dell'isola al giocatore. | Test UI, azioni dirette e salvataggio preesistente; nessuna deduzione/accredito improprio e nessuna cancellazione indiscriminata dei progressi. | VERIFICATO |
| P0-12 | **Home, menu e indicatori mobile.** Layout leggibile, comandi raggiungibili, assenza di sovrapposizioni e navigazione utilizzabile in verticale e orizzontale. | Verifica browser a dimensioni mobili e controllo visivo nelle due orientazioni. | VERIFICATO |
| P0-13 | **Plancia e GPS.** La console resta durante la navigazione; mappa, rotta e indicatori entrano nel display GPS previsto e restano leggibili. Conservare la grafica 3D originale. | Partenza, traversata, cambio vista e arrivo su desktop/mobile; confronto delle scene e dei riferimenti grafici approvati. | VERIFICATO |
| P0-14 | **Origine, yacht e destinazione.** Partenza dalla marina effettiva, barca e posizione visibili, rotta coerente e ingresso nella marina corretta; al termine la posizione è memorizzata. | Due missioni consecutive da porti diversi e ripristino della partita, con controllo delle scene usate. | IN CORSO |
| P0-15 | **Rotte, distanze e tempi.** Calcolare distanze nautiche e durata, consentire viaggi tra marine sbloccate, gestire le soste e impedire destinazioni incompatibili o uguali alla partenza. Le rotte sono simulazioni di gioco. | Matrice di tratte rappresentative, incluse rotte a più tappe, limiti di carburante e destinazioni chiuse. | IN CORSO |
| P0-16 | **Carburante e manutenzione.** Consumi e serbatoi dipendono dall'imbarcazione; usura, rifornimento, riserva, costi e sosta sono coerenti e non producono quantità negative. | Casi limite di autonomia e condizione, cambio yacht, sosta, ripresa e indisponibilità dei servizi durante il viaggio. | IN CORSO |
| P0-17 | **Arrivo e liquidazione missione.** Completamento, premio, prestigio, riepilogo e numero di viaggi si aggiornano una volta; ritorno in primo piano e refresh non duplicano l'incasso. | Fine missione normale, refresh al termine, viaggio già liquidato e ripresa dopo sospensione mobile. | VERIFICATO |
| P0-18 | **Privacy e raccolta email.** Informativa accessibile, consensi pertinenti e finalità chiare; la registrazione al gioco non deve implicare consensi commerciali non dichiarati. | Controllo dei testi, moduli, collegamenti e registrazione dei consensi previsti. | BLOCCATO |
| P0-19 | **Segnalazioni e assistenza.** Un giocatore può segnalare un problema e trovare il contatto di supporto; la segnalazione arriva al canale operativo previsto senza esporre dati di altri utenti. | Verifica del percorso e del recapito, con prova controllata se autorizzata; non inviare messaggi di test a terzi senza autorizzazione. | IN CORSO |
| P0-20 | **Test e deploy verificabili.** I controlli automatici obbligatori precedono la pubblicazione; il sito pubblicato corrisponde al commit testato e non a una cache precedente. | Actions del commit corretto, prova browser P0 e confronto della revisione pubblica con il contenuto pubblicato. | VERIFICATO |
| P0-21 | **Backup e ripristino.** Esiste una procedura reversibile per codice e salvataggi; il ritorno a una versione precedente mantiene pagamenti OFF, Isola riservata e dati dei giocatori. | Versione recuperabile, istruzioni di rollback e prova controllata di ripristino di un salvataggio campione. | IN CORSO |
| P0-22 | **Report e collaudo finale.** Ogni intervento riporta file, commit, test, esiti, limiti e link della versione; il titolare effettua il collaudo finale prima di dichiarare pronta la beta o autorizzare pagamenti. | Report completato/in corso/bloccato e risultato del collaudo del titolare. | IN CORSO |

### P0 del Master — Qualità della navigazione da verificare dopo i blocchi di accesso

Queste voci mantengono la priorità P0 assegnata nel Master. Si affrontano dopo i problemi che impediscono di giocare; la loro presenza nella checklist non significa che siano già operative o promesse al pubblico. Non richiedono di sostituire la grafica originale.

| ID | Attività e criterio di completamento | Prova richiesta | Stato |
| --- | --- | --- | --- |
| P0-23 | **Mare animato.** L'acqua si muove in modo fluido durante la navigazione, con la barca distinguibile e senza compromettere la plancia o le scene originali. | Verifica visiva desktop/mobile e osservazione della fluidità durante una missione. | IN CORSO |
| P0-24 | **Transizioni e prestazioni visive.** Passaggi tra pagine, immagini e animazioni non introducono scatti bloccanti, schermate vuote o caricamenti inutili; mantenere leggibilità e stile approvati. | Misura del caricamento e prova su dispositivo mobile, con confronto prima/dopo delle modifiche. | IN CORSO |
| P0-25 | **Meteo simulato.** Definire e rendere riconoscibili le condizioni simulate, con effetti di gioco documentati e coerenti; nessuna presentazione come previsione nautica reale. | Scenari di meteo e verifica degli eventuali effetti su navigazione e missioni. | DA VERIFICARE |
| P0-26 | **Difficoltà crescente.** Le missioni diventano più impegnative in modo comprensibile, senza bloccare i primi passi o creare requisiti impossibili per la barca disponibile. | Percorso iniziale e livelli successivi con requisiti, rischi e ricompense confrontabili. | DA VERIFICARE |

## P1 — Economia, progressione e flotta

| ID | Attività e criterio di completamento | Prova richiesta | Stato |
| --- | --- | --- | --- |
| P1-01 | **Listino e bilanciamento.** Prezzi e caratteristiche delle barche, ricompense, carburante, manutenzione e costi consentono una progressione gratuita sostenibile. | Tabella economica e simulazione di sessioni, con margine netto e tempo stimato ai primi acquisti. | DA VERIFICARE |
| P1-02 | **Acquisto e vendita yacht.** Le operazioni aggiornano saldo, inventario, yacht attivo e posizione senza duplicazioni o perdita della barca in viaggio. | Acquisto, vendita, saldo insufficiente, doppio invio e riapertura del salvataggio. | DA VERIFICARE |
| P1-03 | **Equipaggi e spese.** Equipaggi compatibili con lo yacht hanno costi espliciti e vengono conteggiati una sola volta nel bilancio della missione. | Missioni con imbarcazioni diverse e confronto tra preventivo e costo effettivo. | DA VERIFICARE |
| P1-04 | **Charter e missioni commerciali.** Flotta e contratti offrono attività distinguibili; ricavi, costi, barche impegnate e tempi restano coerenti anche con più yacht. | Completamento di più tipi di contratto e controlli sulle attività simultanee. | DA VERIFICARE |
| P1-05 | **Traguardi di progressione.** Definire obiettivi raggiungibili nella prima sessione, entro tre giorni e sette giorni, fino a flotta, charter, pontili e gestione delle marine. | Percorso gratuito documentato e sessioni campione; obiettivi misurabili e senza acquisti obbligatori. | DA VERIFICARE |
| P1-06 | **Premi giornalieri e settimanali.** Bonus e obiettivi incoraggiano il ritorno senza richiedere pagamenti; ciascun premio è riscuotibile secondo le regole previste. | Casi nuovo giorno/settimana, doppia riscossione e riapertura del gioco. | DA VERIFICARE |
| P1-07 | **Varietà delle missioni.** Durata, distanza, rischio e guadagno producono scelte interessanti e riducono la ripetizione della stessa tratta; difficoltà coerente con P0-26. | Confronto del catalogo e sequenze di missioni da più porti e classi di yacht. | DA VERIFICARE |
| P1-08 | **Acquisto graduale di marine.** Le marine destinate ai giocatori hanno prezzi, requisiti, proprietà e rendite coerenti; Isola delle Rose sempre esclusa. | Acquisto e riapertura, saldo insufficiente, doppio acquisto e confronto con le protezioni P0-11. | DA VERIFICARE |
| P1-09 | **Pontili, posti barca e servizi.** Capacità, numerazione, occupazione, costi e ricavi sono coerenti fra scena e dati. Nessuna prenotazione online viene autorizzata da una corrispondenza soltanto visiva. | Audit del catalogo e dei singoli intervalli, prove di occupazione/concorrenza se previste e blocco dei casi ambigui. | IN CORSO |
| P1-10 | **Bilancio del giocatore.** Mostrare ricavi, costi, flotta, proprietà e risultato netto, distinguendo stime e somme incassate; non contare rendite riservate a RPG Yacht. | Riconciliazione delle operazioni campione con saldo e pannello economico. | DA VERIFICARE |

## P1 — Community e preparazione internazionale

| ID | Attività e criterio di completamento | Prova richiesta | Stato |
| --- | --- | --- | --- |
| P1-11 | **Chat delle marine.** Accesso riservato agli utenti registrati; messaggi attribuiti all'account corretto e alla marina prevista. | Due utenti e un ospite, inclusi invio non autorizzato, uscita e rientro. | BLOCCATO |
| P1-12 | **Moderazione, blocco e antispam.** Segnalazioni, moderazione, blocco utenti e limiti ai messaggi funzionano con permessi verificati e feedback comprensibile. | Segnalazione controllata, utente bloccato, invii ripetuti e azione di un moderatore autorizzato. | IN CORSO |
| P1-13 | **Presenze online affidabili.** Il contatore aggiorna arrivi, uscite e sessioni scadute senza considerare ogni scheda come un nuovo giocatore. | Più sessioni, chiusura browser, scadenza e verifica del conteggio atteso. | DA VERIFICARE |
| P1-14 | **Amici, inviti e profili pubblici.** Preparare relazioni e inviti comprensibili, con dati pubblici limitati a quelli previsti; nessuna esposizione automatica delle email. | Creazione e rimozione della relazione, invito e controllo della visibilità con altro account. | DA VERIFICARE |
| P1-15 | **Classifiche di armatori e flotte.** Regole e ordinamento verificabili; i risultati non derivano da crediti arbitrariamente modificabili nel browser. | Casi di parità, aggiornamento del punteggio e tentativi di invio non valido. | DA VERIFICARE |
| P1-16 | **Eventi, cooperazione e sfide multiplayer.** Definire attività condivise e ricompense coerenti senza introdurre doppie liquidazioni o instabilità. | Sessione con almeno due giocatori e scenari di abbandono, ripresa e chiusura evento. | DA VERIFICARE |
| P1-17 | **Traduzione dei messaggi.** Progettare la traduzione internazionale della chat distinguendo chiaramente originale e traduzione. | Prova tra lingue diverse, messaggio non traducibile e comportamento del blocco/moderazione. | DA VERIFICARE |
| P1-18 | **Inglese e testi localizzabili.** Preparare l'interfaccia inglese e una struttura riutilizzabile per tutte le lingue, senza testi essenziali mancanti o pulsanti tagliati. | Percorso ospite completo in inglese e verifica delle stringhe/UI mobile. | DA VERIFICARE |

## P1 — Amministrazione, misure e obiettivi

| ID | Attività e criterio di completamento | Prova richiesta | Stato |
| --- | --- | --- | --- |
| P1-19 | **Eventi del percorso giocatore.** Misurare visitatori, avvio/completamento missione, registrazione, utenti attivi e ritorni D1, D7 e D30 con definizioni esplicite. | Dizionario eventi e confronto di una sessione controllata con i dati registrati. | DA VERIFICARE |
| P1-20 | **Identità e conteggi.** Distinguere sessioni, browser e utenti registrati reali; escludere o separare gli accessi amministrativi ed evitare duplicati. | Verifica multi-scheda/account, sessioni anonime, accesso Direzione e riconciliazione dei totali. | DA VERIFICARE |
| P1-21 | **Dashboard Direzione.** Mostrare registrati, attivi, missioni, progressione, funnel di registrazione ed economia virtuale con intervalli e fuso orario dichiarati. | Confronto dashboard-dati per oggi/ieri e periodi più lunghi; accesso protetto come P0-08. | DA VERIFICARE |
| P1-22 | **Crediti generati e spesi.** L'amministrazione può distinguere sorgenti di crediti, costi, premi e anomalie del sistema economico. | Riconciliazione di un insieme di operazioni e controlli su variazioni inattese. | DA VERIFICARE |
| P1-23 | **Registro errori e anomalie.** Raccogliere errori utili al supporto e allo sviluppo, distinguendo problemi del gioco e dei servizi esterni senza registrare password o dati non necessari. | Errore controllato, reperibilità della segnalazione e verifica del contenuto registrato. | DA VERIFICARE |
| P1-24 | **Obiettivi iniziali da verificare.** Usare come ipotesi: 300–500 registrati in 30 giorni, completamento prima missione 60%, D1 25%, D7 10%. D30 resta una misura da osservare. | Definizione di denominatori e coorti, finestra di 30 giorni e confronto con dati effettivi; non presentare gli obiettivi come risultati o garanzie. | DA VERIFICARE |

## P2 — Monetizzazione, solo dopo il collaudo autorizzato

Nessuna voce di questa sezione autorizza l'accensione dei pagamenti. La chiusura di P0-09 e il collaudo del titolare restano prerequisiti; sviluppo e test di pagamento avvengono in ambiente di prova.

| ID | Attività e criterio di completamento | Prova richiesta | Stato |
| --- | --- | --- | --- |
| P2-01 | **Pacchetti e progressione gratuita.** Definire crediti acquistabili accessibili e facoltativi, preservando il gioco gratuito e limitando vantaggi eccessivi per chi paga. | Listino proposto e confronto fra percorsi gratuito e a pagamento. | DA VERIFICARE |
| P2-02 | **WooCommerce e accredito automatico.** Collegare ordini e account con accredito diretto, senza dipendere da voucher manuali. | Ordine di prova completo, attribuzione al proprietario e storico dell'accredito. | DA VERIFICARE |
| P2-03 | **Conferma server e idempotenza.** Accreditare soltanto pagamenti confermati e verificati lato server, con identificativo ordine univoco e nessun accredito ripetuto. | Webhook valido/non valido, doppio webhook, riavvio e tentativo di accredito dal client. | DA VERIFICARE |
| P2-04 | **Errori, rimborsi e riconciliazione.** Gestire pagamento fallito, annullamento, rimborso, eventi duplicati o fuori ordine e confronto fra ordini, transazioni e saldi. | Matrice di casi in ambiente di prova e riconciliazione finale senza discrepanze. | DA VERIFICARE |
| P2-05 | **Collaudo end-to-end e attivazione.** Completare la prova dell'intero ciclo di pagamento; abilitare il sistema reale soltanto dopo autorizzazione esplicita del titolare. | Report di collaudo, piano di ritorno a pagamenti OFF e autorizzazione registrata. | DA VERIFICARE |
| P2-06 | **Ricevute e storico acquisti.** Il giocatore trova ordini, importi, crediti e stato dei rimborsi riferiti al proprio account. | Confronto storico-ordine e prova di isolamento fra due account. | DA VERIFICARE |
| P2-07 | **Condizioni commerciali.** Verificare IVA, condizioni di vendita, rimborsi e informazioni precontrattuali prima dell'apertura dei pagamenti. | Testi approvati dal titolare con le verifiche professionali pertinenti e collegamenti disponibili nel percorso d'acquisto. | DA VERIFICARE |
| P2-08 | **Personalizzazioni estetiche.** Valutare elementi acquistabili facoltativi compatibili con la grafica originale e senza compromettere la leggibilità o la navigazione. | Proposta approvata e prova di attivazione/ripristino delle personalizzazioni. | DA VERIFICARE |
| P2-09 | **Pass stagionale facoltativo.** Definire durata, contenuti, condizioni e vantaggi chiari senza rendere obbligatorio l'acquisto per progredire. | Regole, simulazione di stagione e comportamento alla scadenza. | DA VERIFICARE |
| P2-10 | **Sponsor e spazi pubblicitari.** Preparare sponsorizzazioni nautiche discrete, gestite esclusivamente da RPG Yacht e separate dai crediti virtuali dei giocatori. | Anteprima di posizioni/formati, autorizzazione commerciale e verifica che non coprano i comandi. | DA VERIFICARE |
| P2-11 | **Conversioni e ricavi reali.** Misurare acquisti, conversione, ricavi e rimborsi distinguendoli completamente dall'economia virtuale. | Definizioni dei KPI e riconciliazione con gli ordini verificati, dopo l'attivazione autorizzata. | DA VERIFICARE |

## P2 — Espansione internazionale e piattaforme

| ID | Attività e criterio di completamento | Prova richiesta | Stato |
| --- | --- | --- | --- |
| P2-12 | **Tedesco, francese e spagnolo.** Estendere la struttura inglese di P1-18, con formati numerici e testi coerenti. | Percorso principale in ogni lingua e controllo delle stringhe essenziali. | DA VERIFICARE |
| P2-13 | **Marine del Mediterraneo.** Espandere progressivamente catalogo e rotte con dati, capacità, disponibilità e contenuti verificati. | Audit della nuova marina e missioni di andata/ritorno con salvataggio. | DA VERIFICARE |
| P2-14 | **Altre regioni marittime.** Aggiungere nuove aree dopo la stabilità del nucleo di gioco, mantenendo rotte e progressione coerenti. | Piano dell'area e collaudo dei collegamenti con la rete esistente. | DA VERIFICARE |
| P2-15 | **Eventi e missioni internazionali.** Creare contenuti localizzati con regole comprensibili, tempi dichiarati e premi verificabili. | Prove in più lingue e fusi orari, inclusi apertura e chiusura dell'evento. | DA VERIFICARE |
| P2-16 | **Costi e prestazioni server.** Verificare capacità, latenza e costi al crescere degli utenti, preservando affidabilità e protezione dei dati. | Scenario di carico autorizzato, misure e budget operativo; nessun test invasivo non concordato sui servizi reali. | DA VERIFICARE |
| P2-17 | **Creator nautici e crescita.** Preparare collaborazioni con messaggi aderenti alle funzioni effettivamente disponibili; campagne e invii richiedono l'autorizzazione prevista. | Proposta concreta, tracciamento della provenienza e risultati della campagna autorizzata. | DA VERIFICARE |
| P2-18 | **PWA e app native.** Valutare prima installabilità e comportamento PWA, quindi l'opportunità delle app native in base a uso e risorse. | Prova di installazione/aggiornamento, decisione motivata e piano di sviluppo se approvato. | DA VERIFICARE |

## Corrispondenza con i temi delle fonti

| Sezione originale | Voci della checklist unica |
| --- | --- |
| Pre-lancio: P0 bloccanti | P0-01–P0-22 |
| Pre-lancio: economia e divertimento | P0-10, P0-26, P1-01–P1-10 |
| Pre-lancio: esperienza e community | P0-13–P0-14, P0-23–P0-24, P1-11–P1-18 |
| Pre-lancio: monetizzazione | P0-09, P2-01–P2-05, P2-10 |
| Pre-lancio: analytics e criteri di successo | P1-19–P1-24 |
| Pre-lancio: istruzioni per il GPT | P0-01, P0-20–P0-22 e vincoli del titolare |
| Master: stabilità e infrastruttura | P0-01–P0-10, P0-20–P0-21 |
| Master: grafica e mobile | P0-12–P0-13, P0-23–P0-24 |
| Master: navigazione e missioni | P0-14–P0-17, P0-25–P0-26 |
| Master: flotta ed economia | P0-10–P0-11, P0-16, P1-01–P1-10 |
| Master: community e multiplayer | P1-11–P1-17 |
| Master: monetizzazione | P0-09, P2-01–P2-11 |
| Master: espansione internazionale | P1-18, P2-12–P2-18 |
| Master: amministrazione e analisi | P0-08, P0-19, P0-21, P1-12, P1-19–P1-24, P2-11 |

## Registro delle verifiche

Per ogni aggiornamento aggiungere una riga; mantenere separati risultati automatici, verifiche sul sito pubblico e collaudo del titolare.

| Data e ora | ID | Esito | Commit / versione | Test o prova | Limite o prossimo passo |
| --- | --- | --- | --- | --- | --- |
| 02/11/2026 08:58 CET | P0-01 | VERIFICATO | c61a777 → PR #20 | Repository, issue, PR e Actions letti prima delle modifiche. | Il commit di partenza conteneva i blocchi riprodotti. |
| 02/11/2026 08:58 CET | P0-02, P0-03, P0-05, P0-12, P0-13, P0-17 | TEST TECNICO VERDE | PR #20 | Chromium: desktop, telefono verticale/orizzontale; refresh durante viaggio e dopo arrivo; premio unico; GPS e plancia. | Servizi esterni isolati. Email e secondo dispositivo reale non inclusi. |
| 02/11/2026 08:58 CET | P0-04, P0-06, P0-08 | 12/12 PASS | tests/p0-access-payment.test.cjs | Funzioni reali con risposte controllate: logout, risposte tardive, ospite/account, backup e recupero password. | Non sostituisce login e recupero via email reali. |
| 02/11/2026 08:58 CET | P0-06 | 8/8 PASS | tests/local-save-context.test.cjs | Addebito sul conto corretto, logout/cambio account, layout separati, helper/sessione/storage non validi. | Il contesto locale seleziona una partita: non concede permessi server. |
| 02/11/2026 08:58 CET | P0-07, P0-08 | METADATI VERIFICATI | docs/P0_DATABASE_ACCESS_AUDIT_2026-11-02.md | RLS e privilegi reali su profili, progressi, membership amministrativa, wallet e segnalazioni. | Nessuna riga utenti letta; prova con due account reali ancora aperta. |
| 02/11/2026 08:58 CET | P0-11 | VERIFICATO | reserve_berth_rpg_headquarters_guard | UI, handler e vecchi salvataggi; sul server Rose → 42501 in transazione READ ONLY. | Nessuna prenotazione o saldo modificato. Preservare la protezione nei rollback. |
| 02/11/2026 08:58 CET | P0-09 | PARZIALE | Funzioni distribuite | Una POST vuota e anonima per endpoint: redeem 503; checkout/issue 401 dal middleware. | Riscatto OFF confermato; flag checkout non osservabile con questa prova. Nessun acquisto. |
| 02/11/2026 08:58 CET | P0-10, P0-20 | 25 SUITE OFFLINE PASS | e99ab32 | Suite offline e browser GitHub entrambi verdi sul commit e99ab32; gate deploy e verifica SHA/hash aggiunti. | Esito riferito alla revisione della PR; verifica del merge nella riga seguente. |
| 02/11/2026 09:05 CET | P0-02, P0-11, P0-20 | DEPLOY VERIFICATO | 683a6c0 / Actions 41410025881 | Deploy verde; release.json indica 683a6c0; index, admin, Rose, marine Deluxe, contesto salvataggi e reindirizzamento beta rispondono HTTP 200 e corrispondono byte per byte ai sorgenti. Hash index coerente con il manifest. | Verifica HTTP in sola lettura. Nessuna registrazione reale, email, transazione o esecuzione di analytics. |
| 02/11/2026 08:58 CET | P0-18, P1-11 | BLOCCATO | Audit documentato | Informativa assente; marketing disabilitato. Chat pubblica con solo filtro UI registrati. | Definire informativa completa e protezione canale chat sul server. |
| 02/11/2026 08:58 CET | P1-09 | IN CORSO | scripts/test-visual-berth-resolver.cjs | 8 test verdi, 295 intervalli analizzati e 136 disallineamenti respinti. | Mappatura scena-database ancora da completare; nessuna prenotazione autorizzata dal solo numero visivo. |

**Progetto pubblico:** https://rpgsrl24-ship-it.github.io/marina-empire/

**Repository:** https://github.com/rpgsrl24-ship-it/marina-empire

Questa checklist descrive attività di sviluppo e criteri di accettazione. Non certifica che le funzioni siano già operative, che tutti i controlli P0 siano superati o che i pagamenti possano essere attivati.
