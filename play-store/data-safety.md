# Google Play - Data Safety draft

Questa bozza deve essere ricontrollata nella Play Console prima della pubblicazione.

## Dati raccolti
### Account
- Email: SI, quando l'utente crea/accede a un account.
- User ID tecnico: SI, per autenticazione e salvataggi.
- Nome comandante: SI, se salvato nell'account/profilo di gioco.

### Attivita app
- Progressi di gioco: SI.
- Eventi tecnici di utilizzo: SI, in forma limitata per analisi beta e diagnostica.

### Contenuti utente
- Messaggi community/chat: SI, se l'utente utilizza la community.

## Dati non raccolti intenzionalmente
- Posizione precisa: NO.
- Contatti del dispositivo: NO.
- Foto/video personali: NO.
- Audio/microfono: NO.
- SMS: NO.
- Dati sanitari: NO.

## Finalita
- Funzionamento dell'app.
- Gestione account.
- Sincronizzazione salvataggi.
- Sicurezza e prevenzione abusi.
- Analisi tecnica della beta.
- Assistenza.

## Condivisione
Verificare i ruoli dei fornitori tecnici usati dall'app, tra cui GitHub Pages e Supabase, e dichiarare la condivisione secondo le definizioni Google Play applicabili.

## Sicurezza
- Connessioni HTTPS.
- Password gestite dal provider di autenticazione.
- Nessuna chiave privata Android nel repository pubblico.

## Eliminazione dati
La privacy policy deve indicare come l'utente puo richiedere cancellazione account e dati associati. Se Google Play richiede un URL dedicato per la cancellazione account, predisporre una pagina pubblica dedicata.
