# Marina Empire — Contenimento della chat pubblica

Data: 2 novembre 2026, Europe/Rome. Baseline esaminata: `76c5731`.

## Problema verificato

Lo script `me-community-v1` apriva un canale Broadcast pubblico `marina-community-<marina>`. Il client della chat non manteneva una sessione autenticata; il controllo `window.meRegisteredPlayer` era soltanto locale. Identificativo del mittente, nome e testo provenivano dal payload del browser. Di conseguenza, quel trasporto non garantiva né l'accesso riservato né l'identità del mittente.

Il contatore globale degli utenti usa uno script e un canale separati (`me-global-presence-v1` / `marina-empire-live-players-v1`).

## Correzione di contenimento

La sola chat è temporaneamente sospesa. Il pannello comunica «Chat temporaneamente non disponibile · accesso riservato in aggiornamento» e chiarisce che il gioco e i salvataggi restano utilizzabili.

Lo script non crea client Supabase, non apre canali, non registra presenze, non invia né riceve messaggi e non avvia timer di riconnessione. Un invio forzato del form viene annullato; gli aggiornamenti del gioco mantengono i comandi disabilitati anche quando il flag locale di registrazione è vero. Eventuali nomi o messaggi già presenti nel pannello della pagina corrente vengono rimossi dalla visualizzazione.

Il contatore globale e la grafica 3D non sono modificati da questa correzione. Nessuna tabella, policy o configurazione Supabase è stata cambiata; nessun messaggio reale è stato inviato o letto.

## Prove

`node tests/community-pause.test.cjs`: **5/5 test comportamentali superati**. Il test esegue lo script effettivamente distribuito e intercetta ogni inizializzazione SDK, apertura canale, `track`, `send` e timer. Copre ospite, giocatore registrato, aggiornamento della partita/cambio account, invio forzato e pannello assente.

La stessa suite sulla baseline `76c5731` fallisce **5/5**: con flag registrato e partita valida, il vecchio script crea un client, apre un canale e mantiene il timer.

Lo script del contatore globale è identico byte per byte alla baseline. SHA-256 del suo contenuto: `1414ac5bbbd7365fc4dd9dc844740878f9746dfe68e5989ccf6a2356be2712bb`.

## Verifiche server in sola lettura

- `realtime.messages` ha RLS attiva e nessuna policy definita nel progetto esaminato. I canali pubblici non applicano l'autorizzazione dei canali privati.
- Nessun oggetto di messaggistica applicativa esistente, salvo `public.me_chat_reports`; non sono state lette righe di utenti o segnalazioni.
- I log Realtime esaminati nelle ultime 24 ore contengono 69 eventi, tutti di livello `info`; questo dato descrive i log e non dimostra la sicurezza del trasporto.
- Gli advisor di sicurezza risultano invariati rispetto all'audit precedente. Non è stata effettuata alcuna modifica al database.

## Limiti e riattivazione

**P1-11 rimane aperto: la chat è sospesa, non collaudata come funzione operativa.** La correzione si applica alle pagine che caricano questa versione. Una scheda già aperta con il vecchio codice deve essere aggiornata. Non abbiamo disabilitato globalmente i canali pubblici Supabase, operazione che interromperebbe anche il contatore delle presenze: il vecchio endpoint pubblico non è stato trasformato in un servizio autenticato.

Prima della riattivazione occorre implementare e verificare:

1. Un nuovo canale privato per marina, con ricezione limitata sul server ad account confermati e non sospesi. Nessun ritorno automatico al canale pubblico.
2. Invio tramite funzione server che ricavi l'identità da `auth.uid()`, verifichi lo stato dell'account e costruisca il payload. Il client non deve scegliere l'identificativo del mittente. Un nome pubblico resta un soprannome; l'identità deve usare l'account verificato.
3. Nessuna policy che autorizzi i client a inviare Broadcast arbitrari al canale. Rendere soltanto privato un canale con invio client non protegge il contenuto del payload.
4. Validazione della marina e del testo, limite di frequenza sul server, revoca al logout/cambio account e gestione dei fallimenti di invio.
5. Informativa coerente con il trasporto scelto. La soluzione Broadcast dal database conserva transitoriamente i messaggi in `realtime.messages`; la documentazione indica la rimozione delle partizioni più vecchie di tre giorni. Questo comportamento differisce dal Broadcast diretto tra client e va descritto prima di abilitarlo.
6. Prove con due account autorizzati e un ospite, controllo negativo del payload contraffatto e collaudo di moderazione, blocco e segnalazioni. Nessun invio reale di prova è stato eseguito in questo intervento.

Nota implementativa: la versione presente di `realtime.send` intercetta gli errori e produce un `WARNING`. Il futuro percorso di invio deve evitare di mostrare una conferma positiva quando l'operazione non è stata completata.

## Documentazione consultata

- [Supabase Changelog](https://supabase.com/changelog): indice corrente verificato prima dell'analisi.
- [Realtime Authorization](https://supabase.com/docs/guides/realtime/authorization): policy per ricezione/invio, configurazione privata e durata della cache dei permessi.
- [Realtime Concepts](https://supabase.com/docs/guides/realtime/concepts): separazione dei canali pubblici/privati e conservazione transitoria di Broadcast dal database.
- [Broadcast](https://supabase.com/docs/guides/realtime/broadcast): modalità di invio supportate.
