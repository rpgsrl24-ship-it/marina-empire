# P0-05 / P0-06 — Protezione dei salvataggi non leggibili

Data: 2 novembre 2026. Baseline verificata: `b9057f6`.

Stato: contenimento implementato e verificato con test isolati. **P0-05 e P0-06 restano parziali**: non è ancora disponibile una procedura completa di riparazione e sostituzione esplicita del salvataggio corrotto. La nuova prova browser mobile è inclusa nel runner e deve essere eseguita dalla CI prima del rilascio.

## Difetti riprodotti sulla baseline

Le prove hanno eseguito le funzioni reali di `index.html` in una VM Node con storage fittizio; nessun account o dato di un giocatore è stato letto o modificato.

| Caso | Risultato sulla baseline |
| --- | --- |
| JSON locale troncato, seguito da `persist()` | Il caricamento usava `fresh()`, `persist()` restituiva `true` e sostituiva l'originale con una partita vuota. |
| Dati con `reservations: {}` e `trip: []` | `validState()` restituiva `true` perché il controllo precedente non esaminava queste strutture. |
| Apertura con `?reset=1` e salvataggio corrotto presente | Il parametro URL cancellava il salvataggio senza una conferma nell'interfaccia. |

## Comportamento introdotto

`save-state-guard.js` fornisce un validatore condiviso e uno stato di protezione separato per ogni chiave locale. Il caricamento iniziale e la selezione dell'account in `index.html` distinguono un salvataggio assente da uno non leggibile, incompleto o inaccessibile.

- **Salvataggio assente:** la creazione della prima partita resta consentita.
- **Salvataggio valido:** viene caricato senza scrivere sullo storage. I campi opzionali legacy mancanti ricevono i valori iniziali già previsti dal gioco; i campi presenti e quelli aggiuntivi vengono conservati. La validazione non riordina gli array e non azzera i progressi.
- **JSON non valido o struttura incompatibile:** lo storage originale resta intatto. Uno stato neutro viene usato solo in memoria per mantenere disponibile l'interfaccia; `persist()` rifiuta la scrittura su quella chiave.
- **Storage inaccessibile:** la mancata lettura non autorizza una nuova partita nella stessa chiave. Se una copia era già stata letta correttamente, resta disponibile per l'esportazione; altrimenti il pulsante di download è disabilitato finché non è possibile rileggere i dati.
- **Errore introdotto durante la sessione:** prima di scrivere, il guard ricontrolla il contenuto attuale dello slot e lo stato in memoria. Un contenuto diventato corrotto o uno stato con valori non validi interrompono la scrittura e attivano la protezione.
- **Helper assente o non caricato:** il percorso principale non apre uno slot scrivibile. Il gioco mostra il recupero e preserva il salvataggio esistente.

La protezione impedisce anche a ingresso nel gioco, NUOVA PARTITA e importazione di sostituire automaticamente uno slot protetto. `?reset=1` non cancella più salvataggi o layout. Un account alternativo con uno slot valido o assente può essere utilizzato; tornando allo slot corrotto, la protezione viene ripristinata.

Il validatore controlla i campi numerici principali, gli identificativi del catalogo attuale, le collezioni usate dal rendering, i dati della flotta e la struttura dei viaggi. È condiviso da `validState()` per caricamento cloud, riconciliazione, salvataggio cloud e copie di sicurezza, e dal controllo dell'importazione locale. I controlli cloud già presenti continuano quindi a rifiutare dati remoti non validi prima della sostituzione. Non sono stati modificati database, policy o funzioni Supabase.

## Recupero offerto all'utente

Il pannello «Salvataggio locale protetto» compare sopra la schermata iniziale, con dimensioni limitate alla finestra e scorrimento interno. Offre:

1. **SCARICA COPIA ORIGINALE:** scarica il testo conservato da `localStorage` senza trasformarlo in una partita nuova e senza un ciclo JSON parse/stringify. La copia rimane sul dispositivo; non viene inviata automaticamente all'assistenza.
2. **APRI ACCESSO ACCOUNT:** chiude la schermata iniziale, apre il profilo e sposta lì l'avviso, lasciando accessibile il modulo account.
3. Istruzioni per conservare la copia, contattare `info@floatmarine.it`, usare un altro account o dispositivo e ripristinare l'accesso allo storage se il browser lo blocca. L'avviso chiede di non cancellare i dati del sito.

La copia scaricata è un file di recupero `.txt`, non un backup automaticamente importabile. La procedura per correggerlo, verificare il risultato e autorizzare la sostituzione dell'originale deve ancora essere progettata. Il blocco non viene rimosso da un normale tentativo di importazione nello stesso slot.

## Verifiche eseguite

| Suite | Risultato locale | Criteri |
| --- | --- | --- |
| `tests/save-quarantine.test.cjs` | **14/14 PASS** | JSON troncato; campi strutturali non validi; prima partita; campi legacy/aggiuntivi; storage inaccessibile; account alternativo; validazione cloud; backup non valido; copia originale; parametro reset; stato RAM non valido; storage perso dopo lettura; corruzione comparsa durante la sessione; helper assente. |
| `tests/navigation-p0.test.cjs` | **11/11 PASS** | Il guard reale valida gli stati prodotti dai percorsi di salvataggio effettivi. Prova aggiunta per partenza, ripresa e arrivo di tutte le 7 imbarcazioni; incluse le prove esistenti con soste, rifornimenti, fondi insufficienti e cambio barca. |
| Matrice della stessa suite di navigazione | **1.470 piani verificati** | 1.244 possibili, 226 bloccati, 604 con più tratte. È una matrice di pianificazione; non equivale a 1.470 viaggi completi eseguiti nel browser. |
| `tests/p0-access-payment.test.cjs` | **12/12 PASS** | Fixture aggiornata per usare il guard reale nella selezione account; asserzioni di accesso, passaggio della prova ospite e pagamenti mantenute. |
| `tests/cloud-save-integrity.test.cjs` | **14/14 PASS** | Verifica locale, conflitti cloud, cambio account, rollback e assenza di conferme di successo quando lo storage rifiuta la scrittura. |
| `tests/prelaunch-save-contract.test.cjs` | **PASS** | Contratto aggiornato al caricamento protetto e al helper; controlli di saldo, partenza e singola erogazione della ricompensa conservati. |
| `node --check tests/prelaunch-browser.test.cjs` e `git diff --check` | **PASS** | Sintassi del nuovo caso browser e integrità della patch. |
| `tests/prelaunch-browser.test.cjs`, scenario `recovery-mobile` | **Da eseguire in CI** | Startup corrotto a 390 × 844, posizione del pannello, hit test dei pulsanti sopra `welcome`, download con contenuto originale, nessuna sostituzione tramite ingresso e modulo account raggiungibile. |

Il browser locale non è disponibile in questa sessione; il tentativo si è fermato prima di aprire Chromium perché l'eseguibile non esiste. Il nuovo scenario viene eseguito dal runner browser ordinario quando non è impostato un filtro. Non è dichiarato un esito browser positivo prima dei log della CI.

## Limiti e lavoro residuo

- **Recupero completo:** manca la riparazione guidata, con anteprima dei dati recuperabili e sostituzione esplicita dopo aver conservato l'originale. L'accesso cloud sullo stesso slot protetto non aggira questo blocco. P0-05 e P0-06 non sono chiusi integralmente.
- **Ambito della quarantena:** riguarda il percorso aggiornato di `index.html` e il suo `persist()`. Una scheda già aperta con una versione precedente non riceve retroattivamente il guard.
- **Deluxe 3D:** `marine-deluxe-originali.html` continua a usare `local-save-context.js` con la propria verifica minima di nome/crediti e del contesto account. Il nuovo validatore strutturale non è stato aggiunto a `readGame()`/`writeGame()`. Una scheda Deluxe ancora associata allo stesso account può quindi modificare uno stato strutturalmente non valido che supera quei controlli minimi. La grafica e i file delle scene 3D restano invariati; questa estensione va affrontata separatamente.
- **Concorrenza tra schede:** la rilettura prima della scrittura può rilevare contenuti già corrotti, ma non fornisce atomicità tra schede. Due stati validi aggiornati contemporaneamente sullo stesso slot non sono protetti da confronto di versione o transazione. Non viene dichiarata una garanzia generale contro sovrascritture concorrenti.
- **Compatibilità:** sono accettati i dati del catalogo supportato e i campi legacy opzionali/aggiuntivi verificati dai test. Un'identità di barca o porto sconosciuta nei campi necessari al gioco resta protetta, senza cancellarla. La compatibilità con tutti i formati storici mai distribuiti non è dimostrata.
- **Importazione ordinaria:** la precedente selezione dei campi ammessi e l'esclusione dei viaggi in corso nell'importazione di backup restano in funzione. Questa modifica non trasforma l'importazione in un recupero integrale di qualsiasi file storico.
- **Persistenza rifiutata durante il gioco:** il guard conserva il contenuto precedente, ma non aggiunge un rollback a ogni singola mutazione di gameplay. Il recupero resta necessario per uno slot bloccato; non si deve presentare la partita temporanea in RAM come un progresso salvato.

## Ritorno a una versione precedente

Non eliminare dati del browser per risolvere un problema di pubblicazione. Prima di qualsiasi intervento su uno slot protetto conservarne la copia originale. Preferire un commit correttivo o una revisione del singolo cambiamento: un ritorno completo alla baseline riaprirebbe i difetti di sovrascrittura e del parametro URL descritti sopra. Qualsiasi rollback deve conservare pagamenti OFF, Isola delle Rose riservata e le protezioni dei salvataggi; non richiede modifiche alle scene 3D o ai dati server.

Nessuna prova ha inviato email o messaggi, creato account, attivato pagamenti o modificato dati cloud. Il rilascio e le verifiche browser della PR sono gestiti separatamente e registrati nella pull request e nella checklist unica.
