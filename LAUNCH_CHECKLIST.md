1# Launch checklist — Crazy Gang School

Documento operativo dei punti aperti prima del rilascio pubblico, integrato con il censimento completo di frasi filler, testi provvisori e informazioni mancanti per trasformare il sito in una vetrina realistica, completa ed efficace per una scuola di danza in attività a Roma.

---

## 1. FRASI FILLER, TESTI PROVVISORI E RESIDUI DA PULIRE NEL CODICE E NELLA UI

Testi individuati nel codice sorgente che risultano generici, provvisori o residui tecnici visibili all'utente:

- [ ] **"Orari in aggiornamento."** (`src/main.jsx`, riga 176)
  - *Problema:* Compare in homepage sotto l'intestazione *"I nostri corsi"*. In realtà gli orari sono stati confermati dall'owner l'8 settembre 2026 e sono già presenti nelle schede corso. Dire "Orari in aggiornamento" disorienta l'utente facendo credere che le informazioni non siano attendibili o incomplete.
  - *Azione:* Sostituire con una dicitura chiara ed utile (es. *"Consulta orari settimanali e fasce d'età di ciascuna disciplina."*) o rimuovere del tutto il paragrafo provvisorio.

- [ ] **"Fotografia dal sito ufficiale Crazy Gang School"** (`src/FacultySection.jsx`, riga 7)
  - *Problema:* Compare come didascalia visibile (`<figcaption>`) in alto a destra su ogni foto nella sezione Insegnanti. È un residuo dello scraping del vecchio sito web: su un sito ufficiale dà l'impressione di materiale preso dall'esterno o di un cantiere non finito.
  - *Azione:* Rimuovere il `<figcaption>` o sostituirlo con informazioni didattiche (es. nome/ruolo del docente).

- [ ] **"Scegli un insegnante"** (`src/FacultySection.jsx`, riga 32)
  - *Problema:* Nella versione desktop, prima che l'utente interagisca con la lista dei docenti, il pannello di anteprima mostra un riquadro vuoto nero con il testo *"Scegli un insegnante"*.
  - *Azione:* Mostrare per default la scheda della Direzione Artistica (Marco e Stefano Stopponi) o una breve introduzione al team docenti.

- [ ] **"La tua scuola di danza a Roma!"** (`src/main.jsx`, riga 168)
  - *Problema:* Sottotitolo hero dal sapore di slogan generico che stona con il tono sobrio, disciplinato ed editoriale dei testi successivi (*"Impegno totale, disciplina, rispetto..."*).
  - *Azione:* Sostituire con un sottotitolo radicato nell'identità specifica della scuola (es. *"Danza classica, moderna, hip hop e arti marziali a Roma Colli Albani"* oppure *"Formazione artistica, disciplina e palcoscenico dal 1985"*).

- [ ] **"Ospiti della struttura"** (`src/GuestsSection.jsx`, riga 12)
  - *Problema:* Compare come fascia con due link spogli ad *AID Musical* e *Musical Passion* senza alcuna spiegazione. Per l'utente comune è incomprensibile: sono corsi della scuola? Accademie partner ospitate? Masterclass? Affitto sale?
  - *Azione:* Aggiungere una riga esplicativa (es. *"La scuola ospita nelle proprie sale i corsi e le masterclass delle accademie partner..."*) o chiarire la loro presenza.

- [ ] **Placeholder legali tra parentesi quadre** (`src/LegalPage.jsx`, righe 49, 78, 96, 159)
  - *Problema:* Sono presenti campi vuoti non compilati: `[Denominazione dell’associazione / società...]`, `[indirizzo della sede]`, `codice fiscale / P. IVA [•]`, `[periodo da definire]`, `[data]`.
  - *Azione:* Inserire i dati reali del Titolare (P.IVA / CF, denominazione legale, tempi di conservazione).

- [ ] **Didascalie della galleria derivate dai vecchi nomi file** (`src/gallery-data.js`)
  - *Problema:* Titoli generici come *"Ensemble"*, *"Danza moderna"*, *"Baby Crazy Gang"* ripetuti senza contesto, anni o teatro di esibizione.
  - *Azione:* Arricchire le didascalie con l'anno o il teatro dello spettacolo (es. *Teatro Olimpico*, *Teatro Brancaccio*, *Crazy Party*).

---

## 2. COSE CHE MANCANO PER RENDERE IL SITO UNA SCUOLA DI DANZA REALE

Per trasformare il sito da "vetrina grafica" a "reale strumento di iscrizione e informazione" per genitori e allievi, mancano gli elementi cardine della vita quotidiana di una scuola di danza:

### A. Il Funnel Allievo: Lezione di Prova e Iscrizioni
- [ ] **Lezione di prova gratuita ("Prenota una lezione di prova")**:
  - *Stato attuale:* La parola **"prova" non compare mai** in tutto il sito!
  - *Cosa serve:* Nelle scuole di danza la quasi totalità delle iscrizioni passa da una prova pratica in sala. Serve:
    - Indicare chiaramente come funziona la prova (è gratuita? è su prenotazione?).
    - Call to action visibile in hero, nelle schede corso e nei contatti (*"Prenota una lezione di prova"*).
    - Link WhatsApp con messaggio precompilato dedicato (es. *"Vorrei prenotare una prova per il corso di..."*).
- [ ] **Procedura di iscrizione**:
  - Spiegare i passi per iscriversi: visita in sede, prova pratica, compilazione del modulo di iscrizione e consegna documenti.
- [ ] **Certificato medico e requisiti sanitari**:
  - Obbligo di legge per la pratica sportiva e la danza in Italia: **Certificato medico per attività sportiva non agonistica** (con tracciato ECG valido).
  - Indicare che è obbligatorio per l'ammissione definitiva ai corsi.
- [ ] **Anno Accademico e disponibilità iscrizioni**:
  - Indicare l'anno accademico di riferimento (es. *Anno Accademico 2026/2027*).
  - Chiarire se le iscrizioni sono aperte tutto l'anno (inserimenti consentiti previa lezione di prova e valutazione di livello).

### B. Didattica, Corsi e Collegamento Docenti
- [ ] **Associazione Docente ↔ Corso (Attualmente scollegati!)**:
  - Nelle pagine corso (`/corsi/*`) **non compare chi sia l'insegnante**!
  - Nella sezione Insegnanti ci sono 12 maestri ma non è specificato quali corsi o fasce d'età seguano.
  - Per **Tip Tap** e **K-Pop** non è censito alcun insegnante nel corpo docente.
  - È fondamentale mostrare il nome e il volto del maestro in ogni singola scheda corso.
- [ ] **Dettaglio dei programmi e cosa si fa a lezione**:
  - In `src/course-data.js` sono presenti array `programs`, `ages`, `levels` che **non vengono mai renderizzati** a schermo in `CoursePage.jsx`!
  - Serve una breve descrizione del metodo e della lezione tipica (es. riscaldamento, tecnica alla sbarra, diagonali, centro, studio coreografico per classica e moderna; forme, potenziamento e autodifesa per Kung Fu).
- [ ] **Cosa portare a lezione (Abbigliamento / Dress code / Scarpe)**:
  - *Classica:* body, calze, mezze punte, capelli raccolti a chignon.
  - *Moderna:* abbigliamento comodo/aderente, calzini da danza o mezze punte.
  - *Hip Hop:* abbigliamento streetwear comodo, **scarpe da ginnastica pulite con suola da usare esclusivamente in sala**.
  - *Tip Tap:* scarpe da tap con ferretti.
  - *Kung Fu:* pantaloni comodi / divisa tradizionale, scarpette da arti marziali.
  - Regola igienica fondamentale: divieto di entrare nelle sale danza con le calzature usate all'esterno.
- [ ] **Spiegazione dei gruppi avanzati e nomenclature**:
  - Nei corsi moderni compaiono sigle come *Special A*, *Special B*, *Special D Red/Blue*: spiegare a genitori e allievi se sono gruppi accademici, agonistici o su audizione interna.

### C. La Struttura Fisica: Spazi e Sale
- [ ] **Descrizione delle sale della scuola**:
  - Quante sale ha la sede di Largo Orazi e Curiazi 12?
  - Caratteristiche tecniche per la sicurezza dei ballerini: **pavimentazione ammortizzata in parquet / tappeto danza** (per salvaguardare tendini e articolazioni), specchi a parete intera, sbarre fisse e mobili, impianti audio professionali.
- [ ] **Servizi per allievi e famiglie**:
  - Spogliatoi maschili e femminili con docce, reception / segreteria, sala d'attesa per genitori.

### D. Segreteria, Logistica e Accesso
- [ ] **Orari di apertura della segreteria al pubblico**:
  - Attualmente ci sono solo i recapiti telefonici e l'email. Manca l'informazione cruciale: **quando è aperta fisicamente la segreteria** per accogliere chi vuole visitare la scuola o iscriversi di persona (es. *Lun-Ven 16:00 – 20:30*).
- [ ] **Fasce orarie per l'assistenza telefonica**:
  - Quando risponde la segreteria al telefono fisso `06 7883621`.

### E. Spettacoli, Saggio di Fine Anno e Palcoscenico
- [ ] **Il Saggio di Fine Anno a Teatro**:
  - Il punto di forza storico della Crazy Gang School sono le produzioni teatrali e i saggi su veri palcoscenici romani (Teatro Olimpico, Brancaccio, ecc.).
  - Manca spiegare il percorso dell'allievo che culmina nello spettacolo di fine anno: costumi, scenografie, lavoro di gruppo ed esperienza scenica dal vivo.

### F. Trasparenza Economica e Quote
- [ ] **Formule di frequenza e trasparenza quote**:
  - Spiegare chiaramente le opzioni (senza inventare cifre):
    - Quota di iscrizione annuale comprensiva di assicurazione/tesseramento.
    - Frequenza monosettimanale o bisettimanale.
    - Agevolazioni per frequenza di più corsi o sconti per fratelli/famiglie.
    - Indicazione: *"Contatta la segreteria per il prospetto quote e le formule attive"*.

### G. Dati Fiscali e Societari Obbligatori (Footer)
- [ ] **Esposizione obbligatoria dei dati societari/fiscali**:
  - Ai sensi dell'art. 35 D.P.R. 633/1972 e normative per ASD/SSD, ogni sito web deve indicare nel footer:
    - Denominazione sociale esatta (es. *A.S.D. Crazy Gang School* o ditta individuale).
    - **Codice Fiscale e/o Partita IVA**.
    - Numero di iscrizione al Registro Nazionale delle Attività Sportive Dilettantistiche (se ASD affiliata CONI).

### H. Sezione FAQ (Domande Frequenti)
- [ ] **Domande tipiche di genitori e allievi**:
  - *Non ho mai ballato, posso iniziare da adulto?* (Sì, corsi Over principianti).
  - *Mio figlio ha 3 o 4 anni, cosa fa?* (Gioco Danza propedeutico per sviluppo psicomotorio).
  - *Cosa serve per la prima prova?* (Basta un abbigliamento comodo e calzini/scarpe pulite).
  - *Come si recuperano le lezioni perse per malattia?*
  - *È possibile iscriversi a corso iniziato durante l'anno?*

---

## 3. MATERIALI DA FORNIRE DALL'OWNER (TO PROVIDE)

- [ ] **Foto originali della scuola e delle lezioni**:
  - Foto reale per l'Hero (sostituire `public/images/placeholder-stage-*`).
  - 7 fotografie reali per i corsi (sostituire le foto stock Pexels/Unsplash in `public/images/courses/*`).
  - Fotografie delle sale e degli ambienti (da inserire nella sezione sede o in una sezione struttura).
  - Una volta sostituite, rimuovere `placeholder: true` e gli attributi `data-placeholder` dal codice.
- [ ] **Liberatorie e consensi fotografici (Galleria)**:
  - Le foto della galleria archivio ritraggono allievi, molti dei quali minorenni nei saggi passati. Verificare il possesso delle liberatorie firmate dai genitori/allievi prima della pubblicazione pubblica, o selezionare scatti con volti non identificabili.
- [ ] **Dati del Titolare del Trattamento (Privacy)**:
  - Ragione sociale, P.IVA / Codice Fiscale, indirizzo legale.
- [ ] **Orari di apertura segreteria**:
  - Giorni e orari in cui il banco accoglienza è operativo.
- [ ] **Assegnazione docenti ↔ corsi e orari**:
  - Chi insegna Tip Tap e K-Pop?
  - Chi segue i diversi gruppi di Danza Moderna (Mini, Topini, Koala, Panda, Junior, Teenagers, Special, Intermedi, Over)?
  - Cognomi completi di Massimo e Tiziana (Latino/Standard).
- [ ] **Conferma nome "Avviamento"**:
  - Confermare se il gruppo di Danza Classica 8–10 anni si chiami definitivamente "Avviamento" (nel vecchio foglio era segnato con "AVVIAMENTO??").
- [ ] **Eventuale logo vettoriale**:
  - Verificare disponibilità di un file vettoriale SVG del logo ufficiale o confermare il master PNG attuale.

---

## 4. ADEMPIMENTI TECNICI PRE-LANCIO (TECHNICAL)

- [ ] **Dominio definitivo di produzione**:
  - Impostare la variabile `SITE_URL` nel pannello Cloudflare (default: `https://www.crazygangschool.com`).
  - Configurare il redirect 301 dal secondo dominio (es. `.it` verso `.com` o viceversa) per evitare penalizzazioni SEO da contenuti duplicati.
- [ ] **Verifica cookie live su Cloudflare**:
  - Al deploy su dominio definitivo, controllare con devtools che Cloudflare non imposti cookie non tecnici.
- [ ] **Token Web Analytics**:
  - Verificare il token cookieless di Cloudflare Web Analytics in `seo.config.js` (`CF_ANALYTICS_TOKEN`).
- [ ] **Sblocco indicizzazione (Go-Live finale)**:
  - Il sito è attualmente blindato con `noindex, nofollow` e `robots.txt Disallow: /`.
  - Solo a contenuti approvati e completati, impostare su Cloudflare la variabile d'ambiente:
    ```
    SITE_LAUNCHED=true
    ```
  - Questo passaggio trasformerà i meta robot in `index, follow` e aprirà `robots.txt` e `sitemap.xml` ai motori di ricerca.
- [ ] **Google Search Console**:
  - Inviare la sitemap (`https://<dominio>/sitemap.xml`) subito dopo lo sblocco indicizzazione.
- [ ] ~~**Licenza Font**~~:
  - Risolto: il sito utilizza Montserrat distribuito sotto licenza libera SIL Open Font License (OFL). Non ci sono vincoli commerciali residui da Fontshare/Cabinet Grotesk.

---

## 5. ELEMENTI GIÀ VERIFICATI E SICURI PER LA PUBBLICAZIONE

- Sede confermata: **Largo Orazi e Curiazi, 12, 00181 Roma** (fermata Metro A Colli Albani).
- Coordinate geografiche e scheda verificata su Google Maps.
- Canali di contatto verificati: Telefono `06 7883621`, Email `info@crazygang.it`, WhatsApp Business attivo sul fisso `06 7883621`, profili social ufficiali Instagram e Facebook.
- Valutazione media Google (4,8) e 5 recensioni pubbliche trascritte fedelmente dalla scheda ufficiale.
- Orari e giorni dei 7 corsi confermati dall'owner l'8 settembre 2026.
- Assenza di cookie di profilazione o traccianti invasivi di terze parti a caricamento automatico.

