import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

function PanelArrow() {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 19 19 5M7 5h12v12" stroke="currentColor" strokeWidth="1.7" /></svg>;
}

export function CourseAccordion({ courses }) {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const [mobile, setMobile] = useState(() => window.matchMedia('(max-width: 820px)').matches);
  useEffect(() => {
    const query = window.matchMedia('(max-width: 820px)');
    const update = event => setMobile(event.matches);
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  return <div className="course-accordion" role="list" aria-label="Corsi principali">
    {courses.map((course, index) => <motion.a
      className="course-panel"
      data-active={active === index ? 'true' : 'false'}
      href={`/corsi/${course.slug}`}
      key={course.slug}
      role="listitem"
      aria-expanded={active === index}
      aria-label={`${course.title}. ${course.preview}`}
      onMouseEnter={() => setActive(index)}
      onFocus={() => setActive(index)}
      style={{ '--image-position': course.image.position }}
      initial={mobile && !reduce ? { opacity: 0, y: 28, scale: .975 } : false}
      whileInView={mobile ? { opacity: 1, y: 0, scale: 1 } : undefined}
      viewport={{ once: true, amount: .16 }}
      transition={reduce ? { duration: 0 } : { duration: .64, ease: [0.22, 1, 0.36, 1] }}
    >
      <img
        src={course.image.src}
        srcSet={course.image.srcSet}
        sizes="(max-width: 820px) calc(100vw - 46px), 55vw"
        width={course.image.width}
        height={course.image.height}
        alt={course.image.alt}
        loading="lazy"
        data-placeholder="true"
      />
      <span className="course-panel__shade" aria-hidden="true" />
      <span className="course-panel__placeholder">Foto segnaposto</span>
      <span className="course-panel__compact">{course.title}</span>
      <span className="course-panel__content"><strong>{course.title}</strong><small>{course.preview}</small><span>Apri il corso <PanelArrow /></span></span>
    </motion.a>)}
  </div>;
}
