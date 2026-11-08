# Launch checklist — Crazy Gang School

Solo i punti legali e quelli strettamente necessari per pubblicare il sito. Contenuti, copy e arricchimenti non bloccanti sono stati rimossi da qui: si gestiscono dopo il lancio.

---

## 1. Dati legali e fiscali obbligatori

- [x] **Titolare del trattamento** (`src/LegalPage.jsx`): ASD Sport Dance, Largo Orazi e Curiazi 12, 00181 Roma RM, P.IVA 13323281009.
- [x] **Tempi di conservazione dati** (`src/LegalPage.jsx`, sezione "Conservazione"): 12 mesi per log/statistiche aggregate, 24 mesi per richieste senza seguito, durata rapporto + 10 anni per chi si iscrive (art. 2220 Codice Civile).
- [x] **Data "Ultimo aggiornamento"** sulle pagine Privacy e Cookie: impostata al 1 ottobre 2026.
- [x] **Esposizione dati fiscali nel footer del sito** (art. 35 D.P.R. 633/1972): aggiunta denominazione e P.IVA nel footer homepage (`src/main.jsx`). Manca solo l'eventuale numero di iscrizione al Registro Nazionale delle Attività Sportive Dilettantistiche, se ASD affiliata CONI.

## 2. Switch tecnico di lancio

- [x] **Dominio definitivo**: `https://www.crazygangschool.com` (custom domain del worker `crazygangschool-website`, DNS su Cloudflare, nameserver cambiati da Wix). `crazygangschool.com` → 301 → `www` tramite Redirect Rule; `http` → `https` con "Always Use HTTPS".
- [x] **Verifica cookie live su Cloudflare**: nessun cookie né prima né dopo l'attivazione della mappa (8 novembre 2026).
- [x] **Header di sicurezza**: `public/_headers` (CSP, X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy, HSTS) attivi in produzione, nessun errore CSP in console.
- [x] **Token Web Analytics**: beacon attivo in produzione (`CF_ANALYTICS_TOKEN` in `seo.config.js`). Da controllare solo che i dati arrivino nella dashboard Cloudflare Web Analytics.
- [x] **Sblocco indicizzazione (go-live)**: `SITE_LAUNCHED=true` impostato su Cloudflare; meta robots `index, follow`, `robots.txt` aperto, `sitemap.xml` con 11 URL `www`.
- [x] **Google Search Console**: proprietà Dominio verificata (record TXT in Cloudflare DNS — non cancellarlo) e sitemap inviata.
- [x] **Sitemap in Search Console**: stato "Riuscita" (8 novembre 2026). Il primo "Impossibile recuperare" era dovuto alla cache del vecchio `robots.txt`.
- [ ] **Pagine del vecchio sito Wix**: controllare in Search Console eventuali URL vecchi indicizzati (es. `/insegnanti`, `/baby-gang`) che ora danno 404 e aggiungere redirect verso le pagine nuove.
- [ ] **Dominio registrato su Wix**: non disdire il piano Wix finché il dominio non è trasferito altrove.

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
