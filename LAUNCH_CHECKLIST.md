# Launch checklist — Crazy Gang School

Solo i punti legali e quelli strettamente necessari per pubblicare il sito. Contenuti, copy e arricchimenti non bloccanti sono stati rimossi da qui: si gestiscono dopo il lancio.

---

## 1. Dati legali e fiscali obbligatori

- [x] **Titolare del trattamento** (`src/LegalPage.jsx`): ASD Sport Dance, Largo Orazi e Curiazi 12, 00181 Roma RM, P.IVA 13323281009.
- [ ] **Tempi di conservazione dati** (`src/LegalPage.jsx`, sezione "Conservazione"): da definire o confermare un criterio standard (es. 10 anni per obblighi fiscali/contrattuali, 2 anni per richieste senza seguito).
- [x] **Data "Ultimo aggiornamento"** sulle pagine Privacy e Cookie: impostata al 1 ottobre 2026.
- [x] **Esposizione dati fiscali nel footer del sito** (art. 35 D.P.R. 633/1972): aggiunta denominazione e P.IVA nel footer homepage (`src/main.jsx`). Manca solo l'eventuale numero di iscrizione al Registro Nazionale delle Attività Sportive Dilettantistiche, se ASD affiliata CONI.

## 2. Switch tecnico di lancio

- [ ] **Dominio definitivo di produzione**: impostare `SITE_URL` su Cloudflare (default: `https://www.crazygangschool.com`) e configurare il redirect 301 dal dominio secondario, se esiste, per evitare contenuti duplicati.
- [ ] **Verifica cookie live su Cloudflare**: al deploy sul dominio definitivo, controllare con devtools che non vengano impostati cookie non tecnici.
- [ ] **Token Web Analytics**: verificare il token cookieless di Cloudflare Web Analytics in `seo.config.js` (`CF_ANALYTICS_TOKEN`).
- [ ] **Sblocco indicizzazione (go-live finale)**: il sito è blindato con `noindex, nofollow` e `robots.txt Disallow: /`. Solo a contenuti legali completati, impostare su Cloudflare:
  ```
  SITE_LAUNCHED=true
  ```
  Questo trasforma i meta robots in `index, follow` e apre `robots.txt`/`sitemap.xml` ai motori di ricerca.
- [ ] **Google Search Console**: inviare la sitemap (`https://<dominio>/sitemap.xml`) subito dopo lo sblocco indicizzazione.

---

## 3. Elementi già verificati e sicuri per la pubblicazione

- Sede confermata: **Largo Orazi e Curiazi, 12, 00181 Roma** (fermata Metro A Colli Albani).
- Coordinate geografiche e scheda verificata su Google Maps.
- Canali di contatto verificati: Telefono `06 7883621`, Email `info@crazygang.it`, WhatsApp Business attivo sul fisso `06 7883621`, profili social ufficiali Instagram e Facebook.
- Valutazione media Google (4,8) e 5 recensioni pubbliche trascritte fedelmente dalla scheda ufficiale.
- Orari e giorni dei corsi confermati dall'owner.
- Foto dei corsi e foto hero sostituite con fotografie reali della scuola (nessun placeholder stock residuo).
- Assenza di cookie di profilazione o traccianti invasivi di terze parti a caricamento automatico.
- Licenza font risolta: Montserrat, SIL Open Font License (OFL), nessun vincolo commerciale residuo.
