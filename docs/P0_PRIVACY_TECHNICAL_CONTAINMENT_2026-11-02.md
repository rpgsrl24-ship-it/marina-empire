# P0 — Contenimento tecnico dei dati e assistenza

**2 novembre 2026 — Terzo ciclo di controlli sulla beta online.** Baseline: `b9057f6566bcaa6ea7e3d6db6bd533f1e6f76715`.

## Correzioni verificate nel codice

La raccolta delle statistiche di utilizzo non è necessaria per completare le missioni. In attesa dell'informativa specifica del gioco e delle decisioni sui trattamenti, sono stati sospesi i due produttori di eventi nel frontend:

- `me-traffic-v1`: non invia visite, avvii/completamenti missione o heartbeat a `me_game_events`; non genera UUID, timer o ascoltatori delle interazioni. Rimuove soltanto `me_anonymous_visitor_v1` dal localStorage e `me_traffic_session` dalla sessionStorage, quando il browser lo permette.
- `MarinaEmpireAuthenticatedActivity.track`: non verifica l'identità e non scrive eventi in `me_authenticated_activity`. La funzione resta richiamabile dalle missioni e termina senza operazioni.

I salvataggi locali, le sessioni Supabase, il trasferimento della prova ospite e la preferenza di esclusione del browser amministrativo non vengono cancellati da questo intervento. La presenza globale del gioco mantiene lo stesso script della baseline, con identificativo effimero in memoria; non viene spenta la funzionalità Realtime usata dal contatore.

La Direzione mostra un avviso sulla sospensione e descrive gli identificativi storici dei browser come pseudonimi. I dati già raccolti restano consultabili con i permessi esistenti. **Non sono stati cancellati eventi server né cambiate policy o autorizzazioni del database.** Le schede aperte con una versione precedente richiedono aggiornamento; la patch frontend non impedisce alle vecchie schede di continuare a usare il vecchio codice.

## Contatore della Direzione

Il codice precedente apriva il canale delle presenze, ma aggiornava il valore visibile leggendo gli eventi statistici degli ultimi due minuti. La sospensione degli eventi avrebbe quindi prodotto un conteggio fuorviante.

Ora il contatore visualizza le **schede di gioco connesse in tempo reale** presenti nel canale, senza leggere `me_game_events`. Non le presenta come persone uniche. Prima della prima sincronizzazione o dopo un errore mostra `—` e lo stato del collegamento; zero viene mostrato solo dopo una sincronizzazione valida e vuota. Il picco riguarda il periodo dall'ultimo collegamento del monitor.

Le callback controllano sessione amministrativa, canale attuale e stato di sottoscrizione. Una risposta precedente al logout, una connessione sostituita o una sincronizzazione tardiva dopo un errore non può ripristinare valori obsoleti.

## Assistenza senza token nell'URL

Il corpo del feedback usava `location.href.split("?")[0]`: un URL senza query ma con frammento `#access_token=…` manteneva il token nella bozza email. La diagnostica usa adesso solo `location.origin + location.pathname`, eliminando query e frammento prima della composizione.

Il clic prepara una bozza verso `info@floatmarine.it`; il gioco non invia messaggi né dichiara la consegna. Il testo scritto dal giocatore e lo user agent rimangono visibili nel messaggio preparato. I test usano solo token fittizi e non aprono un client email reale.

## Prove

| Suite | Prima della correzione | Dopo la correzione | Ambito |
| --- | --- | --- | --- |
| `tests/privacy-containment.test.cjs` | 1 PASS / 6 FAIL | 7/7 PASS | Guest/account, storage non disponibile, rimozione limitata delle chiavi, nessuna richiesta statistica, URL di assistenza con query/frammento. |
| `tests/admin-presence.test.cjs` | 4/4 casi iniziali FAIL | 5/5 PASS | Presenza senza letture statistiche, attesa/offline, logout, connessione precedente, sincronizzazione tardiva dopo errore e successiva riconnessione. |

Sono eseguiti gli script/gestori reali con trasporti e DOM controllati. La revisione indipendente ha individuato la sincronizzazione tardiva dopo errore; il quinto caso impedisce la ricomparsa del difetto. Il confronto con il commit di partenza verifica separatamente l'invarianza dello script delle presenze del gioco e delle scene 3D originali.

## P0-18 rimane aperto

L'[inventario dei dati](./PRIVACY_DATA_INVENTORY_2026-11-02.md) ricostruisce le raccolte effettive, i fornitori e la memorizzazione locale. La [bozza dell'informativa](./PRIVACY_NOTICE_DRAFT_2026-11-02.md) è esplicitamente incompleta e non viene collegata al modulo come informativa definitiva.

Restano da definire titolare e recapiti attuali, finalità/basi, conservazione e cancellazione, accordi e trasferimenti dei fornitori, gestione dei diritti e dei minori e presentazione della versione finale. La spunta esistente di presa visione non dispone ancora di un testo completo collegato. La sospensione tecnica delle statistiche non risolve questa lacuna e non equivale a una certificazione di conformità.

La verifica del commit pubblicato è registrata nella [checklist unica](./CHECKLIST_UNICA_PRELANCIO_2026-11-02.md) e nella pull request del ciclo. Nessun invio email, creazione account, lettura di righe utenti, modifica di dati server o pagamento è stato necessario per queste prove.
