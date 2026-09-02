# S.E.C. — Level -25

Prima vertical slice gratuita del gioco sparatutto horror fantascientifico in terza persona.

## Contenuto della demo

- corridoio 3D del livello −1 della struttura S.E.C.;
- protagonista controllabile in terza persona;
- mira con il mouse, movimento WASD, sparo e ricarica;
- quattro anomalie biologiche;
- HUD, salute, munizioni, obiettivo e breve rivelazione narrativa;
- comandi touch per smartphone e tablet in modalità orizzontale;
- qualità di rendering ridotta automaticamente sui dispositivi mobili;
- selezione di quattro agenti con statistiche e stile di gioco differenti;
- ritratti concept dei quattro agenti approvati;
- audio procedurale per menu, generatori, gocce, metallo, spari e annunci del bunker;
- menu operativo ridisegnato con personaggio intero, animazione e statistiche;
- musica melodrammatica originale e rumori ambientali intermittenti direzionali;
- primo personaggio 3D animato: Jack usa il modello Soldier con 24 animazioni;
- nuovo livello iniziale all'esterno della sede S.E.C., con strada, facciata, illuminazione, pioggia e ingresso automatico;
- sei ratti mutati animati sostituiscono i precedenti bersagli geometrici;
- nessun database, account o servizio a pagamento.

## Avvio locale

Serve un piccolo server statico, perché il gioco usa moduli JavaScript:

```bash
npx serve .
```

Aprire quindi l'indirizzo mostrato nel terminale.

## Comandi

- Computer: WASD, mouse, click sinistro e R.
- Smartphone/tablet: joystick sinistro, trascinamento a destra, pulsanti SPARA e R.
- Sui dispositivi mobili è consigliata la modalità orizzontale.

## Agenti disponibili

- Jack “Tank” Ryder: più salute e danno doppio, ma fuoco più lento.
- Maya Reyes: caricatore da 18 colpi e fuoco rapido.
- Noah “Ghost” Kane: velocità massima, ma salute ridotta.
- Dr. Victor Chen: rigenerazione lenta della salute.

## Antagonista

Il responsabile degli esperimenti e autore dei registri è il Dr. Crowther.

## Pubblicazione gratuita

1. Creare un repository GitHub.
2. Caricare il contenuto di questa cartella nella radice del repository.
3. In Vercel scegliere **Add New → Project** e importare il repository.
4. Lasciare vuoti Build Command e Output Directory: è un sito statico.
5. Pubblicare.

## Roadmap suggerita

1. Migliorare feeling, telecamera e collisioni.
2. Creare selezione dei quattro protagonisti.
3. Sostituire i modelli provvisori con personaggi animati GLB.
4. Costruire il piano −1 completo con puzzle e miniboss.
5. Aggiungere audio, documenti collezionabili e salvataggi locali.
6. Solo dopo la prova del primo livello, progettare gli altri settori.

## Nota tecnica

La demo usa Three.js tramite CDN. Per una produzione più ampia passeremo a Vite, dipendenze versionate, asset ottimizzati e test automatici, mantenendo la pubblicazione compatibile con Vercel.
