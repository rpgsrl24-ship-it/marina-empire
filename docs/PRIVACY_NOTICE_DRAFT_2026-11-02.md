# Marina Empire - Bozza dell'informativa sui dati personali

**BOZZA INCOMPLETA - NON PUBBLICARE O COLLEGARE COME INFORMATIVA DEFINITIVA**

**Data di lavoro: 2 novembre 2026.** Documento preparato sulla base del codice della beta online alla revisione `b9057f6` e del contenimento privacy applicato nella copia di lavoro, verificato con 7 test privacy e 5 test di presenza. Il deploy di queste modifiche resta da attestare. Non costituisce attestazione di conformità. Non sostituisce la conferma dei dati aziendali e delle decisioni indicate con **L1-L7**. Nessuna sede o base giuridica è stata scelta per supposizione.

L'inventario tecnico di riferimento è [`PRIVACY_DATA_INVENTORY_2026-11-02.md`](./PRIVACY_DATA_INVENTORY_2026-11-02.md). I testi seguenti descrivono soltanto funzioni osservate o, quando indicato, il comportamento da verificare dopo il deploy.

## 1. Servizio e titolare

Marina Empire è il gioco gestionale nautico di RPG Yacht, disponibile all'indirizzo `https://rpgsrl24-ship-it.github.io/marina-empire/`. Questa informativa sarà dedicata al gioco, ai suoi account, alle partite e all'assistenza. Il negozio RPG Yacht e gli altri siti collegati hanno servizi e trattamenti distinti.

**[L1 - Inserire ragione sociale esatta del titolare, sede corrente, recapiti privacy e, se applicabili, rappresentante e DPO.]**

Nota interna da rimuovere prima della pubblicazione: il sito commerciale pubblica una sede a Rimini, mentre la policy Iubenda collegata, aggiornata nel 2025, indica una sede ad Aprilia Marittima. I dati non sono stati riconciliati. Il supporto tecnico del gioco è indirizzato a `info@floatmarine.it`; il sito commerciale indica `info@rpgyacht.com`. La casella per le richieste privacy del gioco deve essere designata esplicitamente.

## 2. Dati usati per giocare e gestire l'account

**Prova ospite.** Puoi provare una missione inserendo un nome comandante, senza fornire email. Il gioco conserva nel browser il nome e i progressi: yacht, crediti virtuali, prestigio, carburante, condizione, marina simulata, missioni, viaggi e attività di gioco. Le coordinate della mappa sono posizioni simulate delle marine; il codice esaminato non richiede la posizione GPS del tuo dispositivo.

**Account.** Per registrarti il gioco richiede nome comandante ed email, con password oppure link di accesso inviato via email. Le operazioni di autenticazione sono gestite tramite Supabase. La sessione viene conservata dal relativo SDK nel browser per mantenere l'accesso e rinnovare i token. Il codice del gioco non aggiunge la password al normale oggetto della partita.

**Conferma e recupero.** Reinvio della conferma, accesso via email e recupero password usano l'indirizzo fornito. Queste richieste sono avviate dai comandi dell'utente; sono distinte dalle comunicazioni commerciali, che sono disabilitate nella beta.

**Passaggio dalla prova all'account.** Una copia della partita ospite e l'email indicata possono essere conservate localmente per trasferire i progressi all'account confermato richiesto su quel browser. Il gioco impedisce di assegnare la stessa prova a un altro account attraverso il normale flusso applicativo.

**Salvataggio online.** La copia online contiene l'identificativo dell'account, il nome comandante, lo stato della partita e dati temporali di aggiornamento. Sono disponibili i comandi di salvataggio e caricamento. Inoltre, dopo il collegamento del primo account confermato, il gioco può salvare automaticamente la prova già completata quando non esiste una partita cloud; può recuperare automaticamente progressi cloud su un account senza partita locale. Le sostituzioni fra partite già presenti richiedono la scelta del giocatore. Prima di alcuni ripristini viene creata una copia di sicurezza locale.

**[L2 - Approvare e indicare finalità e base giuridica di ciascun trattamento. Non equiparare automaticamente la spunta di presa visione a un consenso valido per tutte le attività.]**

## 3. Presenze, statistiche, chat e ormeggi

**Presenza globale.** Il contatore usa Supabase Realtime e un identificativo casuale in memoria, accompagnato dall'ora di apertura. Il payload di presenza corrente non contiene il nome comandante o l'email. La conservazione di eventuali log infrastrutturali deve essere descritta dopo la verifica del fornitore.

**Statistiche.** La versione precedente al contenimento inviava eventi di visita/missione con un identificativo persistente del browser, un identificativo di sessione e informazioni sulla provenienza del collegamento; per gli utenti registrati erano presenti eventi collegati all'account. Questi dati non devono essere descritti come anonimi.

**[L6 - Dopo verifica del deploy, usare un testo che descriva esattamente la sospensione delle nuove statistiche dal frontend e il tentativo di rimozione dei due identificativi statistici locali, possibile quando il browser consente l'accesso allo storage. La verifica locale dei gestori è superata; resta da attestare la versione pubblicata. Precisare che lo storico server non è stato cancellato e che schede aperte con versioni precedenti devono essere aggiornate. Non inserire una data di cancellazione non approvata.]**

**Chat.** Nella beta corrente il trasporto della chat è sospeso. Le nuove pagine non inviano o ricevono messaggi chat. Eventuali segnalazioni storiche possono essere esaminate dalla Direzione autorizzata; una futura riattivazione richiede autorizzazione verificata sul server e un aggiornamento dell'informativa.

**Ormeggi online.** Le richieste possono comprendere marina, posto, data e identificativo della prenotazione, associati all'account autenticato. Le prenotazioni della partita dimostrativa restano distinte da quelle online. L'Isola delle Rose è riservata alla gestione di RPG Yacht e non è acquistabile dai giocatori.

## 4. Assistenza e comunicazioni commerciali

Il gioco indica `info@floatmarine.it` come recapito dell'assistenza, visibile e copiabile nel pannello Aiuto. Il comando `PREPARA EMAIL` prepara un messaggio nel programma email del giocatore: la preparazione non equivale all'invio o alla consegna. Il testo include la descrizione del problema, l'origine e il percorso della pagina e l'identificazione tecnica del browser (`user agent`); non bisogna aggiungere password o codici di accesso.

**[L6 - Il fix dell'URL nel feedback supera i test locali: il gestore esclude query e frammenti dall'indirizzo aggiunto automaticamente. Il recapito visibile/copiabile è stato verificato nel codice aggiornato. Attestarne il deploy e completare il controllo del percorso di assistenza; non dichiarare riuscita la consegna di una segnalazione senza prova.]**

Le comunicazioni commerciali e i pagamenti del gioco sono disabilitati. Le richieste di spazi pubblicitari delle aziende sono invece preparate dalla pagina commerciale e indirizzate a `info@rpgyacht.com`; non sono un'iscrizione automatica dei giocatori a una newsletter.

## 5. Destinatari e servizi tecnici

Il gioco è ospitato su GitHub Pages. Supabase è usato per account, dati della partita e presenza Realtime. Il browser può caricare librerie da jsDelivr e unpkg, cartografia da OpenStreetMap e immagini da Unsplash o Wikimedia Commons, in base alla vista utilizzata. Queste richieste comunicano ai servizi destinatari dati tecnici di connessione. I collegamenti a siti esterni aprono i rispettivi servizi.

La Direzione autorizzata può consultare profili, progressi e dati aggregati del gioco e gestire segnalazioni disponibili secondo i controlli applicativi. Questo testo non afferma che tutte le persone che collaborano con RPG Yacht abbiano accesso ai dati.

**[L4 - Confermare fornitori e ruoli effettivi, accordi, eventuali subfornitori, trasferimenti e garanzie pertinenti, gestione della posta e delle email Auth. L'inventario ha verificato la regione primaria Supabase `eu-central-1` e i flag pubblici dell'accesso email; non ha identificato il servizio di recapito email. La sola regione primaria non dimostra dove si svolgano tutti i trattamenti o l'assenza di trasferimenti internazionali.]**

## 6. Conservazione e cancellazione

Le partite e le copie di sicurezza locali non hanno nel codice esaminato una scadenza generale automatica. Possono essere sostituite dai comandi di gioco o rimosse eliminando i dati del sito nel browser; quest'ultima operazione può eliminare progressi non salvati online e interrompere l'accesso. Il logout non equivale alla cancellazione dell'account o di tutte le partite locali.

La protezione dei salvataggi non validi, introdotta nella copia di lavoro di questo ciclo, conserva la copia locale esistente e permette di scaricarla sul dispositivo per il recupero. Il file può contenere i dati della partita; il comando non lo invia automaticamente all'assistenza. **[L6 - Confermare questa funzione nella versione pubblicata prima di mantenere il paragrafo nel testo definitivo.]**

Le dashboard che mostrano gli ultimi 30 giorni applicano un filtro di consultazione: non dimostrano la cancellazione dei dati più vecchi. La sospensione delle statistiche non elimina automaticamente gli eventi storici.

**[L3 - Inserire periodi o criteri approvati per account, partite cloud, prenotazioni, supporto, segnalazioni, eventi storici, log e backup; verificare le operazioni tecniche di cancellazione e i tempi dei fornitori. Definire anche la gestione dei tentativi di registrazione mai completati.]**

## 7. Diritti e contatti

Il testo definitivo deve indicare come esercitare accesso, rettifica, cancellazione, limitazione, opposizione e portabilità nei casi previsti, oltre al reclamo all'autorità di controllo. Dove un trattamento si fondi sul consenso, deve spiegare anche come revocarlo.

**[L5 - Definire contatto privacy, verifica dell'identità, responsabili operativi e percorso per le richieste. Distinguere la cancellazione del browser dalla cancellazione dei dati server. Confermare la gestione degli utenti minorenni e l'eventuale applicabilità di rappresentante o DPO; non inventare un'età minima o promettere una cancellazione automatica assente.]**

## 8. Informazioni ulteriori e versione

Le regole del gioco calcolano missioni, ricompense e requisiti virtuali. Il codice esaminato non basta a definire l'intero perimetro organizzativo di eventuali processi decisionali o profilazioni.

**[L7 - Verificare processi decisionali automatizzati/profilazione applicabili, natura necessaria o facoltativa del conferimento e conseguenze del rifiuto per ogni funzione. Approvare il testo finale, assegnare una versione e renderlo accessibile prima delle raccolte interessate. Definire come registrare e gestire eventuali scelte facoltative.]**

## Registro delle lacune da chiudere

| ID | Decisione o verifica necessaria | Esito al 2 novembre 2026 |
| --- | --- | --- |
| L1 | Titolare, sede corrente, recapiti e ruoli privacy. | Dati pubblicati su fonti aziendali discordanti; da confermare. |
| L2 | Finalità e basi giuridiche per ciascun flusso. | Non determinate dal solo codice. |
| L3 | Conservazione, cancellazione, log e backup. | Durate operative/server non convalidate. |
| L4 | Fornitori, contratti, regioni, trasferimenti e garanzie. | Regione primaria Supabase e flag pubblici Auth verificati; servizio email, altri luoghi di trattamento e aspetti contrattuali da verificare. |
| L5 | Esercizio dei diritti, contatti, minori e ruoli applicabili. | Percorso completo non documentato. |
| L6 | Stato effettivo della sospensione statistiche, presenza, feedback e copia locale di recupero. | Gestori privacy/presenza verificati localmente: 7/7 e 5/5 PASS; recapito visibile e comando di preparazione verificati. Restano deploy e verifica del servizio; nessuna cancellazione dello storico attestata. |
| L7 | Conferimento, processi automatizzati, versione e presentazione. | Decisioni e pubblicazione finale da completare. |

## Fonti per la revisione

- [Inventario tecnico di Marina Empire](./PRIVACY_DATA_INVENTORY_2026-11-02.md): funzioni, dati, storage e comportamento osservato nel codice.
- [Articolo 13 del GDPR - testo ufficiale EUR-Lex](https://eur-lex.europa.eu/legal-content/IT/TXT/?uri=CELEX:02016R0679-20160504): informazioni sul trattamento da rendere al momento della raccolta, inclusi titolare, finalità/basi, destinatari, trasferimenti, conservazione e diritti.
- [Garante - Doveri e trasparenza del trattamento](https://www.garanteprivacy.it/web/guest/home/docweb/-/docweb-display/docweb/8981258): informativa comprensibile e accessibile prima della raccolta; particolare attenzione ai minori.
- [Contatti ufficiali RPG Yacht](https://rpgyacht.com/contattaci/) e [policy del sito commerciale collegata da RPG Yacht](https://www.iubenda.com/privacy-policy/92555204): fonti aziendali consultate per evidenziare le incongruenze, non testi trasferiti automaticamente a Marina Empire.

**Questa bozza rimane incompleta finché L1-L7 non sono risolte e il contenuto non è confrontato con il servizio effettivamente pubblicato.**
