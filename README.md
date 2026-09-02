# S.E.C. — Level -25

Prima vertical slice gratuita del gioco sparatutto horror fantascientifico in terza persona.

## Contenuto della demo

- corridoio 3D del livello −1 della struttura S.E.C.;
- protagonista controllabile in terza persona;
- mira con il mouse, movimento WASD, sparo e ricarica;
- quattro anomalie biologiche;
- HUD, salute, munizioni, obiettivo e breve rivelazione narrativa;
- nessun database, account o servizio a pagamento.

## Avvio locale

Serve un piccolo server statico, perché il gioco usa moduli JavaScript:

```bash
npx serve .
```

Aprire quindi l'indirizzo mostrato nel terminale.

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
