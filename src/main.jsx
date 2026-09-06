import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { photos, disciplines, faculty, contact } from './content';
import './styles.css';
import './atlas.css';

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

function Photo({ name, className = '', priority = false, caption = true, sizes = '(max-width: 800px) calc(100vw - 46px), 46vw' }) {
  const photo = photos[name];
  return <figure className={`photo ${className}`} data-placeholder={photo.placeholder || undefined} style={{ '--photo-position': photo.position, '--photo-mobile-position': photo.mobilePosition }}>
    <div className="photo-frame"><img src={photo.src} srcSet={photo.srcSet} sizes={sizes} alt={photo.alt} width={photo.width} height={photo.height} loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : 'auto'} decoding="async" /></div>
    {caption && <figcaption>{photo.caption}</figcaption>}
  </figure>;
}

function Navigation() {
  const [open, setOpen] = useState(false);
  const menu = useRef(null);
  const toggle = useRef(null);
  const links = [['La scuola', '#scuola'], ['Le discipline', '#discipline'], ['Spettacoli', '#palcoscenico']];

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
    <div className="header-inner"><Wordmark onNavigate={() => setOpen(false)} /><nav className="desktop-nav" aria-label="Navigazione principale">{links.map(([label, href]) => <a key={href} href={href}>{label}</a>)}</nav><a className="nav-contact" href="#contatti">Contatti <Arrow diagonal /></a><button ref={toggle} className="menu-toggle" type="button" aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(!open)}>{open ? 'Chiudi' : 'Menu'}<span className="menu-bars" aria-hidden="true"><i /><i /></span></button></div>
    <nav ref={menu} id="mobile-menu" className="mobile-menu" aria-label="Navigazione mobile" hidden={!open}>{[...links, ['Gli insegnanti', '#insegnanti'], ['Contatti', '#contatti']].map(([label, href]) => <a key={href} href={href} onClick={() => { setOpen(false); requestAnimationFrame(() => document.querySelector(href)?.focus({ preventScroll: true })); }}>{label}<Arrow diagonal /></a>)}<span>Crazy Gang School · Roma</span></nav>
  </header>;
}

function Disciplines() {
  return <section id="discipline" tabIndex={-1} className="discipline-atlas section-pad" aria-labelledby="discipline-title">
    <div className="discipline-intro"><h2 id="discipline-title">Discipline</h2><p>Per corsi attivi, livelli e orari,<br /><a href="#contatti">contatta la scuola <Arrow diagonal /></a></p></div>
    <ul className="discipline-list" aria-label="Discipline riportate nel sito della scuola">
      {disciplines.map((course, index) => <React.Fragment key={course.id}>
        <li className={`discipline-item discipline-${course.id}`}>
          <a href={`mailto:${contact.email}?subject=${encodeURIComponent('Informazioni: ' + course.name)}`} aria-label={`Informazioni su ${course.name}`}><span>{course.name}</span><Arrow diagonal /></a>
        </li>
        {index === 1 && <li className="discipline-image discipline-image--first" role="presentation"><Photo name="disciplineOne" sizes="(max-width: 800px) 50vw, 24vw" /></li>}
        {index === 6 && <li className="discipline-image discipline-image--second" role="presentation"><Photo name="disciplineTwo" sizes="(max-width: 800px) 44vw, 25vw" /></li>}
      </React.Fragment>)}
    </ul>
    <details className="other-disciplines" onToggle={() => ScrollTrigger.refresh()}><summary>Altre attività <span aria-hidden="true">+</span></summary><div><p>Il sito originale cita anche il Kuai. Per informazioni su contenuti e disponibilità, contatta la segreteria.</p><a className="text-link" href={`mailto:${contact.email}?subject=Informazioni%20sulle%20attivit%C3%A0`}>Scrivi alla scuola <Arrow diagonal /></a></div></details>
  </section>;
}

function App() {
  const root = useRef(null);
  const [teachersOpen, setTeachersOpen] = useState(false);
  useGSAP(() => {
    const media = gsap.matchMedia();
    let mounted = true;
    media.add({
      motion: '(prefers-reduced-motion: no-preference)',
      desktop: '(min-width: 1000px)',
    }, context => {
      const { motion, desktop } = context.conditions;
      if (!motion) return;
      const entrance = gsap.timeline({ defaults: { ease: 'power3.out' } });
      entrance.from('.hero-line', {
        yPercent: 108, duration: desktop ? 0.65 : 0.5, stagger: 0.09,
        clearProps: 'transform',
      }, 0);
      // Partial opening keeps the priority image visible while it settles.
      entrance.from('.atlas-image--main .photo-frame', {
        clipPath: 'inset(0 16% 0 0)', duration: desktop ? 0.85 : 0.6,
        ease: 'power3.inOut', clearProps: 'clipPath',
      }, 0.04);
      entrance.from('.atlas-image--detail .photo-frame', {
        clipPath: 'inset(0 0 18% 0)', x: desktop ? -18 : -8,
        duration: desktop ? 0.8 : 0.55, clearProps: 'clipPath,transform',
      }, 0.12);

      gsap.utils.toArray('.stage-photo .photo-frame, .discipline-image .photo-frame').forEach((frame, index) => {
        gsap.from(frame, {
          clipPath: index % 2 ? 'inset(0 0 0 100%)' : 'inset(0 100% 0 0)',
          duration: desktop ? 0.85 : 0.6, ease: 'power3.inOut',
          scrollTrigger: { trigger: frame, start: 'top 94%', once: true },
          clearProps: 'clipPath',
        });
      });
      gsap.utils.toArray('.reveal, .section-intro h2, .stage-heading h2, .contact-headline h2, .discipline-intro h2, .discipline-item').forEach(element => {
        gsap.from(element, {
          y: desktop ? 22 : 12, duration: 0.6, ease: 'power3.out',
          scrollTrigger: { trigger: element, start: 'top 94%', once: true },
          clearProps: 'transform',
        });
      });
      if (desktop) {
        ScrollTrigger.create({
          trigger: '.stage-heading', start: 'top 110px',
          endTrigger: '.stage-gallery', end: 'bottom 75%',
          pin: true, pinSpacing: false,
        });
        gsap.utils.toArray('.stage-photo .photo-frame').forEach(frame => {
          gsap.fromTo(frame, { y: 12 }, {
            y: -12, ease: 'none',
            scrollTrigger: { trigger: frame.closest('.stage-piece'), start: 'top bottom', end: 'bottom top', scrub: 0.45 },
          });
        });
        gsap.to('.atlas-image--detail', {
          y: -24, ease: 'none',
          scrollTrigger: { trigger: '.atlas-hero', start: 'top top', end: 'bottom top', scrub: 0.45 },
        });
      }
    });
    const refresh = () => { if (mounted) ScrollTrigger.refresh(); };
    document.fonts.ready.then(refresh);
    window.addEventListener('load', refresh);
    return () => {
      mounted = false;
      media.revert();
      window.removeEventListener('load', refresh);
    };
  }, { scope: root });

  useEffect(() => { ScrollTrigger.refresh(); }, [teachersOpen]);

  const story = 'Danza, canto e recitazione fanno parte degli spettacoli documentati nell’archivio della scuola.';

  return <div ref={root}>
    <a className="skip-link" href="#contenuto">Vai al contenuto</a>
    <Navigation />
    <main id="contenuto" tabIndex={-1} className="page-shell">
      <section id="inizio" className="atlas-hero" aria-labelledby="hero-title">
        <div className="atlas-meta"><span>Scuola di danza · Roma</span><span>Colli Albani</span></div>
        <h1 className="atlas-title" id="hero-title" aria-label="Crazy Gang School"><span className="atlas-title-row"><span className="hero-line">Crazy Gang</span></span><span className="atlas-title-row"><span className="hero-line">School</span></span></h1>
        <Photo name="heroMain" priority className="atlas-image atlas-image--main" sizes="(max-width: 800px) 78vw, 35vw" />
        <Photo name="heroDetail" className="atlas-image atlas-image--detail" sizes="(max-width: 800px) 40vw, 23vw" />
        <div className="atlas-copy"><p>Informazioni su corsi, <br />orari e disponibilità.</p><a className="text-link" href="#discipline">Vedi le discipline <Arrow diagonal /></a></div>
      </section>

      <section id="scuola" tabIndex={-1} className="school section-pad">
        <div className="school-top"><h2>La scuola</h2><span className="small-location">Roma, Colli Albani <span aria-hidden="true">↗</span></span></div>
        <p className="story-copy">{story}</p>
        <div className="school-foot"><span className="school-rule" /><p>Il sito originale presenta percorsi per bambini e adulti. Per informazioni sulle attività attuali, contatta la segreteria.</p><a href="#insegnanti" className="text-link">Gli insegnanti <Arrow diagonal /></a></div>
      </section>

      <Disciplines />


      <section id="palcoscenico" tabIndex={-1} className="stage section-pad">
        <div className="stage-heading"><span className="eyebrow">Archivio</span><h2>Spettacoli</h2><p>Il sito originale raccoglie saggi, rassegne e fotografie di musical.</p><a className="text-link light" href="https://www.crazygangschool.com/blank" target="_blank" rel="noreferrer">Apri l’archivio storico <Arrow diagonal /><span className="sr-only"> (si apre in una nuova scheda)</span></a><span className="stage-line" aria-hidden="true" /></div>
        <div className="stage-gallery"><div className="stage-piece"><Photo name="stage" className="stage-photo" /></div><div className="stage-piece second"><Photo name="studio" className="stage-photo" /></div><p className="archive-note">Nell’archivio della scuola: Crazy Party, saggi e fotografie dedicate a musical come Sister Act, Dracula e Mary Poppins.</p></div>
      </section>

      <section id="insegnanti" tabIndex={-1} className="teachers section-pad"><div className="section-intro"><div><h2>Insegnanti</h2></div><p>Nomi e ruoli riportati nel sito originale.</p></div><div className="directors"><article className="director reveal"><span>Direzione artistica</span><h3>Marco<br /><strong>Stopponi</strong></h3><p>Coreografo e insegnante</p></article><article className="director reveal"><span>Direzione artistica</span><h3>Stefano<br /><strong>Stopponi</strong></h3><p>Coreografo e insegnante</p></article><aside className="faculty-aside"><span className="large-asterisk" aria-hidden="true">↗</span><button className="text-link" aria-expanded={teachersOpen} aria-controls="faculty-list" onClick={() => setTeachersOpen(!teachersOpen)}>{teachersOpen ? 'Chiudi l’elenco' : 'Gli altri insegnanti'}<span aria-hidden="true">{teachersOpen ? '−' : '+'}</span></button></aside></div><div id="faculty-list" hidden={!teachersOpen}><p className="faculty-note">Docenti presentati nel sito della scuola. Per conoscere il team e le assegnazioni attuali, contatta la segreteria.</p><ul className="faculty-list">{faculty.map(([name, discipline]) => <li key={name}><span>{name}</span><span>{discipline}</span></li>)}</ul></div><p className="verification-note">Ruoli riportati dal sito della scuola; composizione attuale da confermare.</p></section>

      <section className="animation-section"><h2>Animazione</h2><div><p>Il sito originale descrive animazione nei villaggi turistici, spettacoli di magia e feste per bambini e ragazzi.</p><a className="text-link" href={`mailto:${contact.email}?subject=Informazioni%20animazione`}>Informazioni sull’animazione <Arrow diagonal /></a></div></section>

      <section id="contatti" tabIndex={-1} className="contact section-pad"><div className="contact-top"><span className="eyebrow">Informazioni</span><span>Crazy Gang School · Roma</span></div><a className="contact-headline" href={`mailto:${contact.email}`}><h2>Contatti</h2><Arrow diagonal /></a><div className="contact-grid"><p>Per informazioni su attività,<br />orari e disponibilità.</p><div><span className="contact-label">Scrivici o chiamaci</span><a href={`mailto:${contact.email}`}>{contact.email}</a><a href={`tel:${contact.phone}`}>{contact.phone}</a><a className="mobile-number" href={`tel:${contact.mobile}`}>Cell. {contact.mobile}</a></div><div><span className="contact-label">La sede indicata dalla scuola</span><address>{contact.address}</address><span>Metro A · Colli Albani</span><a className="map-link" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contact.address)}`} target="_blank" rel="noreferrer">Apri la mappa <Arrow diagonal /><span className="sr-only"> (nuova scheda)</span></a></div></div><p className="contact-note">Prima di una visita, contatta la scuola per confermare l’apertura e la disponibilità delle attività.</p></section>
    </main>
    <footer className="footer"><div className="footer-top"><Wordmark footer /><p>Crazy Gang School<br />Roma, Colli Albani.</p><div className="social-links"><a href={contact.instagram} target="_blank" rel="noreferrer">Instagram <Arrow diagonal /><span className="sr-only"> (nuova scheda)</span></a><a href={contact.facebook} target="_blank" rel="noreferrer">Facebook <Arrow diagonal /><span className="sr-only"> (nuova scheda)</span></a></div><a className="back-top" href="#inizio">Torna su <Arrow diagonal /></a></div><div className="footer-bottom"><span>Crazy Gang School</span><span>Anteprima locale · fotografie segnaposto e d’archivio</span></div></footer>
  </div>;
}

createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>);


