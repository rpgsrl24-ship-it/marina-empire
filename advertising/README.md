# Campagne pubblicitarie cliccabili — Marina Empire

## Stato implementazione
Il cartellone 3D di `isola-delle-rose-originale.html` legge `advertising/campaigns.json` e accetta solo campagne con slot `isola-rose-main`, stato `active`, date UTC correnti, immagine locale autorizzata e sito HTTPS. Cliccando sul pannello 3D si apre una conferma prima di visitare il sito in una nuova scheda.

## Esempio di configurazione (NON attivo)
```json
{
  "schema_version": 1,
  "campaigns": [
    {
      "slot": "isola-rose-main",
      "status": "active",
      "start": "2027-01-01",
      "end": "2027-01-31",
      "image": "./advertising/assets/sponsor-demo.webp",
      "website": "https://example.com/"
    }
  ]
}
```
L'immagine deve essere pubblicata nella cartella `advertising/assets/` con nome semplice e formato JPG, PNG o WebP. Non usare URL remoti per le immagini. Il codice usa il fallback RPG Yacht se il file manca, se la campagna è scaduta o se l'URL non è accettato.

## Processo operativo
1. RPG Yacht verifica il cliente, la licenza d'uso del logo/foto e il sito di destinazione.
2. Contratto e fattura in euro; nessun credito virtuale.
3. Un amministratore autorizzato pubblica immagine e configurazione tramite revisione GitHub.
4. Controllo manuale del cartellone nel browser desktop e mobile.
5. A scadenza il pannello torna alla grafica predefinita.
6. Non sono ancora disponibili upload da pannello, fatturazione automatica, metriche click affidabili o prenotazioni di spazi.

## Sicurezza e limitazioni
Il file JSON pubblico non contiene dati personali, prezzi o dettagli di pagamento. La pubblicazione richiede permessi di scrittura sul repository. La conferma del click riduce le aperture accidentali. Il caricamento di texture e la navigazione 3D devono essere verificati su dispositivi reali prima della vendita di campagne. Per un sistema commerciale in produzione occorreranno backend con autorizzazione, registro degli incassi e controllo editoriale.
