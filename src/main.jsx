import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { contact, disciplines, faculty, photos } from './content';
import './styles.css';
import './sections.css';
import './chapters.css';
import './responsive.css';

gsap.registerPlugin(ScrollTrigger, useGSAP);

function Arrow({ down = false }) {
  const path = down ? 'M12 3v18m-7-7 7 7 7-7' : 'M5 19 19 5M7 5h12v12';
  return <svg className="arrow" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d={path} stroke="currentColor" strokeWidth="1.7" /></svg>;
}

function Brand({ footer = false, onNavigate }) {
  return <a className={`brand ${footer ? 'brand--footer' : ''}`} href="#inizio" onClick={onNavigate} aria-label="Crazy Gang School, torna all'inizio"><img src="/brand/crazy-gang-640.webp" width="2307" height="1157" alt="Crazy Gang School" /></a>;
}

function Photo({ name, className = '', priority = false, sizes = '50vw' }) {
  const p = photos[name];
  return <figure className={`photo ${className}`} data-placeholder={p.placeholder ? 'true' : undefined} style={{ '--position': p.position, '--mobile-position': p.mobilePosition }}><div className="photo__frame"><img src={p.src} srcSet={p.srcSet} sizes={sizes} width={p.width} height={p.height} alt={p.alt} loading={priority ? 'eager' : 'lazy'} /></div><figcaption>{p.caption}</figcaption></figure>;
}

function Navigation() {
  const [open, setOpen] = useState(false);
  const panel = useRef(null);
  const toggle = useRef(null);
  const links = [['La scuola', '#scuola'], ['Discipline', '#discipline'], ['Archivio', '#archivio'], ['Contatti', '#contatti']];
  useEffect(() => {
    if (!open) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panel.current?.querySelector('a')?.focus();
    const onKey = (event) => {
      if (event.key === 'Escape') { setOpen(false); toggle.current?.focus(); }
      if (event.key === 'Tab') {
        const items = [toggle.current, ...panel.current.querySelectorAll('a')];
        const current = items.indexOf(document.activeElement);
        if (event.shiftKey && current === 0) { event.preventDefault(); items.at(-1)?.focus(); }
        if (!event.shiftKey && current === items.length - 1) { event.preventDefault(); items[0]?.focus(); }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = previous; document.removeEventListener('keydown', onKey); };
  }, [open]);
  const close = () => setOpen(false);
  return <header className={`site-header ${open ? 'is-open' : ''}`}><div className="nav-shell"><Brand onNavigate={close} /><nav className="desktop-nav" aria-label="Navigazione principale">{links.slice(0, 3).map(([label, href]) => <a key={href} href={href}>{label}</a>)}</nav><a className="nav-cta" href="#contatti">Richiedi informazioni <Arrow /></a><button ref={toggle} className="menu-toggle" type="button" aria-expanded={open} aria-controls="menu-mobile" onClick={() => setOpen(value => !value)}><span>{open ? 'Chiudi' : 'Menu'}</span><i aria-hidden="true" /></button></div><nav ref={panel} id="menu-mobile" className="mobile-nav" aria-label="Navigazione mobile" hidden={!open}>{links.map(([label, href]) => <a key={href} href={href} onClick={close}>{label}<Arrow /></a>)}<p>Crazy Gang School<br />Roma, Colli Albani</p></nav></header>;
}

function Marquee() {
  const names = disciplines.map(item => item.name).join(' · ');
  return <div className="marquee" aria-label={`Discipline: ${names}`}><div className="marquee__track" aria-hidden="true"><span>{names} · </span><span>{names} · </span></div></div>;
}

function DisciplineAccordion() {
  return <div className="discipline-accordion" role="list" aria-label="Discipline riportate nel sito della scuola">{disciplines.map((course, index) => <a key={course.id} className={`discipline-slice discipline-slice--${(index % 4) + 1}`} href={`mailto:${contact.email}?subject=${encodeURIComponent(`Informazioni: ${course.name}`)}`} role="listitem"><span aria-hidden="true" /><strong>{course.name}</strong><span className="slice-action">Chiedi informazioni <Arrow /></span></a>)}</div>;
}

function App() {
  const root = useRef(null);
  const [teachersOpen, setTeachersOpen] = useState(false);
  const statement = 'Una scuola di danza a Roma. Le discipline, il lavoro in sala e un archivio di spettacoli che attraversa danza, canto e recitazione.';
  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add({ motion: '(prefers-reduced-motion: no-preference)', desktop: '(min-width: 1000px)' }, ({ conditions }) => {
      if (!conditions.motion) return;
      gsap.timeline({ defaults: { ease: 'power3.out' } })
        .from('.hero-title__line span', { yPercent: 110, duration: .8, stagger: .09, clearProps: 'transform' })
        .from('.hero-photo .photo__frame', { clipPath: 'inset(0 0 100% 0)', duration: 1, ease: 'power3.inOut', clearProps: 'clipPath' }, .12)
        .from('.hero-aside > *', { opacity: 0, y: 18, duration: .55, stagger: .08 }, .35);
      gsap.to('.story-word', { opacity: 1, stagger: .035, ease: 'none', scrollTrigger: { trigger: '.story-statement', start: 'top 78%', end: 'bottom 50%', scrub: .6 } });
      gsap.utils.toArray('.reveal').forEach(element => gsap.from(element, { y: 34, opacity: 0, duration: .75, ease: 'power3.out', scrollTrigger: { trigger: element, start: 'top 90%', once: true } }));
      gsap.utils.toArray('.photo:not(.hero-photo) .photo__frame').forEach(frame => gsap.fromTo(frame, { scale: .86 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: frame, start: 'top 95%', end: 'center 55%', scrub: .55 } }));
      if (conditions.desktop) ScrollTrigger.create({ trigger: '.archive-layout', start: 'top 108px', endTrigger: '.archive-rail', end: 'bottom 72%', pin: '.archive-copy', pinSpacing: false });
    });
    const refresh = () => ScrollTrigger.refresh();
    document.fonts.ready.then(refresh);
    window.addEventListener('load', refresh);
    return () => { media.revert(); window.removeEventListener('load', refresh); };
  }, { scope: root });
  useEffect(() => ScrollTrigger.refresh(), [teachersOpen]);

  return <div ref={root} className="site-root">
    <a className="skip-link" href="#contenuto">Vai al contenuto</a>
    <Navigation />
    <main id="contenuto" tabIndex={-1}>
      <section id="inizio" className="hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <div className="hero-kicker"><span>Scuola di danza</span><span>Roma · Colli Albani</span></div>
          <h1 id="hero-title" className="hero-title"><span className="hero-title__line"><span>Il movimento</span></span><span className="hero-title__line hero-title__line--accent"><span>prende spazio.</span></span></h1>
          <div className="hero-actions"><a className="button button--acid" href="#discipline">Scopri le discipline <Arrow /></a><a className="text-action" href="#contatti">Parla con la scuola <Arrow /></a></div>
        </div>
        <div className="hero-visual"><Photo name="heroMain" className="hero-photo" priority sizes="(max-width: 820px) 100vw, 43vw" /><div className="hero-aside"><span>Foto segnaposto</span><p>Le immagini definitive saranno inserite indipendentemente dall’interfaccia.</p><a href="#scuola" aria-label="Continua alla sezione La scuola"><Arrow down /></a></div></div>
      </section>
      <Marquee />

      <section id="scuola" className="story section-space" tabIndex={-1} aria-labelledby="story-title">
        <div className="section-heading reveal"><p>Crazy Gang School</p><h2 id="story-title">Sala, scena,<br />persone.</h2></div>
        <p className="story-statement" aria-label={statement}>{statement.split(' ').map((word, index) => <span className="story-word" key={`${word}-${index}`}>{word}{' '}</span>)}</p>
        <div className="story-facts reveal"><p>Il sito della scuola presenta percorsi per bambini e adulti, principianti ed esperti.</p><p>Per sapere quali attività sono attive oggi, contatta direttamente la segreteria.</p></div>
      </section>

      <section className="facts-bento" aria-label="Scopri Crazy Gang School">
        <a className="bento-card bento-card--main" href="#discipline"><div><span>Le discipline</span><Arrow /></div><strong>Danza in sala.<br />Esperienza sul palco.</strong></a>
        <a className="bento-card bento-card--archive" href="#archivio"><span>Archivio</span><strong>Saggi, rassegne e spettacoli documentati dal sito della scuola.</strong><Arrow /></a>
        <div className="bento-card bento-card--place"><span>Dove</span><strong>Roma<br />Colli Albani</strong></div>
        <a className="bento-card bento-card--contact" href="#contatti"><span>Prima di venire</span><strong>Conferma apertura e attività disponibili.</strong><Arrow /></a>
      </section>

      <section id="discipline" className="disciplines section-space" tabIndex={-1} aria-labelledby="discipline-title">
        <div className="section-heading section-heading--wide reveal"><p>Le attività riportate dal sito</p><h2 id="discipline-title">Trova il tuo<br />linguaggio.</h2><p className="section-note">Disponibilità, livelli e orari sono da confermare con la scuola.</p></div>
        <DisciplineAccordion />
      </section>

      <section id="archivio" className="archive section-space" tabIndex={-1} aria-labelledby="archive-title">
        <div className="archive-layout">
          <div className="archive-copy"><p>Memoria in movimento</p><h2 id="archive-title">Il palco<br />fa parte<br />della storia.</h2><p>Il sito originale conserva titoli e immagini di saggi, Crazy Party e musical. Date, crediti e contesto restano da verificare.</p><a className="button button--light" href="https://www.crazygangschool.com/blank" target="_blank" rel="noreferrer">Apri l’archivio storico <Arrow /><span className="sr-only"> (nuova scheda)</span></a></div>
          <div className="archive-rail">
            <article className="archive-piece reveal"><Photo name="stage" sizes="(max-width: 820px) 100vw, 52vw" /><h3>Sister Act</h3><p>Etichetta presente nell’archivio fotografico originale.</p></article>
            <article className="archive-piece archive-piece--offset reveal"><Photo name="studio" sizes="(max-width: 820px) 100vw, 42vw" /><h3>Ensemble</h3><p>Immagine dalla galleria Danza Moderna del sito originale.</p></article>
          </div>
        </div>
      </section>

      <section className="people section-space" aria-labelledby="people-title">
        <div className="section-heading reveal"><p>Persone</p><h2 id="people-title">La direzione<br />artistica.</h2></div>
        <div className="people-grid">
          <article className="person-card reveal"><span>Coreografo, insegnante, direttore artistico</span><h3>Marco<br />Stopponi</h3></article>
          <article className="person-card person-card--blue reveal"><span>Coreografo, insegnante, direttore artistico</span><h3>Stefano<br />Stopponi</h3></article>
          <div className="people-list"><button type="button" aria-expanded={teachersOpen} aria-controls="faculty-list" onClick={() => setTeachersOpen(value => !value)}>{teachersOpen ? 'Nascondi gli altri nomi' : 'Vedi gli altri nomi riportati'}<span aria-hidden="true">{teachersOpen ? '−' : '+'}</span></button><p>La composizione attuale del corpo docente è da confermare.</p></div>
        </div>
        <ul id="faculty-list" className="faculty-list" hidden={!teachersOpen}>{faculty.map(([name, role]) => <li key={name}><strong>{name}</strong><span>{role}</span></li>)}</ul>
      </section>

      <section id="contatti" className="contact" tabIndex={-1} aria-labelledby="contact-title">
        <div className="contact-intro"><p>Vuoi conoscere attività, orari e disponibilità?</p><h2 id="contact-title">Parliamone.</h2></div>
        <div className="contact-actions"><a href={`mailto:${contact.email}`}>{contact.email}<Arrow /></a><a href={`tel:${contact.phone}`}>{contact.phone}<Arrow /></a></div>
        <div className="contact-details"><div><span>Sede indicata</span><address>{contact.address}</address><p>Metro A · Colli Albani</p></div><div><span>Prima della visita</span><p>Contatta la scuola per confermare apertura e disponibilità delle attività.</p></div></div>
      </section>
    </main>
    <footer className="footer"><Brand footer /><p>Crazy Gang School<br />Roma, Colli Albani</p><div><a href={contact.instagram} target="_blank" rel="noreferrer">Instagram <Arrow /></a><a href={contact.facebook} target="_blank" rel="noreferrer">Facebook <Arrow /></a></div><a href="#inizio">Torna su <Arrow down /></a><small>Anteprima locale · fotografie segnaposto e materiali d’archivio da verificare</small></footer>
  </div>;
}

createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>);
