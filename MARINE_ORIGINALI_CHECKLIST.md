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
