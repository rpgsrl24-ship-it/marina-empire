# Marina Empire - Beta Test isolata (29 ottobre 2026)

Questa versione e' separata dal ramo pubblico main e utilizza chiavi di salvataggio **locali** differenti. Non e' un sito privato ospitato e non e' una copia separata del backend Supabase.

## Avvio locale (Windows)

1. Aprire GitHub, selezionare il ramo `beta/private-test-2026-10-29` e scegliere **Code > Download ZIP**.
2. Estrarre tutto lo ZIP in una cartella.
3. Aprire il terminale nella cartella estratta ed eseguire `py -m http.server 8765` (richiede Python installato).
4. Aprire `http://localhost:8765/` nel browser.
5. Per fermare il server, premere Ctrl+C nel terminale.

## Test consigliati senza account

- Avviare una nuova partita con nome di fantasia.
- Scegliere una barca e completare una tratta fra due marine.
- Controllare missione, posizione di arrivo, carburante e saldo.
- Aggiornare la pagina: la partita locale deve restare disponibile.
- Verificare il menu COMANDANTE / ACCOUNT e la visualizzazione su smartphone.

## Attenzione: account online

Questa beta usa **lo stesso progetto Supabase della versione principale**. Non usare il proprio account reale per provare SALVA ONLINE / CARICA PARTITA ONLINE: potrebbe sovrascrivere i progressi cloud. Il collaudo cloud richiede un account di prova dedicato e una verifica delle impostazioni di autenticazione per localhost.

## Stato

I test automatici GitHub Actions sul ramo di sviluppo sono passati (run 49). Il collaudo nel browser della beta locale non e' ancora stato eseguito. Il ramo main non e' stato modificato.
