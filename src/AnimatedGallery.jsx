import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { galleryImages } from './gallery-data';

const GalleryScrollContext = createContext(null);

function ContainerScroll({ children, staticMode = false }) {
  const target = useRef(null);
  const { scrollYProgress } = useScroll({ target, offset: ['start start', 'end end'] });
  return <GalleryScrollContext.Provider value={scrollYProgress}><div ref={target} className={`gallery-scroll ${staticMode ? 'is-static' : ''}`}>{children}</div></GalleryScrollContext.Provider>;
}
function ContainerSticky({ children }) { return <div className="gallery-sticky">{children}</div>; }
function GalleryContainer({ children }) { return <div className="gallery-columns">{children}</div>; }
function GalleryCol({ children, yRange, className = '' }) {
  const progress = useContext(GalleryScrollContext);
  const y = useTransform(progress, [0, 1], yRange);
  return <motion.div className={`gallery-column ${className}`} style={{ y }}>{children}</motion.div>;
}
function Icon({ direction }) {
  const path = direction === 'close' ? 'M5 5l14 14M19 5 5 19' : direction === 'prev' ? 'M19 12H5m6-6-6 6 6 6' : 'M5 12h14m-6-6 6 6-6 6';
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d={path} stroke="currentColor" strokeWidth="1.7" /></svg>;
}

function Lightbox({ index, onChange, onClose, returnFocus }) {
  const dialog = useRef(null);
  const touchStart = useRef(null);
  const image = galleryImages[index];
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.current?.querySelector('.lightbox__close')?.focus();
    const onKey = event => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowLeft') onChange(-1);
      if (event.key === 'ArrowRight') onChange(1);
      if (event.key === 'Tab') {
        const controls = [...dialog.current.querySelectorAll('button')];
        const current = controls.indexOf(document.activeElement);
        if (event.shiftKey && current === 0) { event.preventDefault(); controls.at(-1)?.focus(); }
        if (!event.shiftKey && current === controls.length - 1) { event.preventDefault(); controls[0]?.focus(); }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKey);
      returnFocus.current?.focus();
    };
  }, [returnFocus]);
  return createPortal(<div className="lightbox" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) onClose(); }}>
    <div ref={dialog} className="lightbox__dialog" role="dialog" onMouseDown={event => { if (event.target === event.currentTarget) onClose(); }} aria-modal="true" aria-label={`Immagine ${index + 1} di ${galleryImages.length}`} onTouchStart={event => { touchStart.current = event.touches[0].clientX; }} onTouchEnd={event => { const delta = touchStart.current - event.changedTouches[0].clientX; if (Math.abs(delta) > 45) onChange(delta > 0 ? 1 : -1); }}>
      <button className="lightbox__close" type="button" onClick={onClose} aria-label="Chiudi galleria"><Icon direction="close" /></button>
      <button className="lightbox__nav lightbox__nav--prev" type="button" onClick={() => onChange(-1)} aria-label="Immagine precedente"><Icon direction="prev" /></button>
      <figure><img key={image.id} src={image.largeSrc} width={image.width} height={image.height} alt={image.alt} decoding="async" /><figcaption><span>{image.title}</span><small>{image.category}</small></figcaption></figure>
      <span className="lightbox__index">{String(index + 1).padStart(2, '0')} / {String(galleryImages.length).padStart(2, '0')}</span>
      <button className="lightbox__nav lightbox__nav--next" type="button" onClick={() => onChange(1)} aria-label="Immagine successiva"><Icon direction="next" /></button>
    </div>
  </div>, document.body);
}

export function AnimatedGallery() {
  const [openIndex, setOpenIndex] = useState(null);
  const returnFocus = useRef(null);
  const reduced = useReducedMotion();
  const columns = [[], [], []];
  galleryImages.forEach((image, index) => columns[index % 3].push({ image, index }));
  const open = (index, element) => { returnFocus.current = element; setOpenIndex(index); };
  const change = direction => setOpenIndex(current => (current + direction + galleryImages.length) % galleryImages.length);
  const content = <GalleryContainer>{columns.map((column, columnIndex) => <GalleryCol key={columnIndex} className={`gallery-column--${columnIndex + 1}`} yRange={reduced ? ['0%', '0%'] : columnIndex === 1 ? ['-5%', '28%'] : ['0%', '-52%']}>
    {column.map(({ image, index }) => <button className="gallery-image" type="button" key={image.id} onClick={event => open(index, event.currentTarget)} aria-label={`Apri ${image.title}, immagine ${index + 1} di ${galleryImages.length}`} style={{ '--image-ratio': `${image.width}/${image.height}` }}><img src={image.src} srcSet={image.srcSet} sizes="(max-width: 700px) 46vw, 31vw" width={image.width} height={image.height} alt={image.alt} loading="lazy" decoding="async" /><span>{image.title}</span></button>)}
  </GalleryCol>)}</GalleryContainer>;
  return <section id="galleria" className={`gallery ${reduced ? 'is-reduced' : ''}`} tabIndex={-1} aria-labelledby="gallery-title">
    <header className="gallery-heading"><h2 id="gallery-title">Galleria.</h2><p>Foto dalla scuola, dai saggi e dagli spettacoli Crazy Gang.</p></header>
    {reduced ? <ContainerScroll staticMode><div className="gallery-static">{content}</div></ContainerScroll> : <ContainerScroll><ContainerSticky>{content}</ContainerSticky></ContainerScroll>}
    {openIndex !== null && <Lightbox index={openIndex} onChange={change} onClose={() => setOpenIndex(null)} returnFocus={returnFocus} />}
  </section>;
}
