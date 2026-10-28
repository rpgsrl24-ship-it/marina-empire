# Marina Empire — conservazione delle darsene approvate

## Regola di progetto
Non sostituire né ridisegnare le darsene già approvate. Conservare geometria, edifici, banchine, pontili, visuali e stile. Separare la scena 3D (visualizzazione) dalla logica di gioco (database e pagamenti).

## Audit del repository (27 ottobre 2026)
- `index.html` apre `marina-3d.html?marina=...`.
- `marina-3d.html` usa ancora una scena dimostrativa generata da primitive Three.js, con varianti per rose, rimini e pochi altri codici.
- La scena visualizza 4/12 ormeggi iniziali e ampliamenti locali fino a 52/60, non i 11.100 posti del catalogo online.
- Le prenotazioni e gli ampliamenti nella pagina 3D sono ancora in localStorage e NON rappresentano transazioni online condivise.
- I codici della scena 3D sono `rose,rimini,cervia,ancona,lignano,bari`; la lista approvata delle 12 marine ha codici e nomi differenti. Serve una mappatura esplicita, senza sostituzione silenziosa.
- L'errore JavaScript di inizializzazione `berths` è stato corretto nel commit 29030651f80b84d020f77b81c3317671cad7bdfd.

## Stato delle darsene approvate
Il repository ispezionato non dimostra ancora dove siano conservati tutti i file sorgente delle darsene 3D precedentemente approvate. NON trattare la scena generica attuale come versione definitiva.

## Attività da svolgere in ordine
- [x] Correggere errore inizializzazione lista ormeggi.
- [x] Verificare nel repository che la darsena attuale sia ancora una demo locale.
- [ ] Individuare o recuperare i file originali approvati delle 12 darsene; confrontare le visuali con l'approvazione.
- [ ] Registrare un identificatore stabile per ciascun pontile e posto, collegandolo al catalogo online (12 marine, 295 pontili, 11.100 posti).
- [ ] Mostrare i pontili chiusi con lucchetto, senza eliminarli dalla scena.
- [ ] Aprire inizialmente solo il primo pontile; acquisti/sblocchi server-side, con saldo verificato.
- [ ] Impedire prenotazioni su pontili chiusi; prenotazioni condivise e controllo conflitti.
- [ ] Verificare vista desktop/mobile e provare con due utenti.
- [ ] Solo dopo integrare navigazione, manovre, arrivi e partenze.

## Regola di sicurezza
Non trasferire crediti o autorizzare sblocchi dal solo localStorage. Non esporre chiavi segrete Supabase nel frontend.

## Aggiornamento operativo — 28 ottobre 2026

### Recupero e conservazione delle scene
- [x] Recuperato e pubblicato il file originale delle 11 marine italiane: `marine-deluxe-originali.html`.
- [x] Recuperato e pubblicato senza alterazioni il file originale approvato dell'Isola delle Rose: `isola-delle-rose-originale.html` (confronto byte per byte con upload effettuato).
- [x] Corretti i collegamenti di Isola delle Rose dalla mappa illustrata e da quella interattiva; corretti i vecchi collegamenti da `marine-deluxe-originali.html?marina=rose`.
- [x] Creato `marine-catalogo-approvato.json` con 12 scene di destinazione, 295 identificativi stabili di pontile e capienza totale 11.100.
- [ ] Validare con prove reali da desktop e smartphone il percorso mappa → ciascuna marina → ritorno alla mappa.

### Prossime attività senza alterare la grafica
- [ ] Mappare la geometria di ogni pontile e assegnare i singoli ID posto barca senza inventare capacità per pontile.
- [ ] Separare stato locale dimostrativo e stato persistente autenticato; evitare crediti doppi tra homepage e scene 3D.
- [ ] Collegare il catalogo ai record Supabase con migrazione verificata e controlli RLS.
- [ ] Implementare RPC server-side per sblocchi e prenotazioni, con controllo saldo e conflitti; solo allora abilitare transazioni vere.
- [ ] Integrare charter, charter di lusso, missioni e navigazione realistica senza ridisegnare le scene approvate.
- [ ] Eseguire test end-to-end con due account e dispositivi diversi.

### Nota tecnica
Le scene approvate contengono ancora progressi in `localStorage`. I saldi mostrati non sono sincronizzati con un database condiviso; non presentarli come crediti spendibili reali.

### Migliorie di navigazione — 28 ottobre 2026
- [x] Aggiunto pulsante discreto «Torna alla cartina» in entrambe le scene 3D originali, compatibile con schermi piccoli.
- [x] Il selettore delle marine 3D ora reindirizza sempre Isola delle Rose alla scena originale confermata.
- [x] Conservati i file grafici approvati, senza modificare geometria, pontili o edifici.
- [ ] Verifica manuale su browser reale e smartphone ancora necessaria.

### Audit database Supabase — 28 ottobre 2026
- [x] Verificato il catalogo reale: 12 marine, 295 record pontile, capacità 11.100 posti.
- [x] Rilevata e documentata la differenza di identificativi tra scene e database: `capodorlando` → `capo_orlando`; `portocervo` → `porto_cervo`.
- [x] Aggiornato `marine-catalogo-approvato.json` con `scene_id` e `database_id` distinti per evitare prenotazioni sul porto sbagliato.
- [ ] Il vecchio `berth_bookings` è ancora limitato a 6 marine e 6 posti per marina: non usarlo per vendere o prenotare i 11.100 posti.
- [ ] Confermare distribuzione dei posti per pontile confrontando geometrie 3D e tabella `marina_docks` prima di pubblicare le prenotazioni.

### Missioni charter beta — 28 ottobre 2026
- [x] Aggiunte alle 11 marine italiane due missioni demo: charter standard (+450 crediti) e charter di lusso (+1.200 crediti).
- [x] Richiesto yacht ormeggiato e pontile sbloccato; per charter di lusso richiesto maxi yacht.
- [x] Imposto intervallo minimo di 90 secondi tra missioni e conteggio missioni nel salvataggio locale.
- [ ] La ricompensa è dimostrativa e salvata solo nel browser; per economia condivisa implementare verifica server-side e anti-abuso.
- [ ] Provare missioni manualmente su desktop e mobile.
