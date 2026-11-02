# P0 — Ciclo delle richieste di accesso — 2 novembre 2026

## Ambito

Revisione delle funzioni di autenticazione in `me-cloud-sync-v1`, basata sul commit `b9057f6566bcaa6ea7e3d6db6bd533f1e6f76715`. Modificati soltanto controlli dei pulsanti, richieste login/registrazione/email/recupero/logout e gestione degli eventi di sessione. Nessuna modifica alla configurazione Supabase, al database, ai pagamenti, alla grafica o ai form HTML in questo intervento.

## Difetti riprodotti e correzioni

- Login e registrazione accettavano invii sovrapposti. L'invio del link email lasciava disponibili i comandi concorrenti. Ora tutte le richieste di accesso condividono un controllo di occupazione; anche i gestori rifiutano il secondo invio.
- Un esito tardivo poteva sostituire il messaggio della sessione successiva o liberare i comandi di una richiesta nuova. Ogni richiesta ha ora una propria identità; il cambio account o logout invalida soltanto la richiesta auth precedente. Il blocco occupato dai salvataggi non viene liberato da questo meccanismo.
- Le eccezioni del logout non erano intercettate. Ora un errore mantiene coerente lo stato collegato e permette di riprovare. Il logout usa `scope: "local"`, preservando le sessioni sugli altri dispositivi.
- Un errore tardivo del controllo iniziale `getUser()` poteva sovrascrivere il messaggio di un accesso già riuscito. Il confronto della versione degli eventi protegge anche il percorso di errore.
- Una riconciliazione dei progressi già programmata poteva partire mentre era visibile il recupero password o mentre un altro comando era occupato. Il timer ora ricontrolla account, registrazione, modalità recupero e occupazione prima di richiamare la funzione di salvataggio, che non è stata modificata qui.
- Le password dei campi vengono svuotate dopo successo/cambio sessione; il comando di recupero completato viene disabilitato. Un aggiornamento password fallito lascia disponibile il recupero per un nuovo tentativo.

## Prove eseguite

`tests/auth-request-lifecycle.test.cjs` esegue le funzioni effettive estratte da `index.html` con risposte del provider controllate. La suite finale copre **14 casi**:

1. Doppio invio login.
2. Doppio invio registrazione.
3. Esclusione reciproca fra link email e altri comandi.
4. Errori di rete e ripristino dei controlli.
5. Eccezione del logout e scope locale.
6. Errore restituito dal logout e coerenza della UI.
7. Evento di accesso riuscito proveniente dalla richiesta corrente.
8. Risposta di recupero tardiva dopo logout.
9. Vecchio aggiornamento password che termina durante una richiesta nuova.
10. Errore iniziale tardivo dopo accesso riuscito.
11. Timer di sincronizzazione durante recupero password.
12. Timer di sincronizzazione durante un'altra operazione occupata.
13. Aggiornamento password fallito e possibilità di riprovare.
14. Recupero completato, campi puliti e comando disabilitato.

| Versione | Risultato |
| --- | --- |
| Baseline `b9057f6` | 3 PASS, **11 FAIL** |
| Codice corretto | **14/14 PASS** |
| Suite precedente `p0-access-payment.test.cjs` | **12/12 PASS** |
| Contratti `prelaunch-auth-contract.test.cjs` | **PASS** |

Riproduzione: impostare `P0_AUTH_SOURCE_FILE` al file `index.html` del commit di partenza. Gli undici fallimenti rappresentano scenari di regressione, non undici incidenti osservati sul servizio pubblico.

## Revisione Supabase e limiti

Il callback `onAuthStateChange` resta sincrono e viene registrato prima di `getUser()`, conservando la gestione di `PASSWORD_RECOVERY` durante l'inizializzazione. La versione SDK, `persistSession`, `autoRefreshToken`, `detectSessionInUrl` e i redirect allo stesso percorso del gioco restano invariati. La modifica dello scope logout segue la [documentazione ufficiale di signOut](https://supabase.com/docs/reference/javascript/auth-signout); gli eventi seguono il [riferimento onAuthStateChange](https://supabase.com/docs/reference/javascript/auth-onauthstatechange).

**Nessuna email inviata, nessun account creato, nessun token o sessione reale usato e nessun dato utente letto.** Le risposte e gli eventi del provider sono simulati; i gestori applicativi eseguiti sono quelli di produzione. Il controllo di richiesta impedisce esiti UI obsoleti, ma non annulla una richiesta già inviata al provider.

Conferma email reale, link scaduti, cambio password tramite email e accesso da un secondo dispositivo restano da collaudare. Questa prova non chiude da sola il percorso end-to-end di P0-04/P0-06.
