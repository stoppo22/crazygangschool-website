import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { faculty } from './content';
import { Accordion } from './components/godui/Accordion';

function TeacherPhoto({ teacher, mobile = false }) {
  return <figure className={`faculty-photo ${mobile ? 'faculty-photo--mobile' : ''}`}><img src={teacher.image.src} width={teacher.image.width} height={teacher.image.height} alt={teacher.image.alt} loading="lazy" style={{ '--teacher-position': teacher.image.position }} /><figcaption>Fotografia dal sito ufficiale Crazy Gang School</figcaption></figure>;
}
function TeacherProfile({ teacher, mobile = false }) {
  return <div className={`faculty-profile ${mobile ? 'faculty-profile--mobile' : ''}`}><TeacherPhoto teacher={teacher} mobile={mobile} /><div className="faculty-preview__identity"><strong>{teacher.name}</strong><span>{teacher.role}</span></div></div>;
}
function ArtisticDirection() {
  return <div className="direction" aria-labelledby="direction-title"><h3 id="direction-title">La direzione artistica</h3><div>{faculty.slice(0, 2).map(person => <article key={person.id}><strong>{person.name}</strong><span>Direttore artistico</span></article>)}</div></div>;
}
export function FacultySection() {
  const [selected, setSelected] = useState(faculty[0].id);
  const [preview, setPreview] = useState(null);
  const [listOpen, setListOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const selectedTeacher = faculty.find(teacher => teacher.id === selected) ?? faculty[0];
  const activeTeacher = faculty.find(teacher => teacher.id === (preview ?? selected)) ?? selectedTeacher;
  const items = useMemo(() => faculty.map(teacher => ({ value: teacher.id, title: <span className="faculty-row"><span className="faculty-row__name">{teacher.name}</span><span className="faculty-row__line" aria-hidden="true" /></span>, content: null })), []);
  const selectTeacher = value => { if (value) { setSelected(value); setListOpen(false); } };
  return <section id="docenti" className="faculty section-space" tabIndex={-1} aria-labelledby="faculty-title">
    <header className="faculty-heading reveal"><h2 id="faculty-title">Insegnanti.</h2><p>Elenco e discipline pubblicati sul sito ufficiale della scuola. La composizione attuale è da confermare.</p></header>
    <ArtisticDirection />
    <div className="faculty-selector">
      <div className="faculty-mobile-profile" aria-live="polite"><TeacherProfile teacher={selectedTeacher} mobile /></div>
      <button className="faculty-disclosure" type="button" aria-expanded={listOpen} aria-controls="faculty-list" onClick={() => setListOpen(open => !open)}><span>{listOpen ? 'Chiudi elenco insegnanti' : 'Vedi tutti gli insegnanti'}</span><i aria-hidden="true">{listOpen ? '−' : '+'}</i></button>
      <Accordion id="faculty-list" data-mobile-open={listOpen ? 'true' : 'false'} className="faculty-list" items={items} value={selected} onValueChange={selectTeacher} onPreviewChange={setPreview} collapsible={false} animation="smooth" aria-label="Seleziona un insegnante" />
      <div className="faculty-preview" aria-live="polite"><AnimatePresence mode="wait" initial={false}><motion.div key={activeTeacher.id} className="faculty-preview__frame" initial={reduceMotion ? false : { opacity: 0, clipPath: 'inset(0 0 10% 0)', scale: 1.025 }} animate={{ opacity: 1, clipPath: 'inset(0 0 0% 0)', scale: 1 }} exit={reduceMotion ? undefined : { opacity: 0, clipPath: 'inset(10% 0 0 0)' }} transition={reduceMotion ? { duration: 0 } : { duration: .42, ease: [0.22, 1, 0.36, 1] }}><TeacherProfile teacher={activeTeacher} /></motion.div></AnimatePresence></div>
    </div>
  </section>;
}
