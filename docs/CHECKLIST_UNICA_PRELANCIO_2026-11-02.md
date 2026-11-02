# Marina Empire — Checklist unica di sviluppo e stabilizzazione della beta online

**RPG Yacht · Revisione del 2 novembre 2026 · Fuso di riferimento: Europe/Rome**

Documento operativo unico per proseguire lo sviluppo su GitHub e stabilizzare la beta già online. Il gioco è promosso sui social e può essere in uso: si risolvono per primi gli errori che impediscono l'ingresso, la prima missione, il salvataggio e l'uso corretto delle aree riservate, con controlli prima della pubblicazione.

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

**Stato complessivo: 68 controlli, di cui 26 P0, 24 P1 e 18 P2.** Sono verificati 9 controlli; 19 sono in corso, 3 bloccati e 37 da verificare. Le prove e i loro limiti sono riportati nel registro finale.

- Corretto il richiamo al contenitore mappa rimosso che bloccava il primo ingresso e il resto del rendering.
- Il refresh di un viaggio riapre la plancia; i test seguono partenza, consumo, arrivo, premio unico e invito alla registrazione.
- Isola delle Rose senza vendita, upgrade, attività o rendite dei giocatori. La RPC di prenotazione del server rifiuta Rose prima di qualsiasi scrittura, con prova reale in transazione di sola lettura.
- Logout e cambio account invalidano pannelli amministrativi, saldi e risposte in ritardo. La prima registrazione conserva la prova ospite senza duplicarla fra account.
- Le marine 3D addebitano il salvataggio del giocatore corretto; contesti cambiati o ambigui bloccano le scritture. Geometria, camera, modelli e rendering originali conservati.
- La vecchia copia pubblica beta, che permetteva ancora di acquistare Rose a 35.000 crediti, è sostituita nel deploy da un collegamento alla versione corrente.
- **25 suite offline verdi anche su GitHub** ([regressione](https://github.com/rpgsrl24-ship-it/marina-empire/actions/runs/41409668871)); percorso ospite completo in Chromium verificato anche su GitHub ([browser](https://github.com/rpgsrl24-ship-it/marina-empire/actions/runs/41409668911)) a 1440×1000, 390×844 e 844×390. Verificata anche la plancia espansa su telefono. Servizi account, pagamenti e analytics isolati nei test browser: nessun ordine o email di prova.

**Aperti da affrontare per primi:** informativa specifica del gioco assente (P0-18); prova reale di conferma/recupero email e secondo dispositivo (P0-04/P0-06); chat autorizzata dal server (P1-11), temporaneamente sospesa nel secondo ciclo. Il controllo pagamenti P0-09 è stato chiuso con gestori server costantemente OFF, sorgenti live verificati e risposte HTTP 503: dettagli nel secondo ciclo e nel registro.

Per gli ormeggi, l'audit copre 295 pontili e rileva ancora **136 disallineamenti** tra capacità visuali e snapshot dei dati. Il test verde conferma che i casi ambigui vengono respinti, non che la mappatura sia terminata (P1-09).

## Secondo ciclo — Stabilizzazione della beta già online

Il [report del secondo ciclo](https://github.com/rpgsrl24-ship-it/marina-empire/blob/main/docs/P0_LIVE_STABILITY_2026-11-02.md) raccoglie correzioni e limiti. La [PR #21](https://github.com/rpgsrl24-ship-it/marina-empire/pull/21) è stata integrata con commit `b9057f6`; il [deploy verificato](https://github.com/rpgsrl24-ship-it/marina-empire/actions/runs/41417895089) corrisponde ai sorgenti testati.

- **P0-09 verificato sul server:** checkout, riscatto ed emissione distribuiti in versione 2 alle 09:58 CET. Ogni POST gestita risponde 503 / PAYMENTS_DISABLED; non esistono rami attivabili da flag, né chiamate a ordini, saldi o provider. Sorgenti live identici ai bundle testati.
- **Salvataggi corretti:** confronto dei dati indipendente dall'ordine delle proprietà JSONB; controlli sul cambio account; nessuna falsa conferma dal pulsante SALVA; partita precedente mantenuta in memoria se caricamento, ripristino, importazione o reset non riescono a salvare. Una missione caricata riapre la navigazione. Suite specifica 14/14 superata.
- **Navigazione verificata numericamente:** 10 test, due missioni consecutive con ripristino, 1.470 combinazioni di rotte, soglie carburante/manutenzione, soste e cambio yacht. Restano da verificare cartografia e consumi differenziati per modello.
- **Chat temporaneamente sospesa:** il canale pubblico non viene più aperto dalle nuove pagine. Nessun invio/ricezione o timer chat; contatore globale conservato. P1-11 resta aperto fino all'autorizzazione server; le vecchie schede richiedono refresh.
- **29 suite offline verdi.** Nessun account, acquisto, accredito, email o messaggio reale creato. Isola esclusiva e grafica 3D originale conservate.

## Terzo ciclo — Accesso, salvataggi danneggiati e dati della beta

Il punto di partenza è il commit `b9057f6`. La [PR #22](https://github.com/rpgsrl24-ship-it/marina-empire/pull/22) raccoglie le correzioni, gli esiti CI e la verifica della pubblicazione; la prima revisione funzionale è `bb3961c`. Gli interventi sono descritti nei report [accesso](https://github.com/rpgsrl24-ship-it/marina-empire/blob/main/docs/P0_AUTH_LIFECYCLE_2026-11-02.md), [protezione salvataggi](https://github.com/rpgsrl24-ship-it/marina-empire/blob/main/docs/P0_SAVE_QUARANTINE_2026-11-02.md) e [contenimento dati e assistenza](https://github.com/rpgsrl24-ship-it/marina-empire/blob/main/docs/P0_PRIVACY_TECHNICAL_CONTAINMENT_2026-11-02.md).

- **Accesso:** login, registrazione, link email e recupero non possono sovrapporsi; le risposte di richieste superate non modificano la sessione nuova. Logout limitato al dispositivo corrente, errori recuperabili e campi password puliti. Suite dei gestori effettivi: 14/14, contro 11 fallimenti sulla baseline. Conferma email, link scaduti e secondo dispositivo reali restano da collaudare.
- **Salvataggi danneggiati:** lettura e validazione condivisa, protezione delle copie originali e blocco delle scritture del gioco principale se i dati non sono leggibili. Avviso persistente, copia grezza scaricabile e accesso a un altro account. I vecchi link `?reset=1` non cancellano più i dati. 14/14 casi dedicati; navigazione 11/11 con il validatore applicato agli stati prodotti dalle funzioni reali. Riparazione del dato corrotto, concorrenza tra schede e copertura delle scritture autonome delle scene Deluxe rimangono aperte: non è un ripristino universale o una transazione atomica.
- **Statistiche sospese:** le pagine aggiornate non inviano eventi di visita/missione dei browser o degli account. Vengono rimossi soltanto i due identificativi statistici locali; nessun evento server è cancellato. Gli eventi storici sono pseudonimi, non anonimi. P1-19 è bloccato fino al completamento dell'informativa e delle regole di raccolta; le vecchie schede richiedono aggiornamento.
- **Direzione:** contatore basato sulle presenze Realtime, senza leggere gli eventi statistici. Mostra schede/sessioni connesse e non persone uniche; attesa e collegamento interrotto producono indisponibilità, non uno zero apparente. 5/5 casi comprendono logout, canale precedente e sincronizzazione tardiva dopo errore. La deduplicazione per giocatore resta da sviluppare.
- **Assistenza:** diagnostica limitata a origine e percorso dell'URL; query e frammenti con token esclusi. Recapito `info@floatmarine.it` visibile e copiabile; il comando PREPARA EMAIL apre soltanto una bozza. Nessun messaggio di prova inviato. Suite privacy/assistenza: 7/7.
- **Privacy:** [inventario tecnico](https://github.com/rpgsrl24-ship-it/marina-empire/blob/main/docs/PRIVACY_DATA_INVENTORY_2026-11-02.md) e [bozza incompleta](https://github.com/rpgsrl24-ship-it/marina-empire/blob/main/docs/PRIVACY_NOTICE_DRAFT_2026-11-02.md) pronti. Metadati pubblici verificati: regione primaria Supabase `eu-central-1`, registrazioni email abilitate e conferma email necessaria. Non dimostrano la consegna delle email o i termini contrattuali. P0-18 rimane bloccato: titolare/sede, basi, conservazione, fornitori, diritti e testo finale devono essere definiti; la spunta attuale non ha ancora un'informativa completa collegata.

**33 suite offline superate.** Il collaudo browser aggiunge il percorso di recupero su telefono a quello ospite desktop, telefono verticale e orizzontale. Le Actions della PR e del merge devono eseguire queste prove prima del deploy. Nessuna modifica ai gestori pagamenti OFF, alle scene 3D originali o alla riserva di Isola delle Rose. Questa sezione registra le prove tecniche del ciclo; l'esito del commit pubblicato è collegato nella pull request e verificabile tramite `release.json`.

## Quarto ciclo — Concorrenza tra schede e scritture delle marine 3D

La [PR #23](https://github.com/rpgsrl24-ship-it/marina-empire/pull/23) affronta un rischio residuo dei salvataggi locali: due schede valide aperte contemporaneamente potevano applicare la regola "ultimo salvataggio vince" e sostituire progressi più recenti. La correzione usa un confronto ottimistico della copia letta prima di ogni scrittura.

- **Partita principale:** se un'altra scheda modifica una partita valida, la scheda obsoleta non può più sovrascriverla. Mostra invece un avviso di conflitto e richiede il ricaricamento.
- **Marine Deluxe 3D:** partita e layout della marina hanno lo stesso controllo di revisione; una scheda obsoleta non può modificare crediti, pontili o layout. L'apertura e il semplice ridisegno della scena non generano più scritture passive.
- **Azioni sugli ormeggi:** l'interfaccia non prosegue come se il salvataggio fosse riuscito quando la revisione non è più corrente.
- **Grafica 3D:** nessuna modifica intenzionale a geometria, camera, modelli, materiali o rendering; gli audit di inventario e capacità della scena restano verdi.
- **Vincoli invariati:** pagamenti OFF e Isola delle Rose riservata a RPG Yacht.

Esito tecnico prima del merge: regressioni offline **SUCCESS** ([Actions 41425491407](https://github.com/rpgsrl24-ship-it/marina-empire/actions/runs/41425491407)); smoke/Chromium **SUCCESS** ([Actions 41425491101](https://github.com/rpgsrl24-ship-it/marina-empire/actions/runs/41425491101)). Chromium ha superato desktop, mobile verticale, mobile orizzontale, recupero salvataggio corrotto e il nuovo scenario **multi-tab-conflict**, che verifica evento storage, avviso e blocco della scrittura obsoleta.

P0-05 e P0-06 restano **IN CORSO**: questa prova chiude il rischio multi-scheda sullo stesso browser, ma non sostituisce il collaudo con due dispositivi reali né la verifica end-to-end del salvataggio account remoto.

## Quinto ciclo — Hardening database, privilegi minimi e disponibilità Rose

Applicata in Supabase la migrazione `20261102110124_p0_least_privilege_and_rose_availability_guard` e tracciata nella [PR #24](https://github.com/rpgsrl24-ship-it/marina-empire/pull/24).

- **Profili e progressi:** il ruolo `anon` non ha più grant diretti. `authenticated` conserva solo `SELECT, INSERT, UPDATE`, necessari per profilo e salvataggio cloud.
- **Catalogo marine e pontili:** `anon` e `authenticated` hanno sola lettura.
- **Sblocchi pontili:** sola lettura per `authenticated`; nessuna scrittura diretta dal client.
- **Segnalazioni chat:** `authenticated` conserva solo `SELECT, INSERT, UPDATE`.
- **RPC ormeggi:** `reserve_berth`, `cancel_berth` e `me_berth_availability` non sono eseguibili da `anon`; restano disponibili agli utenti autenticati con controlli interni.
- **Isola delle Rose:** `me_berth_availability` non include più `rose`; la prenotazione Rose era già bloccata server-side. La base resta esclusivamente RPG Yacht.
- **RLS negativa in sola lettura:** un JWT autenticato con UUID non esistente vede 0 membership admin, 0 profili, 0 progressi, 0 analytics e 0 report. Nessun dato giocatore è stato scritto o modificato durante la prova.
- **Cloud multi-dispositivo:** il codice esistente usa già `updated_at` come revisione ottimistica e rifiuta un salvataggio se un altro dispositivo ha modificato la copia remota nel frattempo; i test contrattuali lo verificano. Resta aperto il collaudo end-to-end con due dispositivi/account reali.

P0-06 e P0-07 restano quindi **IN CORSO**: l'hardening server e i test negativi sono verificati, ma la checklist richiede ancora prova reale account/dispositivo prima della chiusura completa.

## Sesto ciclo — Informativa privacy e separazione marketing

Implementazione tecnica verificata nella [PR #24](https://github.com/rpgsrl24-ship-it/marina-empire/pull/24).

- Aggiunta `privacy.html`, accessibile direttamente dal modulo di registrazione.
- La checkbox account ora attesta la lettura dell'informativa; il trattamento necessario all'account non viene presentato come consenso marketing opzionale.
- Il marketing resta disabilitato e viene dichiarato non necessario per giocare.
- L'informativa descrive account, email, nome comandante, salvataggi locali/cloud, fornitori tecnici, conservazione, diritti, pagamenti OFF e stato degli analytics.
- Il client di gioco mantiene gli analytics di utilizzo sospesi: nessun nuovo identificativo di traffico persistente e nessun evento inviato dal modulo analytics disattivato.
- Test dedicato `privacy-notice.test.cjs` e test di contenimento privacy inclusi nelle regressioni.
- Regressioni e Chromium della revisione `72aee242` **SUCCESS**: [regressioni 41435115100](https://github.com/rpgsrl24-ship-it/marina-empire/actions/runs/41435115100), [smoke/Chromium 41435115360](https://github.com/rpgsrl24-ship-it/marina-empire/actions/runs/41435115360).

P0-18 passa a **VERIFICATO** come controllo tecnico pre-lancio. Questo esito non equivale a un parere o certificazione legale esterna; eventuale revisione legale può essere svolta separatamente senza riaprire il difetto tecnico originario.

## Settimo ciclo — Integrità atomica dell'economia virtuale

Verifica e correzione sviluppate nella [PR #25](https://github.com/rpgsrl24-ship-it/marina-empire/pull/25).

- **Transazioni locali atomiche:** costi, premi e acquisti vengono applicati come snapshot → modifica → validazione → salvataggio verificato. Se la scrittura fallisce, lo stato torna esattamente alla copia precedente.
- **Missioni:** costo iniziale, carburante, sosta tecnica, arrivo, premio, prestigio, conteggio viaggi e identificatore di liquidazione sono protetti. Un arrivo non salvato non lascia un premio solo in memoria e il viaggio resta da completare.
- **Replay:** `settledVoyages` continua a impedire una seconda liquidazione dello stesso viaggio.
- **Economia operativa:** rifornimento, manutenzione, ormeggi, acquisto yacht, attività, marine, upgrade, premi carriera e rendite passive usano la stessa semantica atomica.
- **Saldi manipolati:** i crediti virtuali devono essere interi sicuri JavaScript e non negativi; valori negativi o oltre `Number.MAX_SAFE_INTEGER` vengono rifiutati dal guard del salvataggio.
- **Nessun denaro reale:** questa protezione riguarda esclusivamente i crediti locali beta. Le funzioni di pagamento reale restano OFF e separate.
- **Isola delle Rose e 3D:** nessuna modifica alle protezioni dell'Isola delle Rose o alla grafica/scena 3D.

Test dell'ultima revisione funzionale `4bb7f28d`: regressioni complete **SUCCESS** ([Actions 41440126427](https://github.com/rpgsrl24-ship-it/marina-empire/actions/runs/41440126427)) e smoke/Chromium **SUCCESS** ([Actions 41440126359](https://github.com/rpgsrl24-ship-it/marina-empire/actions/runs/41440126359)). La suite dedicata simula anche rifiuto della scrittura browser, saldo negativo/non sicuro e arrivo missione senza persistenza.

P0-10 passa a **VERIFICATO** per l'economia virtuale locale della beta. Non autorizza né attiva acquisti reali.

## Ottavo ciclo — Rotte, carburante e manutenzione per imbarcazione

Verifica e correzione sviluppate nella [PR #26](https://github.com/rpgsrl24-ship-it/marina-empire/pull/26).

- **Consumi differenziati:** i sette yacht hanno un coefficiente L/NM dedicato. RPG Academy 8 mantiene il baseline beta 0,85 L/NM; gli altri modelli non usano più un consumo uniforme.
- **Unica fonte di calcolo:** pianificatore, budget missione, carburante stimato, partenza, soste tecniche e viaggio salvato usano lo stesso coefficiente della barca.
- **Refresh coerente:** il viaggio salva il `fuelRate` usato alla partenza, evitando che un refresh o una modifica successiva del catalogo cambi il consumo di una missione già iniziata.
- **Riserva e serbatoi:** resta obbligatoria la riserva del 15%; ogni yacht usa la propria capacità serbatoio e le tratte incompatibili vengono rifiutate.
- **Manutenzione:** condizione limitata 0–100, usura a viaggio, ripristino massimo a 100, costo legato alla classe/prezzo dello yacht e servizi indisponibili durante la navigazione.
- **Cambio yacht:** posizione, carburante e usura restano separati per singola imbarcazione.
- **Matrice rotte:** 1.470 combinazioni barca/porto verificate; 1.254 possibili, 216 correttamente bloccate e 654 con più tappe nella revisione testata.
- **Test comportamentali:** 11/11 controlli P0 navigazione superati, inclusi due viaggi consecutivi, cambio porto, primo limite carburante, soste, perdita inattesa dei fondi di rifornimento, servizi in marina e cambio yacht.
- **Browser:** regressioni complete **SUCCESS** ([Actions 41443334559](https://github.com/rpgsrl24-ship-it/marina-empire/actions/runs/41443334559)) e smoke/Chromium **SUCCESS** ([Actions 41443334178](https://github.com/rpgsrl24-ship-it/marina-empire/actions/runs/41443334178)).
- **P0-14 resta IN CORSO:** posizione, origine/destinazione, refresh e arrivo sono verificati; resta il controllo finale della rappresentazione visiva d'ingresso/uscita. La beta mantiene intenzionalmente la plancia GPS durante il viaggio invece di sostituirla con una scena 3D.

P0-15 e P0-16 passano a **VERIFICATO**.

## Nono ciclo — Origine, yacht e destinazione nella plancia

Verifica e correzione sviluppate nella [PR #27](https://github.com/rpgsrl24-ship-it/marina-empire/pull/27).

- **Yacht reale:** la radio VHF non usa più il nome fisso `RPG Voyager`; mostra il modello realmente in navigazione.
- **Origine e destinazione:** il titolo della plancia mostra `yacht · marina di origine → prossima marina/destinazione` ricavando i dati dal viaggio attivo.
- **Refresh:** il viaggio ripristinato conserva lo stesso `voyageId`, la stessa origine, destinazione, yacht, carburante e rotta.
- **Arrivo:** dopo la liquidazione la console mostra il modello attivo e la marina effettivamente salvata in `state.port`; l'indicatore di rotta usa la stessa destinazione.
- **Due missioni consecutive:** il test comportamentale Rimini → Cervia → Ancona dimostra che la seconda missione parte da Cervia, non da un'origine obsoleta, e che il secondo arrivo persiste ad Ancona.
- **Tutti gli yacht:** ogni imbarcazione configurata produce un viaggio persistente e un arrivo valido.
- **Scena di viaggio:** la beta mantiene intenzionalmente la plancia GPS come vista principale durante la navigazione; la vecchia scena marina `cinemaDock` resta nascosta. Questo evita di mostrare una marina 3D non coerente con la tratta e preserva la plancia approvata.
- **Browser:** la prova Chromium controlla direttamente dopo refresh che titolo e VHF contengano yacht, origine e destinazione corretti; all'arrivo controlla yacht e marina salvata.
- **Gate:** regressioni complete **SUCCESS** ([Actions 41446049920](https://github.com/rpgsrl24-ship-it/marina-empire/actions/runs/41446049920)) e smoke/Chromium **SUCCESS** ([Actions 41446049909](https://github.com/rpgsrl24-ship-it/marina-empire/actions/runs/41446049909)).

P0-14 passa a **VERIFICATO**. Nessuna modifica alle scene 3D approvate, ai pagamenti o alla protezione dell'Isola delle Rose.

## Decimo ciclo — Backup e rollback reversibili

Verifica e documentazione sviluppate nella [PR #28](https://github.com/rpgsrl24-ship-it/marina-empire/pull/28).

- **Backup locale:** export JSON, quarantena dei salvataggi corrotti e blocco della scrittura quando il browser non conferma il salvataggio.
- **Restore locale:** validazione del backup prima della sostituzione; se la scrittura del nuovo stato fallisce, la partita precedente resta attiva.
- **Backup cloud:** copia pre-caricamento in `marina_empire_before_cloud_load` e copia inversa prima di un restore in `marina_empire_before_backup_restore`.
- **Restore cloud controllato:** backup valido ripristinabile; backup invalido, JSON corrotto o impossibilità di creare la copia inversa annullano l'operazione.
- **Concorrenza:** una revisione obsoleta da altra scheda/dispositivo non può sovrascrivere silenziosamente una copia più recente.
- **Rollback codice:** solo tramite nuovo commit/revert verificabile; nessun force-push di `main` e nessuna riscrittura indiscriminata di dati giocatore.
- **Pagamenti:** i tre handler server di checkout/emissione/riscatto restano hard-disabled con `PAYMENTS_DISABLED` e risposta 503; il rollback Pages non li abilita.
- **Isola delle Rose:** resta esclusa dagli investimenti giocatore e il rollback deve preservare la gestione esclusiva RPG Yacht.
- **Pubblicazione rollback:** obbligatori regressioni, Chromium, `release.json` e confronto hash/byte della homepage pubblica.
- **Prova campione:** le suite esistenti verificano restore valido, rifiuto backup invalido, fallimento della copia di sicurezza, conservazione della partita corrente, quarantena salvataggio corrotto e conflitto di revisione.

Gate dell'ultima revisione funzionale `01529f3d`: regressioni complete **SUCCESS** ([Actions 41448181943](https://github.com/rpgsrl24-ship-it/marina-empire/actions/runs/41448181943)) e smoke/Chromium **SUCCESS** ([Actions 41448181980](https://github.com/rpgsrl24-ship-it/marina-empire/actions/runs/41448181980)).

P0-21 passa a **VERIFICATO**. Il collaudo automatico non sostituisce il collaudo finale del titolare previsto da P0-22.

## Undicesimo ciclo — Mare animato con plancia stabile

Verifica e ottimizzazione sviluppate nella [PR #29](https://github.com/rpgsrl24-ship-it/marina-empire/pull/29).

- **Plancia stabile:** la foto approvata della cabina, il chartplotter e gli strumenti non oscillano più durante la navigazione; il browser verifica `animation-name: none` sull'intera plancia.
- **Acqua animata:** il movimento è affidato ai layer dedicati `me-water-motion` e `me-wake`, con animazioni `meWaveTravel` e `meWakeFlow`.
- **Riflesso ridondante alleggerito:** `me-sea-motion` resta un livello statico leggero, evitando tre animazioni concorrenti sulla stessa area.
- **Mobile:** secondo layer acqua/scia disabilitato, opacità ridotta e minore lavoro grafico; la plancia resta leggibile.
- **Accessibilità:** `prefers-reduced-motion` disabilita movimento di acqua, scia e riflessi.
- **Vista GPS:** il mare non viene forzato nella modalità GPS grande; il test passa esplicitamente alla vista PLANCIA prima di verificare l'animazione.
- **Grafica:** nessuna sostituzione della cabina, nessun cambio alla scena 3D approvata, nessuna modifica a missioni, pagamenti o Isola delle Rose.

Gate dell'ultima revisione funzionale `c4ad4bb7`: regressioni complete **SUCCESS** ([Actions 41452740174](https://github.com/rpgsrl24-ship-it/marina-empire/actions/runs/41452740174)) e smoke/Chromium **SUCCESS** ([Actions 41452739810](https://github.com/rpgsrl24-ship-it/marina-empire/actions/runs/41452739810)).

P0-23 passa a **VERIFICATO**. P0-24 resta **IN CORSO**: questa modifica riduce il carico grafico della navigazione, ma la voce richiede ancora una verifica più ampia delle transizioni e dei tempi di caricamento tra schermate.

## P0 — Continuità del gioco e protezioni sul sito pubblico

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
| P0-09 | **Pagamenti OFF.** Nessun pulsante, link o chiamata attiva checkout, addebiti o accrediti a pagamento; anche i percorsi diretti devono restare chiusi. | Ispezione UI e richieste, test dei controlli disabilitati e delle protezioni applicative, senza acquisti reali. | VERIFICATO |
| P0-10 | **Integrità dei crediti virtuali.** Costi, premi e acquisti rifiutano saldi negativi, richieste non valide e ripetizioni; un premio già liquidato non viene erogato di nuovo. I crediti locali beta non sono denaro acquistato. | Casi saldo insufficiente, doppio clic, replay dell'arrivo, dati alterati e operazione non autorizzata. | VERIFICATO |
| P0-11 | **Isola delle Rose esclusiva RPG Yacht.** Rimuovere offerte e prezzi di acquisto ai giocatori; bloccare acquisto, upgrade e gestione economica riservata anche attraverso azioni dirette. Un vecchio salvataggio non deve attribuire proprietà o rendite dell'isola al giocatore. | Test UI, azioni dirette e salvataggio preesistente; nessuna deduzione/accredito improprio e nessuna cancellazione indiscriminata dei progressi. | VERIFICATO |
| P0-12 | **Home, menu e indicatori mobile.** Layout leggibile, comandi raggiungibili, assenza di sovrapposizioni e navigazione utilizzabile in verticale e orizzontale. | Verifica browser a dimensioni mobili e controllo visivo nelle due orientazioni. | VERIFICATO |
| P0-13 | **Plancia e GPS.** La console resta durante la navigazione; mappa, rotta e indicatori entrano nel display GPS previsto e restano leggibili. Conservare la grafica 3D originale. | Partenza, traversata, cambio vista e arrivo su desktop/mobile; confronto delle scene e dei riferimenti grafici approvati. | VERIFICATO |
| P0-14 | **Origine, yacht e destinazione.** Partenza dalla marina effettiva, barca e posizione visibili, rotta coerente e ingresso nella marina corretta; al termine la posizione è memorizzata. | Due missioni consecutive da porti diversi e ripristino della partita, con controllo delle scene usate. | VERIFICATO |
| P0-15 | **Rotte, distanze e tempi.** Calcolare distanze nautiche e durata, consentire viaggi tra marine sbloccate, gestire le soste e impedire destinazioni incompatibili o uguali alla partenza. Le rotte sono simulazioni di gioco. | Matrice di tratte rappresentative, incluse rotte a più tappe, limiti di carburante e destinazioni chiuse. | VERIFICATO |
| P0-16 | **Carburante e manutenzione.** Consumi e serbatoi dipendono dall'imbarcazione; usura, rifornimento, riserva, costi e sosta sono coerenti e non producono quantità negative. | Casi limite di autonomia e condizione, cambio yacht, sosta, ripresa e indisponibilità dei servizi durante il viaggio. | VERIFICATO |
| P0-17 | **Arrivo e liquidazione missione.** Completamento, premio, prestigio, riepilogo e numero di viaggi si aggiornano una volta; ritorno in primo piano e refresh non duplicano l'incasso. | Fine missione normale, refresh al termine, viaggio già liquidato e ripresa dopo sospensione mobile. | VERIFICATO |
| P0-18 | **Privacy e raccolta email.** Informativa accessibile, consensi pertinenti e finalità chiare; la registrazione al gioco non deve implicare consensi commerciali non dichiarati. | Controllo dei testi, moduli, collegamenti e registrazione dei consensi previsti. | VERIFICATO |
| P0-19 | **Segnalazioni e assistenza.** Un giocatore può segnalare un problema e trovare il contatto di supporto; la segnalazione arriva al canale operativo previsto senza esporre dati di altri utenti. | Verifica del percorso e del recapito, con prova controllata se autorizzata; non inviare messaggi di test a terzi senza autorizzazione. | IN CORSO |
| P0-20 | **Test e deploy verificabili.** I controlli automatici obbligatori precedono la pubblicazione; il sito pubblicato corrisponde al commit testato e non a una cache precedente. | Actions del commit corretto, prova browser P0 e confronto della revisione pubblica con il contenuto pubblicato. | VERIFICATO |
| P0-21 | **Backup e ripristino.** Esiste una procedura reversibile per codice e salvataggi; il ritorno a una versione precedente mantiene pagamenti OFF, Isola riservata e dati dei giocatori. | Versione recuperabile, istruzioni di rollback e prova controllata di ripristino di un salvataggio campione. | VERIFICATO |
| P0-22 | **Report e collaudo finale.** Ogni intervento riporta file, commit, test, esiti, limiti e link della versione; il titolare effettua il collaudo finale prima di dichiarare pronta la beta o autorizzare pagamenti. | Report completato/in corso/bloccato e risultato del collaudo del titolare. | IN CORSO |

### P0 del Master — Qualità della navigazione da verificare dopo i blocchi di accesso

Queste voci mantengono la priorità P0 assegnata nel Master. Si affrontano dopo i problemi che impediscono di giocare; la loro presenza nella checklist non significa che siano già operative o promesse al pubblico. Non richiedono di sostituire la grafica originale.

| ID | Attività e criterio di completamento | Prova richiesta | Stato |
| --- | --- | --- | --- |
| P0-23 | **Mare animato.** L'acqua si muove in modo fluido durante la navigazione, con la barca distinguibile e senza compromettere la plancia o le scene originali. | Verifica visiva desktop/mobile e osservazione della fluidità durante una missione. | VERIFICATO |
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
| P1-13 | **Presenze online affidabili.** Il contatore aggiorna arrivi, uscite e sessioni scadute senza considerare ogni scheda come un nuovo giocatore. | Più sessioni, chiusura browser, scadenza e verifica del conteggio atteso. | IN CORSO |
| P1-14 | **Amici, inviti e profili pubblici.** Preparare relazioni e inviti comprensibili, con dati pubblici limitati a quelli previsti; nessuna esposizione automatica delle email. | Creazione e rimozione della relazione, invito e controllo della visibilità con altro account. | DA VERIFICARE |
| P1-15 | **Classifiche di armatori e flotte.** Regole e ordinamento verificabili; i risultati non derivano da crediti arbitrariamente modificabili nel browser. | Casi di parità, aggiornamento del punteggio e tentativi di invio non valido. | DA VERIFICARE |
| P1-16 | **Eventi, cooperazione e sfide multiplayer.** Definire attività condivise e ricompense coerenti senza introdurre doppie liquidazioni o instabilità. | Sessione con almeno due giocatori e scenari di abbandono, ripresa e chiusura evento. | DA VERIFICARE |
| P1-17 | **Traduzione dei messaggi.** Progettare la traduzione internazionale della chat distinguendo chiaramente originale e traduzione. | Prova tra lingue diverse, messaggio non traducibile e comportamento del blocco/moderazione. | DA VERIFICARE |
| P1-18 | **Inglese e testi localizzabili.** Preparare l'interfaccia inglese e una struttura riutilizzabile per tutte le lingue, senza testi essenziali mancanti o pulsanti tagliati. | Percorso ospite completo in inglese e verifica delle stringhe/UI mobile. | DA VERIFICARE |

## P1 — Amministrazione, misure e obiettivi

| ID | Attività e criterio di completamento | Prova richiesta | Stato |
| --- | --- | --- | --- |
| P1-19 | **Eventi del percorso giocatore.** Misurare visitatori, avvio/completamento missione, registrazione, utenti attivi e ritorni D1, D7 e D30 con definizioni esplicite. | Dizionario eventi e confronto di una sessione controllata con i dati registrati. | BLOCCATO |
| P1-20 | **Identità e conteggi.** Distinguere sessioni, browser e utenti registrati reali; escludere o separare gli accessi amministrativi ed evitare duplicati. | Verifica multi-scheda/account, sessioni anonime, accesso Direzione e riconciliazione dei totali. | IN CORSO |
| P1-21 | **Dashboard Direzione.** Mostrare registrati, attivi, missioni, progressione, funnel di registrazione ed economia virtuale con intervalli e fuso orario dichiarati. | Confronto dashboard-dati per oggi/ieri e periodi più lunghi; accesso protetto come P0-08. | IN CORSO |
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
| 02/11/2026 09:58 CET | P0-09 | VERIFICATO | Funzioni live v2 | Tre sorgenti identici ai bundle revisionati; 6 test e 1.134 POST simulate; POST reali vuote con sola apikey pubblica → 503 PAYMENTS_DISABLED su tutti i gestori. | Nessun account reale usato. L'OFF dipende dal codice distribuito, non da flag modificabili. |
| 02/11/2026 10:00 CET | P0-05, P0-06, P0-21 | 14/14 PASS | tests/cloud-save-integrity.test.cjs | Confronto JSONB, cambio account, errore storage, ripristino e ripresa navigazione coperti da test delle funzioni effettive. | Prova su due dispositivi/account reali ancora aperta; rollback in memoria non equivale a transazione atomica dello storage. |
| 02/11/2026 09:58 CET | P0-14, P0-15, P0-16 | 10/10 PASS | tests/navigation-p0.test.cjs | Due missioni con ripristino e matrice 1.470 tratte: 1.244 fattibili, 226 respinte, 604 con soste. | Nessun controllo cartografico terra/mare; consumo ancora 0,85 L/NM per tutte le barche. |
| 02/11/2026 09:58 CET | P1-11 | SOSPESA | tests/community-pause.test.cjs | 5/5 test: nessun client, canale, invio, ricezione o timer chat, anche con flag registrato. Presenza globale identica. | Riattivazione subordinata ad autorizzazione server e identità verificata. Aggiornare le vecchie schede. |
| 02/11/2026 10:23 CET | P0-04, P0-06 | 14/14 PASS | tests/auth-request-lifecycle.test.cjs | Doppie richieste, errori, logout locale, risposte tardive e recupero con gestori reali e provider simulato; baseline 3 PASS / 11 FAIL. | Nessuna email o sessione reale. Conferma, link scaduti e secondo dispositivo aperti. |
| 02/11/2026 10:23 CET | P0-05, P0-06, P0-21 | 14/14 PASS | tests/save-quarantine.test.cjs | Dati originali preservati, copie incomplete protette, reset URL respinto, download grezzo e separazione delle partite. Navigazione 11/11 con validatore. | Riparazione manuale del dato, vecchie schede, scritture Deluxe autonome e concorrenza restano da coprire. |
| 02/11/2026 10:23 CET | P0-18, P0-19, P1-19 | CONTENIMENTO VERIFICATO | tests/privacy-containment.test.cjs | 7/7: nessun evento statistico nuovo dai gestori aggiornati, due sole chiavi rimosse, diagnostica senza query/hash, nessuna email inviata. | Informativa incompleta; raccolta bloccata nel frontend corrente, non nelle vecchie schede o a livello server. Storico non cancellato. |
| 02/11/2026 10:23 CET | P1-13, P1-20, P1-21 | 5/5 PASS | tests/admin-presence.test.cjs | Presenza indipendente dalle statistiche, distinzione zero/offline, risposte obsolete dopo logout/riconnessione respinte. | Conta schede/sessioni; non deduplica persone o account. Prova live con più utenti ancora aperta. |

| 02/11/2026 11:05 CET | P0-05, P0-06, P0-21 | CONCORRENZA LOCALE VERIFICATA | PR #23 / f1a26c0 | Regressioni offline SUCCESS; Chromium desktop/mobile/recovery e multi-tab SUCCESS. Una scheda con revisione obsoleta non sovrascrive la partita o il layout Deluxe aggiornato da un'altra scheda. | Restano aperti due dispositivi reali, sincronizzazione account remota e procedure complete di ripristino. |\n\n**Progetto pubblico:** https://rpgsrl24-ship-it.github.io/marina-empire/

**Repository:** https://github.com/rpgsrl24-ship-it/marina-empire

Questa checklist descrive attività di sviluppo e criteri di accettazione. Non certifica che le funzioni siano già operative, che tutti i controlli P0 siano superati o che i pagamenti possano essere attivati.
