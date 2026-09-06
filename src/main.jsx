import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { photos, courseGroups, faculty, contact } from './content';
import './styles.css';

gsap.registerPlugin(ScrollTrigger, useGSAP);

function Arrow({ diagonal = false, className = '' }) {
  return <svg className={`arrow ${className}`} viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d={diagonal ? 'M5 19 19 5M5 5h14v14' : 'M4 12h16m-7-7 7 7-7 7'} stroke="currentColor" strokeWidth="1.5" /></svg>;
}

function BrandLogo({ className = '', sizes = '160px' }) {
  return <img className={`brand-logo ${className}`} src="/brand/crazy-gang-640.webp" srcSet="/brand/crazy-gang-320.webp 320w, /brand/crazy-gang-640.webp 640w, /brand/crazy-gang-960.webp 960w" sizes={sizes} width="2307" height="1157" alt="Crazy Gang School" />;
}

function Wordmark({ footer = false, onNavigate }) {
  return <a href="#inizio" onClick={onNavigate} className={`wordmark ${footer ? 'wordmark-footer' : ''}`} aria-label="Crazy Gang School, torna all'inizio"><BrandLogo sizes={footer ? '(max-width: 800px) 220px, 260px' : '(max-width: 800px) 134px, 158px'} /></a>;
}

function Photo({ name, className = '', priority = false, caption = true }) {
  const photo = photos[name];
  return <figure className={`photo ${className}`} style={{ '--photo-position': photo.position, '--photo-mobile-position': photo.mobilePosition }}>
    <div className="photo-frame"><img src={photo.src} srcSet={photo.srcSet} sizes={priority ? '(max-width: 800px) calc(100vw - 46px), 68vw' : '(max-width: 800px) calc(100vw - 46px), 46vw'} alt={photo.alt} width={photo.width} height={photo.height} loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : 'auto'} decoding="async" /></div>
    {caption && <figcaption>{photo.caption}</figcaption>}
  </figure>;
}

function Navigation() {
  const [open, setOpen] = useState(false);
  const menu = useRef(null);
  const toggle = useRef(null);
  const links = [['La scuola', '#scuola'], ['Le discipline', '#discipline'], ['Il palcoscenico', '#palcoscenico']];

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const first = menu.current.querySelector('a');
    first?.focus();
    const handleKey = (event) => {
      if (event.key === 'Escape') { setOpen(false); toggle.current?.focus(); }
      if (event.key === 'Tab') {
        const controls = [toggle.current, ...menu.current.querySelectorAll('a')];
        const index = controls.indexOf(document.activeElement);
        if (event.shiftKey && index === 0) { event.preventDefault(); controls.at(-1).focus(); }
        if (!event.shiftKey && index === controls.length - 1) { event.preventDefault(); controls[0].focus(); }
      }
    };
    const onResize = () => { if (window.innerWidth > 800) setOpen(false); };
    document.addEventListener('keydown', handleKey);
    window.addEventListener('resize', onResize);
    return () => { document.body.style.overflow = previous; document.removeEventListener('keydown', handleKey); window.removeEventListener('resize', onResize); };
  }, [open]);

  return <header className={`header ${open ? 'menu-open' : ''}`}>
    <div className="header-inner"><Wordmark onNavigate={() => setOpen(false)} /><nav className="desktop-nav" aria-label="Navigazione principale">{links.map(([label, href]) => <a key={href} href={href}>{label}</a>)}</nav><a className="nav-contact" href="#contatti">Parliamone <Arrow diagonal /></a><button ref={toggle} className="menu-toggle" type="button" aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(!open)}>{open ? 'Chiudi' : 'Menu'}<span className="menu-bars" aria-hidden="true"><i /><i /></span></button></div>
    <nav ref={menu} id="mobile-menu" className="mobile-menu" aria-label="Navigazione mobile" hidden={!open}>{[...links, ['Gli insegnanti', '#insegnanti'], ['Contatti', '#contatti']].map(([label, href]) => <a key={href} href={href} onClick={() => { setOpen(false); requestAnimationFrame(() => document.querySelector(href)?.focus({ preventScroll: true })); }}>{label}<Arrow diagonal /></a>)}<span>Crazy Gang School · Roma</span></nav>
  </header>;
}

function Disciplines() {
  const [active, setActive] = useState(0);
  return <section id="discipline" tabIndex={-1} className="disciplines section-pad">
    <div className="section-intro"><div><span className="eyebrow">Le discipline</span><h2>Un corpo.<br /><span className="type-accent">Tanti linguaggi.</span></h2></div><p>Classica, moderna, hip hop e non solo.<br />Esplora le discipline raccontate dalla scuola e chiedi informazioni sul percorso che ti interessa.</p></div>
    <div className="course-grid" style={{ '--course-columns': courseGroups.map((_, i) => `minmax(0, ${active === i ? 6 : 3}fr)`).join(' ') }}>{courseGroups.map((group, index) => <article key={group.id} className={`course-panel ${active === index ? 'active' : ''}`}>

      <button className="course-trigger" id={`trigger-${group.id}`} aria-expanded={active === index} aria-controls={`panel-${group.id}`} onClick={() => setActive(index)}><span>{group.title}</span><span className="course-symbol" aria-hidden="true">{active === index ? '−' : '+'}</span></button>
      <div className="course-content" id={`panel-${group.id}`} role="region" aria-labelledby={`trigger-${group.id}`} hidden={active !== index}><p>{group.subtitle}</p><ul>{group.names.map(name => <li key={name}>{name}</li>)}</ul><a href={`mailto:${contact.email}?subject=${encodeURIComponent(`Informazioni: ${group.names.join(', ')}`)}`}>Chiedi informazioni <Arrow diagonal /></a></div>
    </article>)}</div>
    <div className="course-note"><p>Per corsi attivi, livelli e orari, contatta direttamente la scuola.</p><span>Percorsi raccontati dalla scuola</span></div>
    <details className="other-disciplines" onToggle={() => ScrollTrigger.refresh()}><summary>Propedeutica e altre attività <span aria-hidden="true">+</span></summary><div><p>Il sito della scuola cita anche la propedeutica per bambini e il Kuai. Per conoscere età, contenuti e disponibilità, scrivi alla segreteria.</p><a className="text-link" href={`mailto:${contact.email}?subject=Informazioni%20sulle%20attivit%C3%A0`}>Scrivi alla scuola <Arrow diagonal /></a></div></details>
  </section>;
}

function App() {
  const root = useRef(null);
  const [teachersOpen, setTeachersOpen] = useState(false);
  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from('.hero-title > span', { y: 60, opacity: 0, duration: 1.05, stagger: 0.13, ease: 'power3.out', clearProps: 'all' });
      gsap.from('.hero-photo img', { scale: 1.08, duration: 1.7, ease: 'power2.out', clearProps: 'transform' });
      gsap.utils.toArray('.reveal').forEach(element => gsap.from(element, { y: 32, opacity: 0, duration: 0.8, ease: 'power2.out', scrollTrigger: { trigger: element, start: 'top 94%', once: true }, clearProps: 'all' }));
    });
    media.add('(min-width: 1000px) and (prefers-reduced-motion: no-preference)', () => {
      ScrollTrigger.create({ trigger: '.stage-heading', start: 'top 110px', endTrigger: '.stage-gallery', end: 'bottom 75%', pin: true, pinSpacing: false });
    });
    const refresh = () => ScrollTrigger.refresh();
    document.fonts.ready.then(refresh);
    window.addEventListener('load', refresh);
    return () => { media.revert(); window.removeEventListener('load', refresh); };
  }, { scope: root });

  useEffect(() => { ScrollTrigger.refresh(); }, [teachersOpen]);

  const story = 'La danza è tecnica, espressione e piacere di muoversi. Un percorso che dalla sala incontra il teatro, il canto e la recitazione.';

  return <div ref={root}>
    <a className="skip-link" href="#contenuto">Vai al contenuto</a>
    <Navigation />
    <main id="contenuto" tabIndex={-1} className="page-shell">
      <section id="inizio" className="hero" aria-labelledby="hero-title">
        <div className="hero-topline"><span>Scuola di danza · Roma</span><span>Danza / Teatro / Movimento</span></div>
        <Photo name="hero" priority className="hero-photo" />
        <h1 className="hero-title" id="hero-title"><span>INSIEME,</span><span>IN <em>SCENA.</em></span></h1>
        <div className="hero-brand"><BrandLogo sizes="(max-width: 800px) 210px, (max-width: 1100px) 230px, 290px" /><span>Una scuola. Molti linguaggi.</span></div>
        <div className="hero-bottom"><div className="hero-copy"><p>Dalla scoperta della danza<br />all’esperienza del palcoscenico.</p><a className="button button-orange" href="#discipline">Esplora le discipline <Arrow diagonal /></a></div><a className="hero-scroll" href="#scuola"><span>Entra nel nostro mondo</span><Arrow /></a></div>

      </section>

      <section id="scuola" tabIndex={-1} className="school section-pad">
        <div className="school-top"><span className="eyebrow">Crazy Gang School</span><span className="small-location">Roma, Colli Albani <span aria-hidden="true">↗</span></span></div>
        <h2 className="story-copy" aria-label={story}>{story.split(' ').map((word, i) => <React.Fragment key={i}><span className="story-word" aria-hidden="true">{word} </span></React.Fragment>)}</h2>
        <div className="school-foot"><span className="school-rule" /><p>La scuola si racconta attraverso percorsi per bambini e adulti, dalla propedeutica alla preparazione avanzata.</p><a href="#insegnanti" className="text-link">Conosci gli insegnanti <Arrow diagonal /></a></div>
      </section>

      <Disciplines />

      <div className="scene-interlude" aria-hidden="true"><span>Danza.</span><span>Teatro.</span><span>Crazy Gang.</span></div>

      <section id="palcoscenico" tabIndex={-1} className="stage section-pad">
        <div className="stage-heading"><span className="eyebrow">L’esperienza del teatro</span><h2>Dalla sala<br />al <span className="type-accent">palco.</span></h2><p>Saggi, rassegne, musical. Il palcoscenico fa parte del racconto della Crazy Gang School: un incontro tra danza, canto e recitazione.</p><a className="text-link light" href="https://www.crazygangschool.com/blank" target="_blank" rel="noreferrer">Esplora l’archivio storico <Arrow diagonal /><span className="sr-only"> (si apre in una nuova scheda)</span></a><span className="stage-line" aria-hidden="true" /></div>
        <div className="stage-gallery"><div className="stage-piece"><Photo name="stage" className="stage-photo" /><div className="stage-caption"><span>Il movimento, in scena.</span><span>Danza & performance</span></div></div><div className="stage-piece second"><Photo name="studio" className="stage-photo" /><div className="stage-caption"><span>Il teatro, nel percorso.</span><span>Espressione & presenza</span></div></div><p className="archive-note">Nell’archivio della scuola: Crazy Party, saggi e fotografie dedicate a musical come Sister Act, Dracula e Mary Poppins.</p></div>
      </section>

      <section id="insegnanti" tabIndex={-1} className="teachers section-pad"><div className="section-intro"><div><span className="eyebrow">Le persone della scuola</span><h2>Il gesto si impara.<br />La passione <span className="type-accent">si incontra.</span></h2></div><p>Coreografia, insegnamento e direzione artistica. Le persone dietro il percorso della scuola.</p></div><div className="directors"><article className="director reveal"><span>Direzione artistica</span><h3>Marco<br /><strong>Stopponi</strong></h3><p>Coreografo e insegnante</p></article><article className="director reveal"><span>Direzione artistica</span><h3>Stefano<br /><strong>Stopponi</strong></h3><p>Coreografo e insegnante</p></article><aside className="faculty-aside"><span className="large-asterisk" aria-hidden="true">↗</span><p>Diversi linguaggi.<br />Una scuola da conoscere.</p><button className="text-link" aria-expanded={teachersOpen} aria-controls="faculty-list" onClick={() => setTeachersOpen(!teachersOpen)}>{teachersOpen ? 'Chiudi l’elenco' : 'Gli altri insegnanti'}<span aria-hidden="true">{teachersOpen ? '−' : '+'}</span></button></aside></div><div id="faculty-list" hidden={!teachersOpen}><p className="faculty-note">Docenti presentati nel sito della scuola. Per conoscere il team e le assegnazioni attuali, contatta la segreteria.</p><ul className="faculty-list">{faculty.map(([name, discipline]) => <li key={name}><span>{name}</span><span>{discipline}</span></li>)}</ul></div><p className="verification-note">Ruoli riportati dal sito della scuola; composizione attuale da confermare.</p></section>

      <section className="animation-section"><span className="eyebrow">Anche fuori scena</span><h2>La danza incontra<br /><span className="type-accent">l’intrattenimento.</span></h2><div><p>Nel racconto della scuola, anche animazione nei villaggi turistici, spettacoli di magia e feste per bambini e ragazzi.</p><a className="text-link" href={`mailto:${contact.email}?subject=Informazioni%20animazione`}>Informazioni sull’animazione <Arrow diagonal /></a></div></section>

      <section id="contatti" tabIndex={-1} className="contact section-pad"><div className="contact-top"><span className="eyebrow">Facciamo il primo passo</span><span>Crazy Gang School · Roma</span></div><a className="contact-headline" href={`mailto:${contact.email}`}><h2>PARLIAMO<br />DI <span className="type-accent">DANZA.</span></h2><Arrow diagonal /></a><div className="contact-grid"><p>Hai una disciplina in mente?<br />Scrivici per conoscere attività,<br />orari e disponibilità.</p><div><span className="contact-label">Scrivici o chiamaci</span><a href={`mailto:${contact.email}`}>{contact.email}</a><a href={`tel:${contact.phone}`}>{contact.phone}</a><a className="mobile-number" href={`tel:${contact.mobile}`}>Cell. {contact.mobile}</a></div><div><span className="contact-label">La sede indicata dalla scuola</span><address>{contact.address}</address><span>Metro A · Colli Albani</span><a className="map-link" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contact.address)}`} target="_blank" rel="noreferrer">Apri la mappa <Arrow diagonal /><span className="sr-only"> (nuova scheda)</span></a></div></div><p className="contact-note">Prima di una visita, contatta la scuola per confermare l’apertura e la disponibilità delle attività.</p></section>
    </main>
    <footer className="footer"><div className="footer-top"><Wordmark footer /><p>Danza, teatro, movimento.<br />Crazy Gang School, Roma.</p><div className="social-links"><a href={contact.instagram} target="_blank" rel="noreferrer">Instagram <Arrow diagonal /><span className="sr-only"> (nuova scheda)</span></a><a href={contact.facebook} target="_blank" rel="noreferrer">Facebook <Arrow diagonal /><span className="sr-only"> (nuova scheda)</span></a></div><a className="back-top" href="#inizio">Torna su <Arrow diagonal /></a></div><div className="footer-bottom"><span>Crazy Gang School</span><span>Anteprima locale · fotografie dall’archivio del sito originale</span></div></footer>
  </div>;
}

createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>);

