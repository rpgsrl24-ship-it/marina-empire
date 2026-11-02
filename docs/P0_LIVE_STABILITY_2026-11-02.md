# Stabilizzazione del gioco già online — 2 novembre 2026

## Ambito

Secondo ciclo della checklist unica, successivo alla revisione `76c5731`. Marina Empire è già pubblicato: le correzioni tutelano le partite esistenti e precedono nuove funzionalità. Isola delle Rose resta la base esclusiva di RPG Yacht, i pagamenti restano spenti e le scene 3D originali non sono modificate.

## Salvataggi: problemi riprodotti e correzioni

La verifica online confrontava il risultato del database con `JSON.stringify`. Un documento JSONB può restituire le stesse proprietà in ordine diverso, anche negli oggetti annidati: il gioco poteva quindi mostrare un falso errore di salvataggio. Il comportamento è stato confermato con una SELECT di soli valori fittizi sul database, senza leggere o modificare partite.

Il nuovo confronto `sameGameState` considera il contenuto degli oggetti indipendentemente dall'ordine delle proprietà. Continua a distinguere tipi, valori, proprietà mancanti, `null` e ordine degli array. Il controllo delle modifiche concorrenti tramite `updated_at` rimane attivo.

Sono stati corretti anche questi casi:

- Cambio account durante una lettura: interrompe il flusso prima della conferma di sovrascrittura e prima di nuovi aggiornamenti.
- Cambio account durante la verifica finale: non mostra una conferma di salvataggio attribuibile al nuovo account.
- Pulsante SALVA: non mostra «Partita salvata» quando il browser rifiuta la scrittura o non ne conferma la rilettura.
- Caricamento cloud manuale/automatico, ripristino, importazione e nuova partita: conservano la partita precedente in memoria quando la persistenza fallisce.
- Caricamento o ripristino di un viaggio in corso: riapre la navigazione invece della home.

Il ripristino riguarda lo stato in memoria. Se una scrittura fosse riuscita ma la successiva rilettura fosse indisponibile, non è possibile garantire che i byte persistenti siano ancora quelli precedenti. Le copie di sicurezza restano disponibili per i percorsi di caricamento/ripristino; non viene promessa una transazione atomica di localStorage.

## Navigazione

`tests/navigation-p0.test.cjs` esegue le funzioni del gioco, senza sostituirle con una seconda implementazione: **10 test superati**.

- Due missioni consecutive Rimini → Cervia → Ancona, con ripristino e posizione dello yacht verificata.
- Matrice di **1.470 combinazioni**: 7 barche × 15 porti × 14 destinazioni. Risultano 1.244 rotte fattibili, 226 respinte per autonomia e 604 con soste.
- Verificati estremi e coordinate delle rotte fattibili, riserva del 15%, soglia al litro, assenza di cicli e coerenza numerica dei consumi.
- Addebiti delle soste coerenti con il preventivo; fondi insufficienti e sosta interrotta non generano saldi negativi o premi impropri.
- Rifornimento e manutenzione rispettano capacità e condizione massima; cambio yacht conserva porto, carburante e usura e resta bloccato in viaggio.

Non sono emersi nuovi blocchi nei percorsi esaminati. Restano due limiti: questa matrice non verifica cartograficamente gli attraversamenti terra/mare; il consumo attuale è ancora uniforme a 0,85 L/NM, anche se i serbatoi sono diversi. P0-15 e P0-16 rimangono quindi parziali.

## Pagamenti e chat

Il [report pagamenti OFF](P0_PAYMENTS_OFF_2026-11-02.md) documenta i tre gestori server costantemente disabilitati, distribuiti e verificati alle 09:58 CET. Nessuna variabile di ambiente può riattivarli. Test con header simulati e confronto dei sorgenti live coprono anche il comportamento dopo il gateway; non sono stati usati account reali.

Il [report chat](CHAT_ACCESS_CONTAINMENT_2026-11-02.md) documenta la sospensione temporanea della chat pubblica. Il pannello non apre canali, non invia/riceve messaggi e non registra presenze. Il contatore globale resta identico. La funzione P1-11 è ancora aperta: la riattivazione richiede autorizzazione server e identità del mittente verificata. Le schede già aperte sulla vecchia versione devono essere aggiornate.

## Verifiche e limiti

- **29 suite offline superate**, compresi controlli precedenti su Isola delle Rose, separazione account, pagamenti, risorse locali e missioni.
- Parsing dei 27 script inline superato.
- Audit ormeggi invariato: 295 pontili controllati, 136 disallineamenti ancora respinti. Non viene dichiarata completata la mappatura.
- Le prove browser sono obbligatorie nella PR e nuovamente prima del deploy GitHub Pages. Il browser locale del ciclo precedente non era più disponibile: non viene conteggiato un collaudo locale non eseguito.
- Nessun account, ordine, pagamento, accredito, email o messaggio di chat reale generato dai controlli.
- Nessun dato giocatore consultato. La prova JSONB contiene soltanto una fixture esplicita; i controlli server riguardano sorgenti, configurazione, metadati e richieste vuote.

Restano aperti informativa specifica del gioco, conferma/recupero via email reali, due account su due dispositivi, chat autorizzata dal server, differenziazione dei consumi e mappatura completa degli ormeggi.

## Riferimenti

- [PostgreSQL: JSON e JSONB](https://www.postgresql.org/docs/17/datatype-json.html).
- [Supabase: dati JSON](https://supabase.com/docs/guides/database/json).
- [Checklist unica](CHECKLIST_UNICA_PRELANCIO_2026-11-02.md).
