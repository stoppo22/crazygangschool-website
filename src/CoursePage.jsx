import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { contact } from './content';
import { courses } from './course-data';
import { applyHead } from './head';
import { SITE_URL, absoluteUrl } from './site';
import { MailIcon, PhoneIcon, InstagramIcon, FacebookIcon, WhatsAppIcon } from './icons';

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

function ScheduleCard({ group, color, style }) {
  return <article className={`schedule-group schedule-group--${color}`} data-schedule-group style={style}>
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
  </article>;
}

function ScheduleGroupList({ groups }) {
  return <div className="course-schedule__list">
    {groups.map((group, index) => <ScheduleCard group={group} color={index % 3} key={group.name} />)}
  </div>;
}

// Two columns sharing one grid: children in column 1, adults in column 2, each
// placed on the grid row matching its position so adjacent cards (same row)
// always stretch to an equal height. DOM order stays grouped (all children,
// then the "Bambini"/"Ragazzi e adulti" title, then all adults) so the mobile
// layout — which drops the grid and reads top to bottom — stays coherent.
function ScheduleColumns({ kids, adults }) {
  return <div className="course-schedule__columns">
    <h3 className="schedule-column__title" style={{ '--col': 1, '--row': 1 }}>Bambini</h3>
    {kids.map((group, index) => <ScheduleCard group={group} color={index % 3} style={{ '--col': 1, '--row': index + 2 }} key={group.name} />)}
    <h3 className="schedule-column__title" style={{ '--col': 2, '--row': 1 }}>Ragazzi e adulti</h3>
    {adults.map((group, index) => <ScheduleCard group={group} color={index % 3} style={{ '--col': 2, '--row': index + 2 }} key={group.name} />)}
  </div>;
}

function CourseSchedule({ course }) {
  const headingId = `${course.slug}-schedule-title`;
  const split = course.scheduleSplitAt;
  return <section className="course-schedule course-reveal" aria-labelledby={headingId}>
    <header className="course-schedule__header">
      <h2 id={headingId}>I nostri corsi</h2>
    </header>
    {split
      ? <ScheduleColumns kids={course.schedule.slice(0, split)} adults={course.schedule.slice(split)} />
      : <ScheduleGroupList groups={course.schedule} />}
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
        .from('.course-hero__title span', { yPercent: 110, duration: .8, clearProps: 'transform' });
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
        <h1 className="course-hero__title"><span>{course.title}</span></h1>
      </section>

      <section className="course-information">
        <CourseSchedule course={course} />
      </section>

      <section className="related-courses course-reveal" aria-labelledby="related-title"><div><p>Continua a esplorare</p><h2 id="related-title">Gli altri corsi</h2></div><div className="related-track">{related.map(item => <a className="related-course" href={`/corsi/${item.slug}`} key={item.slug}><img src={item.image.src} srcSet={item.image.srcSet} sizes="280px" alt="" loading="lazy" /><span>{item.title}</span><Arrow /></a>)}</div></section>

      <section className="course-contact" aria-labelledby="course-contact-title">
        <div className="course-contact__inner">
          <header><h2 id="course-contact-title">Contatti</h2></header>
          <div className="course-contact__channels">
            <a href={`mailto:${contact.email}?subject=${encodeURIComponent(`Informazioni: ${course.title}`)}`}><span className="course-contact__icon"><MailIcon /></span><span className="sr-only">Email: </span><strong>{contact.email}</strong><Arrow /></a>
            <a href={`tel:${contact.phone}`}><span className="course-contact__icon"><PhoneIcon /></span><span className="sr-only">Telefono: </span><strong>06 788 3621</strong><Arrow /></a>
            <a href={contact.instagram} target="_blank" rel="noreferrer"><span className="course-contact__icon"><InstagramIcon /></span><strong>Instagram</strong><Arrow /></a>
            <a href={contact.facebook} target="_blank" rel="noreferrer"><span className="course-contact__icon"><FacebookIcon /></span><strong>Facebook</strong><Arrow /></a>
            <a href={contact.whatsapp} target="_blank" rel="noreferrer"><span className="course-contact__icon"><WhatsAppIcon /></span><strong>WhatsApp</strong><Arrow /></a>
          </div>
        </div>
      </section>
    </main>
    <footer className="course-footer"><a href="/#discipline"><Arrow back /> Torna a tutti i corsi</a><span>Crazy Gang School · Roma, Colli Albani</span><span><a href="/privacy">Privacy</a> · <a href="/cookie">Cookie</a></span></footer>
  </div>;
}
