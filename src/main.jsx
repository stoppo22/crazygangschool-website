import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { contact, photos } from './content';
import { courses, findCourse } from './course-data';
import { CourseAccordion } from './CourseAccordion';
import { CoursePage } from './CoursePage';
import { MagicTab } from './components/godui/MagicTab';
import { FacultySection } from './FacultySection';
import { ReviewsSection } from './ReviewsSection';
import { LocationSection } from './LocationSection';
import './styles.css';
import './sections.css';
import './chapters.css';
import './responsive.css';
import './courses.css';
import './magic-tab.css';
import './faculty.css';
import './reviews.css';
import './location.css';

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
  const [activeSection, setActiveSection] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const panel = useRef(null);
  const toggle = useRef(null);
  const links = [
    { value: 'scuola', label: 'La scuola', href: '#inizio' },
    { value: 'corsi', label: 'Corsi', href: '#discipline' },
    { value: 'insegnanti', label: 'Insegnanti', href: '#docenti' },
    { value: 'recensioni', label: 'Recensioni', href: '#recensioni' },
    { value: 'dove-siamo', label: 'Dove siamo', href: '#dove-siamo' },
    { value: 'contatti', label: 'Contatti', href: '#contatti' },
  ];
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setScrolled(window.scrollY > 20);
      const marker = Math.min(260, window.innerHeight * .34);
      const zones = links;
      const current = zones.find(item => {
        const rect = document.querySelector(item.href)?.getBoundingClientRect();
        return rect && rect.top <= marker && rect.bottom > marker;
      })?.value ?? null;
      setActiveSection(previous => previous === current ? previous : current);
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); };
  }, []);
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
  return <header className={`site-header ${open ? 'is-open' : ''} ${scrolled ? 'is-scrolled' : ''}`}><div className="nav-shell"><Brand onNavigate={close} /><MagicTab className="desktop-nav" aria-label="Navigazione principale" items={links} value={activeSection} onValueChange={setActiveSection} /><a className="nav-cta" href={`mailto:${contact.email}`}>Contattaci <Arrow /></a><button ref={toggle} className="menu-toggle" type="button" aria-expanded={open} aria-controls="menu-mobile" onClick={() => setOpen(value => !value)}><span>{open ? 'Chiudi' : 'Menu'}</span><i aria-hidden="true" /></button></div><nav ref={panel} id="menu-mobile" className="mobile-nav" aria-label="Navigazione mobile" hidden={!open}>{links.map(item => <a key={item.href} href={item.href} onClick={close}>{item.label}<Arrow /></a>)}<a className="mobile-nav__cta" href={`mailto:${contact.email}`} onClick={close}>Contattaci <Arrow /></a><p>Crazy Gang School<br />Roma, Colli Albani</p></nav></header>;
}

function Marquee() {
  const names = courses.map(item => item.title).join(' · ');
  return <div className="marquee" aria-label={`Discipline: ${names}`}><div className="marquee__track" aria-hidden="true"><span>{names} · </span><span>{names} · </span></div></div>;
}

function App() {
  const root = useRef(null);
  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add({ motion: '(prefers-reduced-motion: no-preference)' }, ({ conditions }) => {
      if (!conditions.motion) return;
      gsap.timeline({ defaults: { ease: 'power3.out' } })
        .from('.hero-title__line span', { yPercent: 110, duration: .8, stagger: .09, clearProps: 'transform' })
        .from('.hero-photo .photo__frame', { clipPath: 'inset(0 0 100% 0)', duration: 1, ease: 'power3.inOut', clearProps: 'clipPath' }, .12)
        .from('.hero-aside > *', { opacity: 0, y: 18, duration: .55, stagger: .08 }, .35);
      gsap.utils.toArray('.reveal').forEach(element => gsap.from(element, { y: 34, opacity: 0, duration: .75, ease: 'power3.out', scrollTrigger: { trigger: element, start: 'top 90%', once: true } }));
      gsap.utils.toArray('.photo:not(.hero-photo) .photo__frame').forEach(frame => gsap.fromTo(frame, { scale: .86 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: frame, start: 'top 95%', end: 'center 55%', scrub: .55 } }));
    });
    const refresh = () => ScrollTrigger.refresh();
    document.fonts.ready.then(refresh);
    window.addEventListener('load', refresh);
    return () => { media.revert(); window.removeEventListener('load', refresh); };
  }, { scope: root });

  return <div ref={root} className="site-root">
    <a className="skip-link" href="#contenuto">Vai al contenuto</a>
    <Navigation />
    <main id="contenuto" tabIndex={-1}>
      <section id="inizio" className="hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <div className="hero-kicker"><span>Danza e discipline di movimento</span><span>Bambini · ragazzi · adulti</span></div>
          <div className="hero-main"><h1 id="hero-title" className="hero-title"><span className="hero-title__line"><span>Dal 1985, a Roma.</span></span><span className="hero-title__line hero-title__line--accent"><span>Crazy Gang School</span></span></h1><div className="hero-description"><p>La scuola propone percorsi di danza moderna e classica, Hip Hop, Tip Tap, K-Pop, danze latino-americane e Kung Fu per bambini, ragazzi e adulti.</p><p>Il lavoro prosegue sul palco attraverso saggi, rassegne, Crazy Party e spettacoli che riuniscono danza, canto e recitazione.</p></div></div>
          <div className="hero-actions"><a className="button button--acid" href="#discipline">Scopri le discipline <Arrow /></a><a className="text-action" href="#contatti">Parla con la scuola <Arrow /></a></div>
        </div>
        <div className="hero-visual"><Photo name="heroMain" className="hero-photo" priority sizes="(max-width: 820px) 100vw, 43vw" /></div>
      </section>
      <Marquee />

      <section id="discipline" className="disciplines section-space" tabIndex={-1} aria-labelledby="discipline-title">
        <div className="section-heading section-heading--wide reveal"><p>I corsi principali</p><h2 id="discipline-title">Scopri<br />i corsi.</h2><p className="section-note">Apri un corso per vedere le informazioni disponibili. Gli orari sono in aggiornamento.</p></div>
        <CourseAccordion courses={courses} />
      </section>

      <FacultySection />
      <ReviewsSection />
      <LocationSection />

      <section id="contatti" className="contact" tabIndex={-1} aria-labelledby="contact-title">
        <div className="contact__inner">
          <div className="contact-intro"><p>Canali di contatto</p><h2 id="contact-title">Contatti.</h2></div>
          <div className="contact-channels">
            <a className="contact-channel" href={`mailto:${contact.email}`}><span>Email</span><strong>{contact.email}</strong><Arrow /></a>
            <div className="contact-channel contact-channel--phones"><span>Telefono</span><div><a href={`tel:${contact.phone}`}>06 788 3621</a><a href={`tel:${contact.mobile}`}>333 402 7525</a></div><Arrow /></div>
            <a className="contact-channel" href={contact.instagram} target="_blank" rel="noreferrer"><span>Social</span><strong>Instagram</strong><Arrow /><span className="sr-only"> (nuova scheda)</span></a>
            <a className="contact-channel" href={contact.facebook} target="_blank" rel="noreferrer"><span>Social</span><strong>Facebook</strong><Arrow /><span className="sr-only"> (nuova scheda)</span></a>
            <div className="contact-channel contact-channel--pending" data-future-channel="whatsapp"><span>WhatsApp Business</span><strong>Non ancora attivo</strong></div>
          </div>
        </div>
      </section>
    </main>
    <footer className="footer"><Brand footer /><p>Crazy Gang School<br />Roma, Colli Albani</p><div><a href={contact.instagram} target="_blank" rel="noreferrer">Instagram <Arrow /></a><a href={contact.facebook} target="_blank" rel="noreferrer">Facebook <Arrow /></a></div><a href="#inizio">Torna su <Arrow down /></a><small>Anteprima locale · fotografie segnaposto e materiali d’archivio da verificare</small></footer>
  </div>;
}

const selectedCourse = findCourse(window.location.pathname);
createRoot(document.getElementById('root')).render(<React.StrictMode>{selectedCourse ? <CoursePage course={selectedCourse} /> : <App />}</React.StrictMode>);
