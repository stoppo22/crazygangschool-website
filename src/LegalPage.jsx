import { useEffect } from 'react';
import { contact } from './content';
import { applyHead } from './head';
import { SITE_URL, SITE_DESCRIPTION, OG_IMAGE, absoluteUrl } from './site';

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

// TODO(launch): far revisionare i testi legali da un consulente e completare i
// campi tra parentesi quadre (denominazione legale, P. IVA, sede, date, tempi
// di conservazione). Vedi LAUNCH_CHECKLIST.md.

export function PrivacyPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    applyHead({
      title: 'Privacy Policy — Crazy Gang School',
      description: 'Informativa sintetica sul trattamento dei dati personali per il sito di Crazy Gang School.',
      canonical: absoluteUrl('/privacy'),
      ogImage: absoluteUrl(OG_IMAGE),
    });
  }, []);

  return <PageChrome>
    <main className="legal-main">
      <h1>Privacy Policy</h1>
      <p className="legal-lead">Informativa sintetica sul trattamento dei dati personali relativa al sito di Crazy Gang School. I riferimenti tra parentesi quadre devono essere completati dal titolare prima della pubblicazione definitiva.</p>

      <section>
        <h2>Titolare del trattamento</h2>
        <p>[Denominazione legale del titolare], [indirizzo della sede legale], [P. IVA / codice fiscale]. Contatti: <a href={`mailto:${contact.email}`}>{contact.email}</a> — <a href={`tel:${contact.phone}`}>06 7883621</a>.</p>
      </section>

      <section>
        <h2>Dati trattati tramite il sito</h2>
        <p>Il sito è statico e non contiene moduli di registrazione o di contatto: non raccoglie né memorizza dati inseriti dagli utenti. Utilizzando i collegamenti «email» o «telefono» si apre l’applicazione di posta o di telefono del dispositivo; l’eventuale comunicazione inviata alla scuola è trattata al solo fine di rispondere alla richiesta e conservata per il tempo necessario a gestirla [specificare il periodo di conservazione].</p>
      </section>

      <section>
        <h2>Dati di navigazione e hosting</h2>
        <p>Il sito è ospitato su Cloudflare Pages (Cloudflare, Inc.). Il fornitore di hosting può registrare, nei log tecnici di servizio, dati come indirizzo IP, data e ora della richiesta e user agent del browser, per finalità di sicurezza e di funzionamento dell’infrastruttura. Riferimento: <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noreferrer">privacy policy di Cloudflare</a>.</p>
      </section>

      <section>
        <h2>Servizi di terze parti</h2>
        <p>La sezione «Dove siamo» include una mappa di Google Maps che viene caricata soltanto dopo un click esplicito sul pulsante «Attiva la mappa». Fino a quel momento nessun dato viene inviato a Google. Dopo l’attivazione, Google LLC può trattare dati (incluso l’indirizzo IP) e impostare cookie secondo la <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">propria informativa privacy</a>. I collegamenti a Instagram, Facebook e Google Maps rimandano a siti esterni che dispongono di informative autonome.</p>
      </section>

      <section>
        <h2>Cookie</h2>
        <p>Il sito non utilizza cookie di profilazione, statistici o di marketing. Per i dettagli vedi la <a href="/cookie">Cookie Policy</a>.</p>
      </section>

      <section>
        <h2>Diritti dell’interessato</h2>
        <p>È possibile esercitare i diritti previsti dagli articoli 15–22 del Regolamento (UE) 2016/679 (accesso, rettifica, cancellazione, limitazione, opposizione, portabilità) scrivendo a <a href={`mailto:${contact.email}`}>{contact.email}</a>. È inoltre possibile proporre reclamo al Garante per la protezione dei dati personali (<a href="https://www.garanteprivacy.it" target="_blank" rel="noreferrer">garanteprivacy.it</a>).</p>
      </section>

      <p className="legal-updated">Ultimo aggiornamento: [data]. La presente informativa può essere modificata; le revisioni sono pubblicate su questa pagina.</p>
    </main>
  </PageChrome>;
}

export function CookiePage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    applyHead({
      title: 'Cookie Policy — Crazy Gang School',
      description: 'Questo sito non utilizza cookie di profilazione, statistici o di marketing.',
      canonical: absoluteUrl('/cookie'),
      ogImage: absoluteUrl(OG_IMAGE),
    });
  }, []);

  return <PageChrome>
    <main className="legal-main">
      <h1>Cookie Policy</h1>
      <p className="legal-lead">Informativa sull’uso dei cookie nel sito di Crazy Gang School.</p>

      <section>
        <h2>Cookie utilizzati dal sito</h2>
        <p>Questo sito non utilizza cookie di profilazione, di analisi statistica o di marketing e non installa cookie tecnici propri. All’apertura delle pagine non viene impostato alcun cookie.</p>
      </section>

      <section>
        <h2>Google Maps</h2>
        <p>La mappa presente nella sezione «Dove siamo» viene caricata solo dopo aver premuto manualmente il pulsante «Attiva la mappa». Dopo l’attivazione, Google può impostare cookie tecnici e di preferenza necessari al funzionamento della mappa, secondo l’<a href="https://policies.google.com/technologies/cookies" target="_blank" rel="noreferrer">informativa sui cookie di Google</a>. Se la mappa non viene attivata, nessun cookie di Google viene impostato.</p>
      </section>

      <section>
        <h2>Gestione dei cookie</h2>
        <p>Poiché il sito non utilizza cookie non tecnici, non è presente un banner di consenso. È comunque possibile gestire ed eliminare i cookie già memorizzati dalle impostazioni del proprio browser.</p>
      </section>

      <p className="legal-updated">Ultimo aggiornamento: [data].</p>
    </main>
  </PageChrome>;
}

export function NotFoundPage() {
  useEffect(() => {
    applyHead({
      title: 'Pagina non trovata — Crazy Gang School',
      description: SITE_DESCRIPTION,
      canonical: SITE_URL + '/',
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
