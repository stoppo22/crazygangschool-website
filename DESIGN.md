# Crazy Gang School — direzione editoriale

Revisione approvata: **Atlante del movimento**, limitata alla composizione di hero e discipline. L'utente ha inoltre richiesto di eliminare i titoli slogan dall'intera homepage. Questo nome identifica solo la direzione di lavoro e non compare nel sito.

Fonte fattuale: `CONTEXT.md`. Provenienza e limiti dei media: `ASSETS.md`.

## Concept e principi visivi

Una composizione editoriale aperta, con fotografie di proporzioni differenti, allineamenti sfalsati e alternanza fra aree dense e vuote. Il carattere viene dalla relazione fra tipografia, fotografia e movimento, non da frasi promozionali o riquadri colorati. Mantenere una lettura chiara e controlli riconoscibili.

La skill gpt-taste resta subordinata alle preferenze approvate: niente randomizzazione delle scelte, bento obbligatori, marquee, gradienti o nuovi effetti aggiunti per soddisfare un catalogo.

## Titoli e contenuti

H1: **Crazy Gang School**. Titoli di sezione: **La scuola, Discipline, Spettacoli, Insegnanti, Animazione, Contatti**. Nelle discipline usare esclusivamente i nomi documentati: Danza Classica, Danza Moderna, Hip Hop, Tap, Break Dance, Salsa Cubana, Danze Standard, Danze Latino Americane, Kung Fu e Propedeutica. Kuai rimane nelle altre attività con richiesta di informazioni.

Eliminare raggruppamenti inventati come Danza / Ritmo / Incontro e frasi come “Un corpo, tanti linguaggi”, “Insieme, in scena”, “Il gesto si impara” e “Facciamo il primo passo”. Testi brevi e descrittivi; nessuna nuova promessa su offerta o operatività.

## Logo

Logo originale integro, senza ridisegni, ritagli, filtri o animazioni delle sue parti. Header e footer mantengono versioni responsive; la hero usa il nome della scuola come normale titolo, senza un secondo logo decorativo. Il marchio guida anche il colore del sistema.

Master PNG: 2307 × 1157 px, adeguato al prototipo. Confermare versione definitiva e diritti; preferire un master vettoriale approvato prima del lancio. Favicon: riduzione del logo completo.

## Palette

| Token | Colore | Uso |
| --- | --- | --- |
| paper | #F2F0E9 | Base dominante di header, hero e sezioni editoriali |
| ink | #181917 | Testi e footer |
| indigo | #292F68 | Titolo secondario della hero e sezione scenica esistente |
| plum | #713A70 | Link, focus e piccoli accenti editoriali su carta |
| amber | #D78B52 | Azioni e focus su superfici scure |
| line | #CCCAC2 | Separazioni funzionali discrete |

Indaco, prugna e ambra sono interpretazioni del blu, viola e arancione del logo, non codici ufficiali. Il logo mantiene tutti i suoi colori originali. Nessun obbligo di utilizzare ciano, verde e giallo nella UI; nessuna sezione per colore. Dominano le superfici neutre.

Abbinamenti: ink/paper, paper/indigo, plum/paper, ink/amber, amber/indigo e amber/ink, tutti verificati sopra 4.5:1. Il focus dell'header chiaro usa plum; il menu scuro usa amber.

## Tipografia

Cabinet Grotesk locale. Titolo della hero su due righe, nome della scuola a peso 700 e “School” a peso 400, sfalsato. Titoli descrittivi senza corsivi ricorrenti, slogan o pareti di testo. Nomi dei corsi con variazioni controllate di scala e peso; tutti immediatamente leggibili e disponibili.

## Fotografia

Hero e discipline usano **fotografie segnaposto esplicitamente dichiarate**, ricavate dai due asset temporanei già presenti. Non rappresentano la scuola, le sue lezioni o i suoi allievi. Nessuna attribuzione di una fotografia a un corso reale. Alternative testuali vuote per questi elementi decorativi e didascalia visibile “Fotografia segnaposto”.

Hero: una fotografia principale verticale e un dettaglio orizzontale che le si sovrappone parzialmente. Discipline: due inserti di proporzioni diverse tra i nomi. Ruoli, varianti responsive, dimensioni e punti focali sono centralizzati in `src/content.js` per sostituire ogni immagine indipendentemente.

La sezione Spettacoli conserva le due immagini originali d'archivio già documentate, con didascalie descrittive e diritti da confermare. Non coprire la scritta incorporata nella fotografia etichettata Sister Act.

## Layout

Hero su carta, titolo a sinistra, immagine principale a destra e dettaglio più basso che supera il limite della sezione. CTA leggibile prima dello scroll su desktop e mobile. Le immagini si sovrappongono fra loro; non coprono parole o controlli. La sezione seguente riserva spazio sufficiente al dettaglio fotografico.

Discipline: una sola lista aperta. La griglia di dodici colonne serve a sfalsare nomi e fotografie; non crea pannelli, card o categorie. Tutti i nomi portano a una richiesta email con oggetto specifico, senza invii automatici. Le fotografie intercalate non sono elementi del catalogo e non alterano l'ordine dei link da tastiera.

Struttura del resto della homepage conservata; aggiornati i titoli e rimossi gli intermezzi slogan.

## Motion

Righe del titolo in sequenza sotto un secondo. Apertura parziale della foto principale: 850 ms desktop / 600 ms mobile; ingresso del dettaglio da una direzione diversa, 800 / 550 ms. Il dettaglio accompagna l'uscita della hero con un movimento verticale massimo di 24 px, solo desktop.

Reveal delle immagini a maschera rettangolare, una volta; entrate verticali contenute dei nomi delle discipline. Testo sempre opaco. Hover e focus: lieve traslazione, sottolineatura e accento prugna.

Conservare il pin limitato alla galleria Spettacoli da 1000 px e il parallax fotografico massimo di 24 px. Nessun movimento continuo, audio, autoplay o scroll hijacking. Scope e cleanup tramite useGSAP e gsap.matchMedia; refresh dopo cambiamenti di layout.

## Mobile e accessibilità

Hero in flusso naturale con CTA prima delle fotografie. Il dettaglio si sovrappone alla fotografia principale senza oscurarne la didascalia. Discipline disposte in una sequenza verticale con piccoli sfalsamenti e inserti fotografici; niente pannelli o interazione obbligatoria per leggere i nomi.

Target di almeno 44 px, focus visibile, menu con Escape e gestione della tastiera. Con prefers-reduced-motion: contenuti subito visibili, nessun pin, parallax, maschera o animazione. Nessun contenuto nascosto dalla CSS in attesa di JavaScript.

## Anti-pattern e verifica

Niente slogan generati, tassonomie inventate, arcobaleni, glow, glassmorphism, gradienti, card SaaS, cursori personalizzati o movimenti gratuiti. Mantenere noindex, font e immagini locali e tutti i limiti editoriali di CONTEXT.md.

Build e browser test a 320, 390, 768, 1024 e 1440 px. Verificare nomi dei corsi, link email, tastiera, menu, controlli espansi, immagini segnaposto, titoli, overflow, console, contrasto e cambio dinamico della preferenza di movimento. Ispezionare screenshot viewport e pagina completa, conservati in artifacts/.

