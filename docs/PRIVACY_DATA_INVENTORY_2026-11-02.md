# Marina Empire - Inventario tecnico dei dati e dell'assistenza

**2 novembre 2026 - Beta già online - P0-18 / P0-19**

## Ambito e metodo

Inventario del codice alla revisione [`b9057f6566bcaa6ea7e3d6db6bd533f1e6f76715`](https://github.com/rpgsrl24-ship-it/marina-empire/commit/b9057f6566bcaa6ea7e3d6db6bd533f1e6f76715), prima delle correzioni privacy di questo ciclo. Sono stati letti HTML, JavaScript e documentazione del repository; le pagine pubbliche RPG Yacht sono state consultate in sola lettura. Sono stati verificati anche i soli metadati del progetto Supabase e i flag pubblici di Auth descritti nella sezione 3. Non sono state lette righe di utenti o credenziali private, create sessioni/account, inviate email o segnalazioni, né eseguite transazioni.

Questo documento descrive trasmissioni esplicite nel codice e limiti osservabili. Non attribuisce una base giuridica, un ruolo contrattuale ai fornitori, un paese di conservazione o un tempo di cancellazione non verificati. L'assenza di un cookie scritto dal codice del gioco non dimostra l'assenza di cookie, log o altri trattamenti da parte dei fornitori.

Le prove del codice sono riproducibili con `git show b9057f6:<percorso>` e i nomi di funzione/script indicati. La bozza da completare è in `docs/PRIVACY_NOTICE_DRAFT_2026-11-02.md`.

## 1. Flussi di dati osservati nella baseline

| Funzione | Dati e momento di raccolta/trasmissione | Destinazione e prova nel codice |
| --- | --- | --- |
| Prova ospite e progressi locali | Nome comandante; crediti virtuali, prestigio, carburante, condizione, yacht posseduti, posizione simulata, missioni, viaggi, prenotazioni dimostrative, marine e attività; dettagli del viaggio in corso e dei premi già liquidati. L'ingresso ospite non richiede email. | Browser, `index.html`: `fresh`, `enter`, `persist`, `KEY`. Il nome può contenere dati personali liberamente inseriti dal giocatore. |
| Registrazione con password | Nome comandante, email, password e URL di ritorno formato da `location.origin + location.pathname`. | Supabase Auth, script `me-cloud-sync-v1`: `register` / `auth.signUp`, metadato `captain_name`. Nessun campo password è aggiunto al normale oggetto di partita dal codice esaminato. |
| Accesso via email | Nome comandante ed email; richiesta di link di accesso che può creare l'account. | Supabase Auth: `emailAccess` / `signInWithOtp`, `shouldCreateUser:true`. L'invio avviene su azione dell'utente. |
| Login, conferma, recupero | Email/password al login, email per reinvio conferma o recupero, nuova password per il ripristino; verifica dell'utente e sessione. | Supabase Auth: `login`, `resendConfirmation`, `resetPassword`, `applyNewPassword`, `initialize`; client con sessione persistente e rinnovo automatico. |
| Trasferimento della prova all'account | Email normalizzata e copia della partita sono prima conservate localmente; l'assegnazione richiede account confermato e corrispondenza email. | `index.html`: `meRememberGuestProgress`, `meClaimGuestProgress`, `meForgetGuestRegistration`. Il record locale viene rimosso dopo il trasferimento riuscito o il fallimento gestito della richiesta. Nessuna scadenza temporale è definita per una conferma mai completata. |
| Salvataggio cloud | `user_id`, `captain_name`, `updated_at`; `user_id`, intero `game_state` e `updated_at`. `safeSnapshot` copia l'intero oggetto `state`, non un elenco ristretto di campi. | Supabase `player_profiles` e `player_progress`: `saveCloud`, `saveFirstAccountProgress`. È presente un primo salvataggio automatico dopo il collegamento dell'account confermato quando non esiste già una partita cloud e la prova ha almeno un viaggio. |
| Recupero cloud | Lettura della partita del proprio account e creazione di un backup locale con `savedAt`, `accountId`, `game`. | `loadCloud`, `reconcileAccountProgress`, `restoreCloudBackup`. Il recupero può essere automatico su account locale vuoto con progressi cloud esistenti. Le altre sostituzioni richiedono conferma. Non descrivere tutto il servizio come esclusivamente manuale. |
| Statistiche dei browser, prima del contenimento | `event_type`, `session_id`, `visitor_id`, `source`, `medium`, `campaign`. `page_view` parte subito; `play_start` e `mission_complete` vengono richiamati dalle missioni; heartbeat ogni 30 secondi se la pagina è visibile e l'interazione è recente. `source` deriva da UTM oppure dal dominio del referrer; lunghezze limitate, ma valori UTM arbitrari possono contenere informazioni inserite nel link. | POST REST a `me_game_events`, script `me-traffic-v1`. UUID di sessione e UUID persistente del browser; nessun controllo di consenso. Il payload applicativo non aggiunge email o password, ma i servizi di rete ricevono i metadati della connessione. |
| Statistiche degli account, prima del contenimento | `user_id` ed evento `play_start` / `mission_complete`, dopo verifica dell'utente; il server assegna/gestisce i campi temporali della tabella. | `MarinaEmpireAuthenticatedActivity.track`, Supabase `me_authenticated_activity`. La registrazione all'account non costituisce nel codice una scelta separata per queste statistiche. |
| Presenza globale | Identificativo casuale generato in memoria per l'apertura della pagina e `startedAt`. Non vengono aggiunti email o nome comandante al payload. | Supabase Realtime, script `me-global-presence-v1`, canale pubblico `marina-empire-live-players-v1`, `channel.track`. Serve al contatore presenze. Non è dimostrata una durata di conservazione dei log del fornitore. |
| Chat | Nella baseline corrente il trasporto della chat è sospeso; le nuove pagine non aprono il vecchio canale e non inviano o ricevono messaggi. Le schede precedenti già aperte necessitano aggiornamento. | `me-community-v1`; `tests/community-pause.test.cjs`. Non descrivere la chat come servizio attualmente disponibile né promettere anonimato dei messaggi storici. |
| Segnalazioni chat già esistenti | La Direzione può leggere `id`, `created_at`, `marina_id`, `reported_name`, `message_excerpt`, `reason`, `status`; la revisione invia `status`, `reviewed_at`, `reviewed_by`. | `admin.html`, `loadModeration`, tabella `me_chat_reports`; nessuna riga è stata letta durante questo inventario. Il flusso nuovo di segnalazione chat è sospeso insieme alla chat. |
| Ormeggi online | Richieste con marina, numero posto e data; annullamento con identificativo prenotazione; lettura delle proprie prenotazioni filtrata per `user_id`. | `me-online-berths-v1`, `berth_bookings`, RPC `reserve_berth`, `cancel_berth`, `me_berth_availability`. L'identità è ricavata dall'account. Isola delle Rose rifiutata dalla protezione server già introdotta. |
| Portafoglio acquistato | Lettura del proprio `balance` associato a `user_id`; nessun dato di carta viene raccolto dal codice del gioco esaminato. | `refreshPurchasedWallet`, tabella `me_credit_wallets`. Checkout, emissione e riscatto sono distribuiti con risposte costanti OFF: `docs/P0_PAYMENTS_OFF_2026-11-02.md`. |
| Direzione | Profili e salvataggi aggregati/consultabili dall'amministratore, statistiche e segnalazioni storiche; controlli membership amministrativa prima delle letture. | `admin.html`, `show`, `refresh`, `refreshTraffic`, `refreshOnline`, `loadModeration`; `index.html`, `refreshRoseAdmin`. Vedi audit separato `docs/P0_DATABASE_ACCESS_AUDIT_2026-11-02.md`. |
| Assistenza del gioco | Testo della segnalazione (8-1.200 caratteri nell'interfaccia), URL della pagina e user agent del dispositivo, preparati al clic; l'utente deve ancora inviare tramite il proprio programma email. | `me-beta-help-v1`, destinatario `info@floatmarine.it`. Il collegamento del welcome usa lo stesso indirizzo. Non esiste una conferma di consegna email generata dal gioco. |
| Richieste commerciali sponsor | Ragione sociale, marchio, formato, marina e periodo sono campi suggeriti nel corpo di una email da compilare. | `pubblicita.html`, link `mailto:info@rpgyacht.com`. Nessun invio automatico o pagamento. La scheda campagna nella Direzione genera un JSON locale per revisione. |

### Statistiche: termine corretto

Il `visitor_id` riconosce lo stesso browser tra sessioni; gli eventi account contengono un `user_id`. Questi dati non devono essere presentati come anonimi. Il codice e le etichette della Direzione vanno descritti con precisione: identificativi pseudonimi dei browser oppure identificativi degli account. Non è stato tentato alcun collegamento a persone durante l'audit.

## 2. Memorizzazione nel browser

| Chiave o famiglia | Contenuto/finalità | Durata osservabile nel codice |
| --- | --- | --- |
| `marina_empire_beta_test_session` | Partita ospite corrente. | Nessuna scadenza automatica; può essere sostituita/reset dall'utente o eliminata con i dati del sito. |
| `marina_empire_user_<uid>` | Partita locale separata per account. | Nessuna scadenza automatica; il logout non equivale alla cancellazione di tutte le partite. |
| `marina_empire_guest_registration_v1` | Email normalizzata e partita da trasferire al primo account. | Rimossa nei percorsi descritti sopra, senza TTL per richieste non completate. |
| `marina_empire_beta_test_session_claimed_by` | UID che ha già ricevuto la prova ospite. | Mantiene il vincolo di assegnazione; si azzera con l'avvio esplicito di una nuova prova. |
| `marina_empire_local_context_v1` | `accountId`, revisione casuale e versione del contesto locale. | Nessun TTL; cambia selezionando l'account. Non è un'autorizzazione server. |
| `sb-zrdetqvnjmqkfyajxjgp-auth-token` | Sessione gestita dall'SDK Supabase, comprendente identità e token; il helper locale legge soltanto i dati necessari a scegliere la partita. | Ciclo di sessione e logout dell'SDK; la durata dei token e delle sessioni va verificata nella configurazione Auth. |
| `marina_empire_before_cloud_load`, `marina_empire_before_backup_restore` | Copie locali con account proprietario, data e partita. | Sovrascrittura nel successivo percorso di backup; nessuna scadenza automatica documentata. |
| `marina-empire-phase1-<marina>`, `marina_empire_user_<uid>_marina_<marina>` | Layout e stato economico locale delle marine 3D Deluxe. | Nessun TTL, con reset delle relative viste. La scena Rose corrente non persiste gestione economica dei giocatori. |
| `me_anonymous_visitor_v1` | UUID persistente delle statistiche browser nella baseline. | Nessuna scadenza; rimozione prevista dalla patch di contenimento. |
| `me_traffic_session` in sessionStorage | UUID statistico della sessione browser nella baseline. | Durata della sessionStorage; rimozione prevista dalla patch di contenimento. |
| `me_admin_analytics_optout_v1` | Preferenza tecnica impostata dopo l'accesso amministrativo per escludere eventi dal browser della Direzione. | Nessun TTL; non è un consenso del giocatore. |

File 3D/prototipi ancora presenti nel repository conservano inoltre chiavi locali proprie: `marina-empire-3d-<marina>`, `marina-rimini-2d-plan-v1`, `marina-empire-rimini-vista-premium-v1`, `marina-empire-rimini-disegno-v2`, `marina-empire-rimini-v40`, `marina-empire-rimini-premium-v1`, `marina-empire-rimini-rebuild-v1`, `marina-empire-rimini-ripartenza-v1`. La loro presenza non prova che il giocatore le abbia visitate o che tutti questi percorsi appartengano alla navigazione principale. Non eliminarle indiscriminatamente come se fossero identificativi pubblicitari.

Nel codice principale non risultano chiamate dirette a `document.cookie`, geolocalizzazione del dispositivo, IndexedDB o Service Worker. Le coordinate della mappa sono quelle simulate delle marine, non GPS personali rilevati dal browser. Le librerie e i fornitori possono comunque avere comportamenti o log non descrivibili con questo solo inventario statico.

## 3. Fornitori e risorse esterne presenti nel codice

| Destinazione | Uso osservato | Limite dell'evidenza |
| --- | --- | --- |
| GitHub Pages (`rpgsrl24-ship-it.github.io`) | Hosting del gioco e risorse locali. | Registri di hosting e relative condizioni non verificati qui. |
| Supabase (`zrdetqvnjmqkfyajxjgp.supabase.co`) | Account, database, Realtime, lettura wallet e endpoint pagamento disabilitati. | Regione primaria `eu-central-1` verificata nei metadati di progetto; vedere sotto. Accordi, subfornitori, log, backup e trasferimenti restano da verificare; non derivano dalla sola regione. |
| jsDelivr (`cdn.jsdelivr.net`) | SDK Supabase 2.57.0 nel gioco, SDK `@2` non fissato nella Direzione, Three.js 0.160.1 nelle scene, GeoJSON Italia da repository esterno. | Richieste del browser al CDN; non si deducono dai soli URL ruolo privacy o luoghi di trattamento. |
| unpkg (`unpkg.com`) | JavaScript e CSS Leaflet 1.9.4. | Caricamento dipendente dalle viste; non è una raccolta di posizione GPS personale. |
| OpenStreetMap (`{s}.tile.openstreetmap.org`) | Tessere cartografiche individuate da coordinate di tile. | Fornitore riceve richieste per le zone visualizzate; non è stato acquisito un log di rete di utenti reali. |
| Unsplash (`images.unsplash.com`) | Fotografie richiamate da HTML/CSS. | Alcuni riferimenti possono essere superati da stili successivi; presenza nel sorgente non significa richiesta in ogni vista. |
| Wikimedia Commons (`commons.wikimedia.org`, possibili redirect delle immagini) | Foto marine e attribuzioni. | Destinazioni finali e caching dipendono dal caricamento effettivo. |
| RPG Yacht e siti sponsor | Collegamenti esterni; feed campagne e immagini approvate caricati dal sito del gioco. | Aprire un collegamento avvia il trattamento del sito di destinazione; non trasferire al gioco le policy del negozio. |

Una normale richiesta HTTP comunica al servizio destinatario dati tecnici della connessione. Il payload applicativo elencato sopra non esaurisce quindi l'inventario dei log infrastrutturali. Non sono state riscontrate integrazioni dirette GA4, Google Tag Manager o Meta Pixel nel codice principale esaminato: la loro presenza sul sito commerciale RPG Yacht non prova che siano presenti nel gioco.

### Metadati Supabase verificati in sola lettura

Verifica del 2 novembre 2026 sul progetto `zrdetqvnjmqkfyajxjgp`, senza lettura di tabelle, log individuali, utenti o segreti. Il connettore `get_project` ha restituito i metadati di progetto; una richiesta `GET` al solo endpoint pubblico `/auth/v1/settings`, con la chiave publishable già presente nel frontend, ha restituito HTTP 200. Non sono state richiamate API di registrazione, accesso, recupero o invio.

| Metadato | Valore verificato | Significato e limite |
| --- | --- | --- |
| Regione primaria del progetto | `eu-central-1` | La [documentazione ufficiale delle regioni Supabase](https://supabase.com/docs/guides/platform/regions) la identifica come Central EU (Frankfurt), fra le regioni AWS supportate. Non prova che ogni trattamento, log, backup, assistenza o fornitore operi soltanto in questa regione. |
| Stato del progetto | `ACTIVE_HEALTHY` | Stato operativo restituito da `get_project` al momento della lettura; non certifica la consegna delle email. |
| Host database indicato nei metadati | `db.zrdetqvnjmqkfyajxjgp.supabase.co` | Identifica l'host del progetto; nessuna connessione al database o password letta in questa verifica. |
| Registrazioni Auth | `disable_signup: false` | Le registrazioni non risultano disabilitate nel flag pubblico. Non è una prova del completamento di una registrazione reale. |
| Provider Auth pubblici attivi | Solo `email`; `external.email: true`, `external.phone: false` | Conferma il canale email abilitato. Non identifica il servizio che recapita le email. |
| Conferma automatica email | `mailer_autoconfirm: false` | L'autoconferma email non è abilitata; è coerente con il flusso di conferma richiesto dall'applicazione. |
| Tipologia/fornitore del recapito email | **Non esposto nei metadati letti** | Non è possibile distinguere da questi dati SMTP predefinito, SMTP personalizzato o eventuale Send Email Auth Hook. Il connettore disponibile non espone una lettura circoscritta di questi campi; non è stata richiesta la configurazione amministrativa completa, che può contenere segreti. |

Il [repository ufficiale Supabase Auth](https://github.com/supabase/auth#endpoints) documenta `GET /settings` come endpoint delle impostazioni pubbliche. La [guida ufficiale al recapito email](https://supabase.com/docs/guides/auth/auth-smtp) distingue il servizio predefinito dalle configurazioni per l'invio agli utenti: **l'abilitazione del provider email non basta a provare che le email arrivino a giocatori esterni**. Rimangono da confermare il nome e la tipologia del servizio effettivo, le relative condizioni e una prova di recapito autorizzata; non occorre inserire credenziali nella documentazione.

Questa verifica riduce la lacuna L4 alla parte ancora sconosciuta. Non attribuisce ruoli giuridici, non dimostra l'assenza di trasferimenti internazionali e non sostituisce accordi, garanzie o criteri di conservazione.

## 4. Consensi, assistenza e problemi concreti

1. **Informativa account assente nella baseline:** `cloudPrivacy` richiede di dichiarare letta un'informativa, ma non contiene un collegamento al suo testo. `register` ed `emailAccess` verificano la spunta; non inviano una versione dell'informativa o un record di consenso al server. Non considerare questa spunta una prova completa di consenso o una base giuridica già scelta.
2. **Marketing:** `cloudMarketing` è disabilitato. Nessun flusso di iscrizione commerciale è attivato dal codice esaminato.
3. **Statistiche non necessarie all'esecuzione della missione:** le due raccolte automatiche della baseline devono essere sospese nel frontend in attesa del completamento dell'informativa e delle decisioni pertinenti. La sospensione non cancella lo storico server.
4. **Rischio di includere un token nel feedback:** `me-beta-help-v1` usa `location.href.split("?")[0]`. Se un URL senza query contiene `#access_token=...` o un altro frammento sensibile, il frammento resta nel corpo dell'email preparata. Correzione prevista: includere soltanto `location.origin + location.pathname`; testare query e hash insieme e separatamente, senza inviare email.
5. **Consegna assistenza non dimostrata dal mailto:** il gioco prepara un messaggio; non può dichiararlo consegnato. Verificare che il recapito sia visibile e copiabile anche senza app email configurata. L'eventuale prova di recapito reale resta separata.
6. **Notifiche della Direzione:** `admin.html` indica `info@floatmarine.it` come destinatario previsto e dichiara l'invio automatico non attivo. Non esiste evidenza di un servizio di inoltro automatico da questo pannello.

## 5. Contenimento applicato e verificato nella copia di lavoro

Il 2 novembre 2026 sono stati riletti gli script modificati ed eseguiti i test dei gestori di produzione con browser e trasporti simulati. Questa verifica riguarda la copia di lavoro successiva a `b9057f6`; **non attesta ancora il commit pubblicato o il deploy**. La distinzione dalla baseline evita di attribuire retroattivamente la sospensione alle visite già avvenute.

| Elemento | Baseline `b9057f6` | Esito locale verificato / limite residuo |
| --- | --- | --- |
| `me_game_events` | Raccolta automatica con UUID persistente e di sessione. | `me-traffic-v1` espone solo `track` inerte e tenta di rimuovere `me_anonymous_visitor_v1` e `me_traffic_session`. Nessun nuovo UUID, timer, listener di monitoraggio o invio statistico. Se lo storage è inaccessibile la cancellazione può fallire, ma il monitoraggio resta spento. |
| `me_authenticated_activity` | Invio di eventi dopo verifica dell'account. | `MarinaEmpireAuthenticatedActivity.track` inerte: nessuna chiamata Auth o database per registrare gli eventi. |
| Storico statistiche in Direzione | Lettura amministrativa, copy che include "anonimo". | Storico ancora consultabile, etichette pseudonime corrette e avviso esplicito di raccolta sospesa; nessuna cancellazione dello storico. |
| Monitor presenze della Direzione | Il numero online dipendeva da eventi di utilizzo recenti. | `startLive` e `refreshOnline` contano gli identificativi del canale di presenza, senza interrogare le tabelle degli eventi. Etichette riferite a schede/sessioni, non persone uniche; stato non disponibile distinto dallo zero; callback obsolete ignorate dopo logout, nuova connessione o errore del canale. |
| Partite e accesso | Salvataggi, backup, Auth e presenza globale operativi. | Il contenimento rimuove soltanto le due chiavi statistiche; i test preservano partite, sessione Auth, preferenza amministrativa e altra sessionStorage. `me-global-presence-v1` resta attivo con il payload descritto nella sezione 1. Questo controllo non sostituisce il collaudo completo dei salvataggi e dell'accesso. |
| Assistenza | URL potenzialmente comprensivo di frammento sensibile. | Il gestore reale include solo `location.origin + location.pathname`; query e hash esclusi nei test, compreso un hash senza query. Il pulsante si chiama `PREPARA EMAIL`; il recapito `info@floatmarine.it` è visibile e copiabile anche senza app email. Il testo descrive la bozza e i dati aggiunti, senza dichiarare invio automatico o consegna. Consegna reale non verificata. |
| Privacy | Nessuna informativa completa specifica del gioco. | Inventario e bozza incompleta disponibili per revisione. Nessuna informativa definitiva pubblicata e nessuna attestazione di conformità. |

**Prove eseguite:** `node tests/privacy-containment.test.cjs`, **7/7 PASS**, e `node tests/admin-presence.test.cjs`, **5/5 PASS**. Sono prove comportamentali sugli script estratti dai file applicativi: avvio ospite/account, eventi missione, storage inaccessibile, rimozione limitata delle chiavi, feedback con token sintetici, presenza sincronizzata/offline, callback dopo logout e sincronizzazione tardiva dopo errore del canale. Il recapito visibile e l'etichetta del pulsante sono stati riletti nell'HTML aggiornato. Non sono state aperte sessioni reali né inviate email. Gli esiti di CI e della verifica sul commit effettivamente pubblicato vanno aggiunti al [report del ciclo](./P0_PRIVACY_TECHNICAL_CONTAINMENT_2026-11-02.md).

**Limite della sospensione:** il contenimento qui verificato è nel frontend aggiornato; non blocca da solo vecchie schede già aperte o richieste manuali al backend. Occorre ricaricare le pagine precedenti. Non risultano cancellati dati storici o cambiati tempi di conservazione server.

### Ulteriore gestione locale introdotta nello stesso ciclo

La protezione dei salvataggi non validi usa `save-state-guard.js` (`create`, `read`, `protection`) e mantiene in memoria la stringa originale già presente nello storage, impedendone la sovrascrittura accidentale. `index.html`, `meExportProtectedSave`, permette su azione dell'utente di scaricare quella stringa in un file di testo tramite un URL locale `blob:`. Non aggiunge una chiave persistente o un invio a un fornitore; il file scaricato può contenere i campi della partita originaria. Questa è una nuova possibilità di copia locale e non una procedura di cancellazione dei dati server.

## 6. Fonti aziendali primarie e incongruenze

Consultazione del 2 novembre 2026, senza operazioni sui siti.

- [Homepage ufficiale RPG Yacht](https://rpgyacht.com/): footer commerciale R.P.G. S.r.l., email `info@rpgyacht.com`, telefono `+39 331 366 1616`.
- [Contatti ufficiali](https://rpgyacht.com/contattaci/): stessi recapiti principali; il testo attuale indica una sede legale in Via Pomposa 43L a Rimini. È un dato pubblicato sul sito, non una verifica camerale.
- [Privacy del sito commerciale](https://rpgyacht.com/privacy-policy/) e [cookie policy](https://rpgyacht.com/cookies-policy/): sono contenitori con integrazione Iubenda. Il semplice estrattore testuale del sito non mostrava la policy; l'API WordPress pubblica e l'HTML hanno permesso di individuare il documento collegato.
- [Policy Iubenda collegata](https://www.iubenda.com/privacy-policy/92555204) e [cookie policy collegata](https://www.iubenda.com/privacy-policy/92555204/cookie-policy): riguardano `rpgyacht.com`, con revisione 21 novembre 2025. Identificano RPG S.r.l. e una sede in Vicolo del Coregolo 17, Aprilia Marittima (UD), differente dalla pagina Contatti attuale. Il testo consultato non descrive Supabase o GitHub Pages.

**Conclusione operativa:** non scegliere automaticamente una delle sedi e non copiare la policy del negozio nel gioco. Ragione sociale esatta del titolare, sede corrente e contatto privacy applicabile a Marina Empire richiedono conferma. Nessuna partita IVA è stata convalidata dalle pagine primarie esaminate.

## 7. Decisioni/documenti mancanti prima della pubblicazione dell'informativa

- Identificazione e contatti attuali del titolare; eventuale rappresentante/DPO se applicabile.
- Finalità e basi giuridiche per account, partita, sicurezza, assistenza, presenza e storico statistico; eventuale interesse legittimo e relativa valutazione.
- Tempi o criteri di conservazione per account, salvataggi, prenotazioni, segnalazioni, statistiche, log e backup; procedura di cancellazione verificabile. Una finestra di 30 giorni nelle dashboard non è una cancellazione dopo 30 giorni.
- Fornitori effettivi, ruoli, accordi, regioni, trasferimenti e garanzie documentate; gestore della posta e invio delle email Auth.
- Procedura per esercizio dei diritti, verifica dell'identità e gestione dei minori, senza inventare un'età minima dal codice.
- Versione dell'informativa da mostrare prima della raccolta e distinzione fra presa visione, servizio richiesto e scelte facoltative.
- Regole di accesso e conservazione dello storico chat/segnalazioni e condizioni per una futura riattivazione autenticata.

Le informazioni da completare derivano dall'[articolo 13 GDPR, testo ufficiale EUR-Lex](https://eur-lex.europa.eu/legal-content/IT/TXT/?uri=CELEX:02016R0679-20160504) e dalla [guida del Garante sui doveri del titolare](https://www.garanteprivacy.it/web/guest/home/docweb/-/docweb-display/docweb/8981258). Queste fonti richiedono trasparenza al momento della raccolta; il contenimento tecnico non sostituisce l'informativa specifica.
