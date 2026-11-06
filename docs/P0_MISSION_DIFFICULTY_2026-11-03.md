# Marina Empire — P0-26 audit difficoltà crescente

Data: 3 novembre 2026

## Esito

La difficoltà cresce già lungo più assi senza bloccare i primi passi:

- prima missione: RPG Academy 8, costo missione 0, ricompensa 500, durata 25 secondi;
- missioni benchmark S001-S005: costi, ricompense, prestigio e durata crescono progressivamente;
- classi yacht superiori richiedono investimenti maggiori;
- equipaggio e costo equipaggio crescono con la classe yacht;
- le missioni dinamiche aumentano costo/ricompensa con distanza e classe;
- la durata dinamica cresce con la distanza ed è limitata fra 25 e 120 secondi;
- autonomia, riserva carburante, manutenzione, proprietà dello yacht e saldo insufficiente possono bloccare la partenza prima di addebitare;
- le tratte impossibili vengono respinte dal planner;
- il meteo simulato aggiunge una variabilità controllata di durata/usura senza modificare carburante o rotta.

## Limiti

La difficoltà non è ancora espressa con un numero “facile/medio/difficile” in UI e non è legata direttamente al livello del giocatore. Oggi emerge da distanza, yacht, equipaggio, costi, autonomia e meteo.

Per il P0 questo è sufficiente se:
1. il percorso iniziale resta giocabile con Academy 8;
2. i requisiti aumentano senza introdurre missioni impossibili;
3. ricompense e prestigio crescono assieme all'impegno;
4. smoke e regression restano verdi.

Le future etichette di difficoltà e una maggiore varietà missioni restano lavoro P1.
