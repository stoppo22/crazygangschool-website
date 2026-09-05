# Crazy Gang School — identità e scena

Direzione approvata il 6 settembre 2026. Evoluzione della homepage esistente, non ripartenza. Fonte fattuale: `CONTEXT.md`; inventario e limiti dei media: `ASSETS.md`.

## Concept creativo

**Una scuola, molti corpi, una scena.** Il carattere Crazy Gang emerge dal logo originale, dalle fotografie corali e dal dialogo fra danza e teatro. La composizione ricorda quinte e manifesti di spettacolo senza simulare un sipario o un palcoscenico interattivo.

## Principi visivi

Fotografia protagonista, testo ampio, bordi netti, asimmetria intenzionale e pause neutre. Energia attraverso scala e ritmo, non attraverso un arcobaleno di sezioni. Preservare navigazione, ordine dei contenuti e controlli espandibili della v1. La guida gpt-taste è subordinata a queste scelte approvate: niente randomizzazione del brand, gradienti, marquee o paradigmi aggiunti solo per soddisfare un elenco di effetti.

## Logo

Usare integralmente il PNG originale documentato in CONTEXT.md (2307 × 1157 px), senza ridisegni, filtri, ritagli o animazioni delle sue parti. Versioni ridimensionate mantengono trasparenza e proporzioni. Header compatto, presenza ampia all'apertura e nel footer: il marchio diventa parte della composizione, non solo un'etichetta. Favicon: riduzione del logo completo. Il PNG è adeguato al prototipo; richiedere il master vettoriale e conferma della versione definitiva prima del lancio.

## Palette

| Token | Colore | Ruolo |
| --- | --- | --- |
| paper | #F2F0E9 | Fondo principale e testo su superfici scure |
| ink | #181917 | Testo, header, hero e footer |
| indigo | #292F68 | Variante profonda del blu del logo; spazio scenico e dettagli strutturali |
| plum | #713A70 | Variante polverosa del viola del logo; piccoli accenti editoriali su carta |
| amber | #D78B52 | Variante ambrata dell'arancione originale; azioni principali con testo ink |
| line | #CCCAC2 | Separazioni sulle superfici neutre |

Questi sono adattamenti editoriali dei colori del logo, non dichiarazioni di codici ufficiali. Il logo conserva tutti i colori originali. Ciano, verde e giallo non diventano colori UI obbligatori. Nessuna sezione riceve un colore per rappresentare una categoria. Predominio di nero e carta, un campo indaco per il palcoscenico e accenti contenuti. Non desaturare le fotografie per uniformarle alla palette. Usare paper su indigo e plum, ink su paper e amber; verificare contrasto minimo 4.5:1 per il testo normale e 3:1 per controlli e testo grande. Il colore non è l'unico indicatore degli stati.

## Tipografia

Cabinet Grotesk locale, pesi esistenti. Eliminare l'uso ricorrente di Georgia corsivo. Contrasto tra titoli compatti e testi di lettura ariosi. H1 largo, massimo tre righe anche a 320 px; nessuna parola tagliata o titolo trasformato in una colonna stretta. Sottolineature e cambi di peso guidano la lettura senza imitare la scrittura del logo.

## Fotografia

Usare i due originali documentati e ispezionati: ensemble dalla galleria moderna per hero e racconto del movimento; Sister Act nella galleria scenica. Conservare l'inquadratura corale e i colori delle luci. Sister Act contiene una scritta incorporata: non coprirla e non sovrapporre altri titoli. Non identificare le fotografie come lezioni di una disciplina né attribuire persone, anni o crediti non confermati. Didascalie discrete indicano l'archivio del sito originale; autorizzazioni e attribuzioni restano da verificare.

Immagini locali responsive, dimensioni intrinseche riservate, hero caricata prioritariamente e altre immagini lazy. Metadati, varianti, ritagli e alt centralizzati, indipendenti dalla UI. Eventuali segnaposto residui rimangono esplicitamente identificati.

## Layout e griglia

Mantenere hero asimmetrica, testo scuola, discipline espandibili, palcoscenico, docenti, intrattenimento, contatti e footer. Hero con titolo su superficie neutra, foto larga sfalsata e logo in una posizione ampia dedicata. Griglia discipline senza vuoti: tre pannelli adiacenti su desktop, accordion verticale su mobile. Separare i testi dei corsi dalle fotografie d'archivio per non suggerire associazioni non verificate. Galleria scenica a immagini orizzontali sfalsate; titolo pin solo su desktop. Spazi responsive generosi, senza altezze vuote imposte ai telefoni.

## Motion language

Reveal fotografici a maschera rettangolare, una volta, 650–900 ms. Titoli: entrata per riga con traslazione contenuta e stagger di 90 ms, sequenza sotto un secondo. Testo scuola sempre opaco e leggibile. Intermezzo tipografico statico al posto del marquee. Pin limitato alla galleria scenica da 1000 px; parallax delle immagini entro 24 px, solo quando l'utente non richiede movimento ridotto. Nessun movimento continuo o scroll hijacking. Microinterazioni di 150–250 ms, feedback anche al focus. Separare wrapper delle maschere, parallax e hover. Scope e cleanup attraverso useGSAP e gsap.matchMedia; refresh dopo variazioni reali di layout e caricamento dei font.

## Mobile e accessibilità

Flusso verticale, foto corali larghe senza zoom aggressivo, logo leggibile e titoli fino a tre righe. Nessun pin o parallax; reveal più brevi. Target di almeno 44 px, menu con Escape e focus gestito, ancore funzionanti. Con prefers-reduced-motion tutti i contenuti sono immediatamente visibili e senza animazioni. Nessun contenuto essenziale nascosto dalla CSS in attesa di JavaScript. Focus visibile e contrastato su ogni fondo.

## Anti-pattern

Niente sezioni una per colore, arcobaleni, combinazioni giocattolose, glow, gradienti, glassmorphism, pillole decorative, card SaaS, cursori personalizzati, marquee, effetti sonori, autoplay o foto stock presentate come scuola. Non animare ogni elemento. Niente promesse di disponibilità, statistiche o biografie inventate. Mantenere noindex e sviluppo locale.

## Verifica

Build e browser test a 320, 390, 768, 1024 e 1440 px. Ispezionare hero, menu, accordion e docenti espansi, galleria, contatti e footer. Verificare overflow, immagini, tastiera, errori console, contrasto, movimento normale/ridotto e cambio della preferenza durante la sessione. Screenshot e report in artifacts/. Correggere autonomamente composizioni o accenti che risultino infantili, confusi o poco leggibili.
