# Marina Empire - Google Play release kit

Stato: preparazione beta Android / Trusted Web Activity.

## Identita app
- Nome: Marina Empire
- Package ID: com.rpgyacht.marinaempire
- Version name iniziale: 1.0.0
- Version code iniziale: 1
- URL PWA: https://rpgsrl24-ship-it.github.io/marina-empire/
- Scope: https://rpgsrl24-ship-it.github.io/marina-empire/
- Categoria: Games / Simulation
- Publisher: R.P.G. S.r.l. / RPG Yacht
- Privacy: https://rpgsrl24-ship-it.github.io/marina-empire/privacy.html

## Packaging consigliato
Trusted Web Activity (TWA) generata con Bubblewrap/PWABuilder.
Target SDK: API 36 per una nuova pubblicazione Google Play nel 2026.

## Firma
NON salvare keystore, password o chiavi private nel repository.
Generare una chiave di upload dedicata e conservarla fuori da GitHub.
Dopo la generazione della chiave, inserire il certificato SHA-256 nel file:
.well-known/assetlinks.json

## Passi Play Console
1. Creare app "Marina Empire".
2. Selezionare categoria Game / Simulation.
3. Caricare AAB firmato.
4. Compilare App access, Ads, Content rating, Target audience e Data safety.
5. Inserire Privacy Policy.
6. Caricare icona, feature graphic e screenshot smartphone.
7. Pubblicare prima su Internal testing / Closed testing.
8. Solo dopo i test, richiedere Production.

## Test minimi prima della produzione
- Nuovo giocatore -> setup -> prima missione.
- Navigazione e arrivo.
- Marina Live e incarichi.
- Login / logout / salvataggio.
- Acquisto crediti e ritorno al gioco.
- Rotazione schermo, back gesture, resume dopo sospensione.
- Nessun contenuto coperto dalla barra di navigazione Android.
