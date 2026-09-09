import { useEffect } from 'react';
import { contact } from './content';
import { applyHead } from './head';
import { SITE_DESCRIPTION, OG_IMAGE, absoluteUrl } from './site';

function Arrow({ back = false }) {
  return <svg className={back ? 'is-back' : ''} viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 19 19 5M7 5h12v12" stroke="currentColor" strokeWidth="1.7" /></svg>;
}

function PageChrome({ children, className = '' }) {
  return <div className={`course-page legal-page ${className}`}>
    <header className="course-nav">
      <a href="/" className="course-brand" aria-label="Crazy Gang School, home"><img src="/brand/crazy-gang-640.webp" width="2307" height="1157" alt="Crazy Gang School" /></a>
      <a href="/" className="course-nav__back"><Arrow back /> Home</a>
      <a href={`mailto:${contact.email}`}>Contatta la scuola <Arrow /></a>
    </header>
    {children}
    <footer className="course-footer">
      <a href="/"><Arrow back /> Torna alla home</a>
      <span>Crazy Gang School · Roma, Colli Albani</span>
      <span><a href="/privacy">Privacy</a> · <a href="/cookie">Cookie</a></span>
    </footer>
  </div>;
}

// TODO(launch): completare i campi tra parentesi quadre (soggetto titolare,
// C.F./P. IVA, tempi di conservazione, date) e far verificare il testo da un
// consulente prima della pubblicazione. Dettaglio dei trattamenti in
// PRIVACY-NOTES.md e in LAUNCH_CHECKLIST.md.

export function PrivacyPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    applyHead({
      title: 'Privacy Policy — Crazy Gang School',
      description: 'Come Crazy Gang School tratta i dati personali di chi visita il sito.',
      canonical: absoluteUrl('/privacy'),
      ogImage: absoluteUrl(OG_IMAGE),
    });
  }, []);

  return <PageChrome>
    <main className="legal-main">
      <h1>Privacy Policy</h1>
      <p className="legal-lead">Questa informativa descrive come vengono trattati i dati personali di chi visita il sito di Crazy Gang School, ai sensi dell’articolo 13 del Regolamento (UE) 2016/679 (GDPR).</p>

      <section>
        <h2>Titolare del trattamento</h2>
        <p>[Denominazione dell’associazione / società o nome e cognome della persona fisica], [indirizzo della sede], codice fiscale / P. IVA [•]. Recapiti: <a href={`mailto:${contact.email}`}>{contact.email}</a> — <a href={`tel:${contact.phone}`}>06 7883621</a>.</p>
      </section>

      <section>
        <h2>Dati trattati e finalità</h2>
        <ul>
          <li><strong>Dati di navigazione</strong> (indirizzo IP, user agent, data e ora, pagina richiesta e altri dati tecnici della richiesta), raccolti automaticamente dall’infrastruttura che eroga il sito. Servono a rendere disponibile il sito e a garantirne sicurezza e stabilità e, tramite uno strumento di statistica aggregata e senza cookie, a misurare gli accessi (vedi <a href="/cookie">Cookie Policy</a>). Base giuridica: legittimo interesse del titolare (art. 6, par. 1, lett. f).</li>
          <li><strong>Dati che l’utente fornisce volontariamente</strong> scrivendo un’email o telefonando alla scuola (nome, recapito e contenuto del messaggio). Servono a rispondere alla richiesta e a eventuali passi precontrattuali. Base giuridica: riscontro alla richiesta dell’interessato ed esecuzione di misure precontrattuali (art. 6, par. 1, lett. b) o legittimo interesse (lett. f). Il sito non contiene moduli: la comunicazione avviene tramite l’applicazione di posta o di telefono del dispositivo dell’utente.</li>
          <li><strong>Mappa di Google Maps</strong>, presente nella sezione «Dove siamo». Il contenuto della mappa viene caricato <strong>solo dopo un click esplicito</strong> sul pulsante «Attiva la mappa»; fino a quel momento non viene inviato alcun dato a Google. Il click vale come consenso (art. 6, par. 1, lett. a). Dopo l’attivazione, Google può trattare dati (tra cui l’indirizzo IP) e utilizzare cookie secondo le proprie <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">policy</a>, in qualità di titolare autonomo.</li>
        </ul>
      </section>

      <section>
        <h2>Immagini della galleria</h2>
        <p>Le fotografie di saggi e spettacoli pubblicate nella galleria possono ritrarre persone identificabili, anche minori, e hanno la finalità di documentare l’attività della scuola. La base giuridica è il consenso delle persone ritratte o, per i minori, di chi esercita la responsabilità genitoriale; la raccolta e la gestione di tale consenso sono a cura della scuola. Chi è ritratto può chiedere la rimozione di un’immagine scrivendo a <a href={`mailto:${contact.email}`}>{contact.email}</a>.</p>
      </section>

      <section>
        <h2>Recensioni</h2>
        <p>Nella sezione «Recensioni» sono riportati nome e testo di recensioni pubbliche presenti sulla scheda Google della scuola (dati resi pubblici dagli stessi interessati). È possibile chiederne la rimozione dal sito scrivendo a <a href={`mailto:${contact.email}`}>{contact.email}</a>.</p>
      </section>

      <section>
        <h2>Destinatari dei dati</h2>
        <p>I dati possono essere trattati, per le sole finalità sopra indicate, da: <strong>Cloudflare, Inc.</strong>, fornitore di hosting e rete di distribuzione, che agisce in qualità di responsabile del trattamento; il fornitore della casella di posta elettronica della scuola; l’eventuale soggetto incaricato della manutenzione tecnica del sito; le autorità competenti nei casi previsti dalla legge. Alcuni di questi fornitori possono trattare i dati anche al di fuori dell’Unione Europea: in tal caso il trasferimento avviene nel rispetto delle garanzie previste dal Capo V del GDPR. Per la sola mappa attivata dall’utente è destinatario, come titolare autonomo, <strong>Google</strong>. I dati non sono diffusi né comunicati ad altri soggetti.</p>
      </section>

      <section>
        <h2>Conservazione</h2>
        <p>I dati di navigazione e le statistiche aggregate sono conservati per il tempo necessario alle finalità di sicurezza e di misurazione e comunque non oltre [periodo da definire]. Le comunicazioni via email o telefono sono conservate per il tempo necessario a gestire la richiesta e, se questa dà seguito a un’iscrizione, per la durata degli obblighi contrattuali e fiscali applicabili [periodo da definire].</p>
      </section>

      <section>
        <h2>Diritti dell’interessato</h2>
        <p>In qualsiasi momento è possibile esercitare i diritti previsti dagli articoli 15–22 del GDPR (accesso, rettifica, cancellazione, limitazione, opposizione, portabilità) scrivendo a <a href={`mailto:${contact.email}`}>{contact.email}</a>. Il consenso alla mappa di Google è prestato con l’attivazione e vale solo per la pagina in corso: per interromperne il caricamento è sufficiente premere «Nascondi mappa» o ricaricare la pagina; i cookie eventualmente impostati da Google si gestiscono dalle impostazioni del browser. È inoltre possibile proporre reclamo all’Autorità di controllo, il <a href="https://www.garanteprivacy.it" target="_blank" rel="noreferrer">Garante per la protezione dei dati personali</a>.</p>
      </section>

      <section>
        <h2>Natura del conferimento e assenza di profilazione</h2>
        <p>Il trattamento dei dati di navigazione è tecnicamente necessario per fruire del sito. Il conferimento dei dati di contatto è facoltativo, ma senza di essi non è possibile ricevere risposta. Il sito non effettua alcuna decisione automatizzata né attività di profilazione.</p>
      </section>

      <section>
        <h2>Minori</h2>
        <p>Il sito ha finalità informative e non raccoglie consapevolmente dati di minori tramite moduli online. Le iscrizioni dei minori sono gestite dalla scuola al di fuori del sito, con il consenso di chi esercita la responsabilità genitoriale.</p>
      </section>

      <p className="legal-updated">Ultimo aggiornamento: [data]. L’informativa può essere modificata; le versioni aggiornate sono pubblicate su questa pagina.</p>
    </main>
  </PageChrome>;
}

export function CookiePage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    applyHead({
      title: 'Cookie Policy — Crazy Gang School',
      description: 'Il sito non usa cookie di profilazione. Le statistiche di visita previste sono aggregate e senza cookie.',
      canonical: absoluteUrl('/cookie'),
      ogImage: absoluteUrl(OG_IMAGE),
    });
  }, []);

  return <PageChrome>
    <main className="legal-main">
      <h1>Cookie Policy</h1>
      <p className="legal-lead">Informazioni sui cookie e sulle tecnologie simili utilizzati dal sito di Crazy Gang School, ai sensi delle Linee guida del Garante del 10 giugno 2021.</p>

      <section>
        <h2>Cosa sono</h2>
        <p>I cookie sono piccoli file che un sito salva nel browser; tecnologie simili (come <code>localStorage</code>) permettono di memorizzare informazioni sul dispositivo. Possono servire a far funzionare il sito (cookie tecnici) oppure a misurare il traffico o mostrare pubblicità (cookie non tecnici, che richiedono il consenso).</p>
      </section>

      <section>
        <h2>Cookie di questo sito</h2>
        <p>Il sito <strong>non installa cookie propri</strong> e non utilizza cookie di profilazione, statistici o di marketing. All’apertura delle pagine non viene impostato alcun cookie proprio e non viene memorizzato nulla nel browser.</p>
      </section>

      <section>
        <h2>Statistiche di visita</h2>
        <p>Per misurare in forma aggregata quante persone visitano il sito viene utilizzato <strong>Cloudflare Web Analytics</strong>, uno strumento che, secondo la documentazione del fornitore, rileva dati come pagine viste, provenienza, Paese e tipo di browser o sistema operativo <strong>senza cookie e senza identificatori persistenti</strong> e senza incrociare i dati con altri siti. Riferimento: <a href="https://www.cloudflare.com/web-analytics/" target="_blank" rel="noreferrer">Cloudflare Web Analytics</a>.</p>
      </section>

      <section>
        <h2>Cookie tecnici dell’infrastruttura</h2>
        <p>L’infrastruttura di sicurezza e distribuzione che eroga il sito (Cloudflare) può impostare cookie <strong>tecnici e strettamente necessari</strong>, di durata limitata, per proteggere il sito da traffico automatico e abusi. Sono esenti dal consenso ai sensi dell’art. 122 del Codice Privacy. L’elenco puntuale dei cookie effettivamente presenti sarà verificato e riportato in questa pagina sul dominio definitivo.</p>
      </section>

      <section>
        <h2>Google Maps</h2>
        <p>La mappa nella sezione «Dove siamo» viene caricata <strong>solo dopo aver premuto</strong> il pulsante «Attiva la mappa», e limitatamente alla pagina in corso. Dopo l’attivazione, Google può trattare dati e utilizzare cookie secondo le proprie <a href="https://policies.google.com/technologies/cookies" target="_blank" rel="noreferrer">policy sui cookie</a>. Premendo «Nascondi mappa» o ricaricando la pagina, la mappa viene rimossa e non vengono caricati ulteriori contenuti di Google; i cookie eventualmente già impostati da Google possono essere gestiti dalle impostazioni del browser.</p>
      </section>

      <section>
        <h2>Consenso e banner</h2>
        <p>Allo stato attuale il sito non utilizza cookie di profilazione o statistici e non installa cookie non tecnici senza un’azione esplicita dell’utente; al momento non è presente un banner di gestione dei consensi. L’eventuale aggiunta di strumenti di analisi con cookie, pixel pubblicitari, widget di prenotazione o contenuti incorporati di terzi comporterà l’introduzione di un sistema di gestione dei consensi e l’aggiornamento di questa pagina.</p>
      </section>

      <section>
        <h2>Gestione dei cookie nel browser</h2>
        <p>È possibile gestire ed eliminare i cookie già memorizzati dalle impostazioni del proprio browser:</p>
        <ul>
          <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noreferrer">Google Chrome</a></li>
          <li><a href="https://support.mozilla.org/it/kb/Attivare%20e%20disattivare%20i%20cookie" target="_blank" rel="noreferrer">Mozilla Firefox</a></li>
          <li><a href="https://support.apple.com/it-it/guide/safari/sfri11471/mac" target="_blank" rel="noreferrer">Apple Safari</a></li>
          <li><a href="https://support.microsoft.com/it-it/microsoft-edge/eliminare-i-cookie-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noreferrer">Microsoft Edge</a></li>
        </ul>
        <p>Bloccare i cookie tecnici può compromettere il funzionamento del sito.</p>
      </section>

      <p className="legal-updated">Ultimo aggiornamento: [data]. Per il trattamento degli altri dati vedi la <a href="/privacy">Privacy Policy</a>.</p>
    </main>
  </PageChrome>;
}

export function NotFoundPage() {
  useEffect(() => {
    // No canonical: an error page must not canonicalize to the homepage.
    applyHead({
      title: 'Pagina non trovata — Crazy Gang School',
      description: SITE_DESCRIPTION,
      robots: 'noindex, follow',
      ogImage: absoluteUrl(OG_IMAGE),
    });
  }, []);

  return <PageChrome className="not-found">
    <main className="legal-main not-found-main">
      <p className="not-found-code">Errore 404</p>
      <h1>Pagina non trovata</h1>
      <p>La pagina che cerchi non esiste o è stata spostata.</p>
      <div className="not-found-actions">
        <a className="button button--acid" href="/">Vai alla home <Arrow /></a>
        <a className="text-action" href="/#discipline">Vedi i corsi <Arrow /></a>
      </div>
    </main>
  </PageChrome>;
}
