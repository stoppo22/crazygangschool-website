import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { faculty } from './content';
import { Accordion } from './components/godui/Accordion';

function TeacherPhoto({ teacher, mobile = false }) {
  return <figure className={`faculty-photo ${mobile ? 'faculty-photo--mobile' : ''}`}><img src={teacher.image.src} width={teacher.image.width} height={teacher.image.height} alt={teacher.image.alt} loading="lazy" style={{ '--teacher-position': teacher.image.position }} /><figcaption>Fotografia dal sito ufficiale Crazy Gang School</figcaption></figure>;
}

export function FacultySection() {
  const [selected, setSelected] = useState(faculty[0].id);
  const [preview, setPreview] = useState(null);
  const reduceMotion = useReducedMotion();
  const activeTeacher = faculty.find(teacher => teacher.id === (preview ?? selected)) ?? faculty[0];
  const items = useMemo(() => faculty.map(teacher => ({ value: teacher.id, title: <span className="faculty-row"><span className="faculty-row__name">{teacher.name}</span><span className="faculty-row__role">{teacher.role}</span><span className="faculty-row__line" aria-hidden="true" /></span>, content: <TeacherPhoto teacher={teacher} mobile /> })), []);
  return <section id="docenti" className="faculty section-space" tabIndex={-1} aria-labelledby="faculty-title">
    <header className="faculty-heading reveal"><p>Il corpo insegnanti</p><h2 id="faculty-title">Insegnanti.</h2><p>Elenco e discipline pubblicati sul sito ufficiale della scuola. La composizione attuale è da confermare.</p></header>
    <div className="faculty-selector">
      <Accordion className="faculty-list" items={items} value={selected} onValueChange={value => { if (value) setSelected(value); }} onPreviewChange={setPreview} collapsible={false} animation="smooth" aria-label="Seleziona un insegnante" />
      <div className="faculty-preview" aria-live="polite"><AnimatePresence mode="wait" initial={false}><motion.div key={activeTeacher.id} className="faculty-preview__frame" initial={reduceMotion ? false : { opacity: 0, clipPath: 'inset(0 0 10% 0)', scale: 1.025 }} animate={{ opacity: 1, clipPath: 'inset(0 0 0% 0)', scale: 1 }} exit={reduceMotion ? undefined : { opacity: 0, clipPath: 'inset(10% 0 0 0)' }} transition={reduceMotion ? { duration: 0 } : { duration: .42, ease: [0.22, 1, 0.36, 1] }}><TeacherPhoto teacher={activeTeacher} /><div className="faculty-preview__identity"><strong>{activeTeacher.name}</strong><span>{activeTeacher.role}</span></div></motion.div></AnimatePresence></div>
    </div>
  </section>;
}
