# Marina Empire — piano crescita e monetizzazione (bozza operativa)

## Principio
Gioco gratuito completo con progressione graduale; acquisti di crediti solo facoltativi, mai necessari per terminare missioni o giocare con altri. Nessuna vendita abilitata in questa fase.

## Obiettivo di validazione
Raggiungere 1.000 utenti attivi mensili (MAU) reali e misurati prima di investire in campagne a pagamento importanti. Distinguere visitatori, account registrati, utenti che hanno effettivamente giocato e utenti paganti.

## Eventi minimi (solo utenti consenzienti, identificativi pseudonimi)
- account_created: registrazione riuscita
- tutorial_started, tutorial_completed: primo accesso e completamento
- mission_started, mission_completed: missioni reali
- marina_visited: prima visita di una marina
- berth_booking_confirmed: prenotazione online confermata
- session_active: attività effettiva di gioco, non solo pagina aperta
- purchase_intent: clic su una futura offerta, senza pagamento
- purchase_completed: solo da webhook verificato lato server, mai da JavaScript client

Non registrare email, nomi, chat, coordinate GPS, token o credenziali negli eventi. Consentire disattivazione degli analytics non essenziali.

## KPI settimanali
- MAU e DAU di giocatori reali, non visite
- registrazioni / visitatori
- completamento tutorial / nuovi giocatori
- retention D1, D7, D30 (coorti)
- missioni completate per giocatore attivo
- conversione paganti / MAU, solo dopo l'attivazione commerciale
- ARPPU = ricavi netti da acquisti / paganti
- ARPMAU = ricavi netti da acquisti / MAU
- costi hosting, assistenza, commissioni, marketing; margine netto per mese

## Esperimenti prima della monetizzazione
1. Semplificare onboarding ospite: prova breve, poi registrazione gratuita con nome ed email per salvare progressi.
2. Rendere comprensibile il primo ciclo: missione → crediti → carburante/manutenzione → miglioramento yacht.
3. Verificare navigazione e console su smartphone, con test di regressione automatizzati.
4. Introdurre motivi per tornare: missioni giornaliere, progressi e nuove marine, evitando meccaniche punitive.
5. Moderazione e controlli privacy prima di abilitare chat pubbliche.

## Soglie di decisione (obiettivi di progetto, non benchmark garantiti)
- Prima soglia: 100 giocatori registrati che completano una missione; verificare errori e feedback.
- Seconda soglia: 1.000 MAU e retention D7 misurabile su coorti sufficienti; valutare campagne e collaborazioni.
- Terza soglia: 10.000 MAU; valutare sponsorship nautiche e crediti opzionali solo con checkout, ledger e rimborsi testati end-to-end.

## Modello economico illustrativo
Ricavi lordi mensili da crediti = MAU × quota paganti × spesa media mensile per pagante.
- 1.000 × 3% × €15 = €450/mese
- 10.000 × 5% × €9 = €4.500/mese
- 50.000 × 6% × €10 = €30.000/mese

Queste sono simulazioni, non previsioni. Separare IVA, rimborsi, commissioni, hosting, marketing e costi del personale per ottenere margine e utile.

## Vincoli di lancio
- Non abilitare vendite o addebiti automatici senza autorizzazione esplicita del titolare.
- Non accreditare monete pagate tramite logica client-side; usare transazioni server-side e webhook verificati.
- Distinguere monete demo, crediti premium e saldo spendibile; documentare il cambio e le condizioni prima del lancio.
- La prenotazione online beta resta gratuita e separata dall'economia locale finché non esiste un'integrazione server-side sicura.
- Collaudo finale manuale a cura del titolare.
