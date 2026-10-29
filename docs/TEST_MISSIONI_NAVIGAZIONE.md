# Marina Empire - Test di regressione missioni e navigazione

Ramo di sviluppo: dev/mission-regression-2026-10-29. Questo documento definisce i test da superare prima di modificare il gioco pubblico.

## Ciclo obbligatorio Rimini - Cervia
1. Avviare nuova partita con RPG Academy 8 e marina Rimini.
2. Annotare porto corrente, saldo, carburante, livello e missioni disponibili.
3. Selezionare una missione compatibile con Rimini; verificare che la partenza sia Rimini e non un porto fisso.
4. Verificare rotta sul mare, distanza, consumo e disponibilita carburante prima della partenza.
5. Completare la traversata: la posizione finale deve essere Cervia; carburante diminuito una sola volta; premio accreditato una sola volta.
6. Aprire nuovamente il pannello missioni: le missioni devono partire da Cervia, non da Rimini o Ancona.
7. Ricaricare la pagina e recuperare il salvataggio: porto, saldo e carburante devono restare coerenti.
8. Ripetere con trasferimento libero e con missione charter.

## Casi negativi
- Partenza e arrivo uguali: impedire la tratta o presentare esplicitamente un giro locale.
- Carburante insufficiente: non avviare la navigazione e non addebitare costi.
- Doppio clic su ricompensa: nessun doppio accredito.
- Refresh durante navigazione: stato consistente e ripristinabile.
- Missione di altra marina: non deve essere selezionabile come partenza locale.
- Salvataggio locale e cloud: differenze rese esplicite, nessuna sovrascrittura silenziosa.

## Criteri di rilascio
Tutti i test critici devono passare su desktop e smartphone; nessuna regressione di login, accesso amministratore, missioni e salvataggi. Non pubblicare su main prima della verifica.

## Verifica esplorativa 29 ottobre 2026
Interfaccia pubblica visitabile; riscontrate selezione yacht, marine, route planner, mappa, centro missioni, investimenti, Isola delle Rose e pagina 3D. La sola presenza di pulsanti non prova il corretto completamento di una traversata. Questo documento e un piano di test, non un rapporto di test superati.
