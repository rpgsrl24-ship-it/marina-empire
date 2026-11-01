# Marina Empire — verifica tecnica analytics prima del rilascio

## Struttura rilevata
Nel progetto Supabase esiste già public.me_game_events. Non creare una tabella parallela prima di averne verificato schema, RLS, permessi e codice che scrive gli eventi.

## Implementazione necessaria
1. Ispezionare colonne, indici, RLS e policy di me_game_events; verificare eventuali dati storici.
2. Definire eventi con nomi coerenti: session_active, tutorial_completed, mission_started, mission_completed, marina_visited. Evitare identificatori e dati personali nei payload.
3. Registrare session_active solo dopo un'interazione effettiva di un utente registrato, con consenso per analytics non essenziali; non contare semplici caricamenti pagina o ospiti come utenti registrati.
4. Proteggere scrittura e lettura: client solo eventi del proprio account; statistiche aggregate riservate alla Direzione, senza accesso a eventi individuali altrui.
5. Deduplicare sessioni e missioni: identificativi idempotenti, limiti server-side contro spam e controlli di validità.
6. KPI: DAU, MAU, retention D1/D7/D30, tutorial completion, mission completion. Separare utenti reali, ospiti, sessioni, pageview e test interni.
7. Dashboard Direzione: aggregati e confronto periodi; non esporre email, nomi, IP, chat o token.
8. Test automatici: RLS tra due account, utente anonimo, duplicati, sessione scaduta, dati aggregati.
9. Verificare requisiti privacy e consenso prima dell'attivazione in produzione.

## Stato
Audit iniziato; rilevata tabella esistente. Schema dettagliato non ancora verificato: una richiesta di ispezione è stata bloccata, pertanto non dichiarare attiva o accurata la telemetria finché non è stata completata la verifica.
