# Backup e ripristino dei salvataggi cloud

Questa procedura riguarda i salvataggi di Marina Empire. Non abilita pagamenti, non modifica i privilegi amministrativi e non attribuisce l'Isola delle Rose ai giocatori.

## Regola principale

Prima di sostituire una partita locale o cloud, creare sempre una copia recuperabile della partita attuale. Se la copia di sicurezza non può essere scritta o verificata, il ripristino deve essere annullato.

## Backup locale

1. Aprire **Comandante / Account**.
2. Usare **Esporta backup** per scaricare il file JSON della partita.
3. Conservare il file senza modificarlo prima di testare import o ripristino.
4. Un salvataggio corrotto o non leggibile deve essere messo in quarantena: non deve essere sostituito automaticamente da una partita vuota.
5. Se il browser segnala un conflitto con un'altra scheda, ricaricare la pagina prima di eseguire altre scritture.

## Ripristino locale controllato

1. Usare esclusivamente un backup Marina Empire nel formato supportato.
2. Il gioco valida struttura, marina, yacht, proprieta, missioni e valori numerici prima di sostituire lo stato corrente.
3. Il viaggio in corso non viene importato come viaggio attivo.
4. Prima della sostituzione viene mantenuta la partita precedente in memoria; se il nuovo salvataggio non viene confermato, lo stato precedente viene ripristinato.
5. Dopo il ripristino verificare: marina corrente, yacht attivo, flotta, carburante, manutenzione, crediti virtuali e numero di viaggi.

## Backup cloud prima del caricamento

Prima di caricare o sostituire una partita online:

1. creare una copia locale della partita attiva;
2. registrare una copia pre-caricamento in `marina_empire_before_cloud_load`;
3. non sovrascrivere il cloud se la copia locale non e recuperabile;
4. quando si usa **Ripristina backup cloud**, creare anche una copia inversa della partita corrente in `marina_empire_before_backup_restore`;
5. se la scrittura della copia inversa fallisce, annullare il ripristino;
6. dopo il restore confrontare almeno nome comandante, crediti, flotta e marina con il backup scelto.

## Conflitti tra dispositivi

Il salvataggio cloud usa `updated_at` come revisione. Se un altro dispositivo ha scritto una versione piu recente, il client deve rifiutare la sovrascrittura obsoleta e chiedere di ricaricare/confrontare i dati. Non scegliere automaticamente il salvataggio con piu crediti o con data locale piu recente senza conferma.

## Ripristino del codice del sito

Per tornare a una versione precedente del gioco usare la procedura in `docs/ROLLBACK_PRELANCIO.md`.

Vincoli obbligatori anche durante il rollback:

- nessun force-push di `main`;
- il rollback deve essere un nuovo commit/revert verificabile;
- il deploy Pages non deve toccare account o righe di salvataggio nel database;
- le funzioni server di checkout/ricarica devono restare hard-disabled;
- l'Isola delle Rose deve restare esclusivamente RPG Yacht;
- la nuova revisione deve superare regressioni, Chromium e verifica `release.json`/homepage pubblica.

## Collaudo campione

Il test automatico di regressione deve includere almeno:

- ripristino di un backup valido;
- rifiuto di backup invalido;
- annullamento se non si puo creare la copia di sicurezza;
- conservazione della partita corrente se la scrittura del restore fallisce;
- protezione di un salvataggio corrotto;
- blocco di una scheda/dispositivo con revisione obsoleta.

Il collaudo automatico non sostituisce la prova finale del titolare su una partita reale.
