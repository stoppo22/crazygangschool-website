import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { contact } from './content';
import { courses } from './course-data';
import { applyHead } from './head';
import { SITE_URL, absoluteUrl } from './site';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const shortDays = {
  Lunedì: 'LUN',
  Martedì: 'MAR',
  Mercoledì: 'MER',
  Giovedì: 'GIO',
  Venerdì: 'VEN',
};

function Arrow({ back = false }) {
  return <svg className={back ? 'is-back' : ''} viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 19 19 5M7 5h12v12" stroke="currentColor" strokeWidth="1.7" /></svg>;
}

function CourseImage({ course, sizes }) {
  // TODO(launch): foto stock temporanea, sostituire con foto originale del corso.
  // La didascalia riporta il credito della fonte. Vedi LAUNCH_CHECKLIST.md.
  return <figure className="course-photo" style={{ '--position': course.image.position }}>
    <div><img src={course.image.src} srcSet={course.image.srcSet} sizes={sizes} width={course.image.width} height={course.image.height} alt={course.image.alt} data-placeholder="true" /></div>
    <figcaption>Foto: {course.image.credit}</figcaption>
  </figure>;
}

function FactCard({ title, items, className = '' }) {
  return <article className={`course-fact ${className}`}><h2>{title}</h2><ul>{items.map(item => <li key={item}>{item}</li>)}</ul></article>;
}

function CourseSchedule({ course }) {
  const headingId = `${course.slug}-schedule-title`;
  return <section className="course-schedule course-reveal" aria-labelledby={headingId}>
    <header className="course-schedule__header">
      <p>Giorni e fasce orarie</p>
      <h2 id={headingId}>Orari.</h2>
    </header>
    <div className="course-schedule__list">
      {course.schedule.map(group => <article className="schedule-group" data-schedule-group key={group.name}>
        <header className="schedule-group__identity">
          <h3 data-schedule-name>{group.name}</h3>
          <p>{group.age}{group.level ? <> · <span>{group.level}</span></> : null}</p>
        </header>
        <div className="schedule-group__sessions">
          {group.sessions.map(item => <div className="schedule-session" key={`${item.day}-${item.start}`}>
            <span className="schedule-session__day schedule-session__day--short" aria-hidden="true">{shortDays[item.day]}</span>
            <span className="schedule-session__day schedule-session__day--long">{item.day}</span>
            <p><time dateTime={item.start}>{item.start}</time><span aria-hidden="true"> — </span><span className="sr-only">–</span><time dateTime={item.end}>{item.end}</time></p>
          </div>)}
        </div>
      </article>)}
    </div>
  </section>;
}

export function CoursePage({ course }) {
  const root = useRef(null);
  useEffect(() => {
    const canonical = absoluteUrl(`/corsi/${course.slug}`);
    applyHead({
      title: course.metaTitle || `${course.title} — Crazy Gang School`,
      description: course.metaDescription,
      canonical,
      ogImage: absoluteUrl(course.image.src),
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'Course',
        name: course.title,
        description: course.metaDescription,
        url: canonical,
        inLanguage: 'it',
        courseMode: 'onsite',
        provider: {
          '@type': 'DanceSchool',
          name: 'Crazy Gang School',
          url: `${SITE_URL}/`,
          sameAs: [contact.instagram, contact.facebook],
        },
      },
    });
    window.scrollTo(0, 0);
  }, [course]);

  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.timeline({ defaults: { ease: 'power3.out' } })
        .from('.course-hero__title span', { yPercent: 110, duration: .8, clearProps: 'transform' })
        .from('.course-hero .course-photo>div', { clipPath: 'inset(100% 0 0)', duration: 1, ease: 'power3.inOut', clearProps: 'clipPath' }, .08);
      gsap.utils.toArray('.course-reveal').forEach(element => gsap.from(element, { opacity: 0, y: 28, duration: .7, scrollTrigger: { trigger: element, start: 'top 90%', once: true } }));
      gsap.fromTo('.related-course img', { scale: 1.08 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '.related-courses', start: 'top bottom', end: 'bottom top', scrub: .5 } });
    });
    return () => media.revert();
  }, { scope: root, dependencies: [course.slug] });

  const related = courses.filter(item => item.slug !== course.slug);
  return <div className="course-page" ref={root}>
    <header className="course-nav"><a href="/" className="course-brand" aria-label="Crazy Gang School, home"><img src="/brand/crazy-gang-640.webp" width="2307" height="1157" alt="Crazy Gang School" /></a><a href="/#discipline" className="course-nav__back"><Arrow back /> Tutti i corsi</a><a href={`mailto:${contact.email}?subject=${encodeURIComponent(`Informazioni: ${course.title}`)}`}>Contatta la scuola <Arrow /></a></header>
    <main>
      <section className="course-hero">
        <div className="course-hero__copy"><a href="/#discipline" className="course-back"><Arrow back /> Torna ai corsi</a><h1 className="course-hero__title"><span>{course.title}</span></h1><p>{course.summary}</p></div>
        <CourseImage course={course} sizes="(max-width: 820px) 100vw, 55vw" />
      </section>

      <section className="course-information">
        <div className="course-information__intro course-reveal"><p>Informazioni confermate</p><h2>Il corso,<br />in breve.</h2><p>Età, gruppi e orari riportano le informazioni disponibili nel materiale ufficiale della scuola.</p></div>
        <div className="course-facts course-facts--overview">
          <FactCard title="Fasce d’età" items={course.ages} />
          <FactCard title="Livelli" items={course.levels} className="course-fact--blue" />
          <FactCard title="Percorsi e sottocorsi" items={course.programs} className="course-fact--pink" />
        </div>
        <CourseSchedule course={course} />
      </section>

      <section className="related-courses course-reveal" aria-labelledby="related-title"><div><p>Continua a esplorare</p><h2 id="related-title">Gli altri corsi.</h2></div><div className="related-track">{related.map(item => <a className="related-course" href={`/corsi/${item.slug}`} key={item.slug}><img src={item.image.src} srcSet={item.image.srcSet} sizes="280px" alt="" loading="lazy" /><span>{item.title}</span><Arrow /></a>)}</div></section>

      <section className="course-contact" aria-labelledby="course-contact-title">
        <div className="course-contact__inner">
          <header><p>Canali di contatto</p><h2 id="course-contact-title">Contatti.</h2></header>
          <div className="course-contact__channels">
            <a href={`mailto:${contact.email}?subject=${encodeURIComponent(`Informazioni: ${course.title}`)}`}><span>Email</span><strong>{contact.email}</strong><Arrow /></a>
            <a href={`tel:${contact.phone}`}><span>Telefono</span><strong>06 788 3621</strong><Arrow /></a>
            <a href={contact.instagram} target="_blank" rel="noreferrer"><span>Social</span><strong>Instagram</strong><Arrow /></a>
            <a href={contact.facebook} target="_blank" rel="noreferrer"><span>Social</span><strong>Facebook</strong><Arrow /></a>
            <a href={contact.whatsapp} target="_blank" rel="noreferrer"><span>Social</span><strong>WhatsApp</strong><Arrow /></a>
          </div>
        </div>
      </section>
    </main>
    <footer className="course-footer"><a href="/#discipline"><Arrow back /> Torna a tutti i corsi</a><span>Crazy Gang School · Roma, Colli Albani</span><span><a href="/privacy">Privacy</a> · <a href="/cookie">Cookie</a></span></footer>
  </div>;
}
