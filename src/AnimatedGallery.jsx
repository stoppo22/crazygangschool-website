import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { galleryImages } from './gallery-data';
import { TileReveal } from './TileReveal';

function Icon({ direction }) {
  const path = direction === 'close' ? 'M5 5l14 14M19 5 5 19' : direction === 'prev' ? 'M19 12H5m6-6-6 6 6 6' : 'M5 12h14m-6-6 6 6-6 6';
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d={path} stroke="currentColor" strokeWidth="1.7" /></svg>;
}

function GalleryViewer({ initialIndex, returnFocus, onClose }) {
  const [index, setIndex] = useState(initialIndex);
  const [direction, setDirection] = useState(1);
  const dialog = useRef(null);
  const strip = useRef(null);
  const touchStart = useRef(null);
  const reduceMotion = useReducedMotion();
  const compact = typeof window !== 'undefined' && window.matchMedia('(max-width: 820px)').matches;
  const lowMotion = reduceMotion || compact;
  const current = galleryImages[index];
  const move = useCallback(step => {
    setDirection(step);
    setIndex(value => (value + step + galleryImages.length) % galleryImages.length);
  }, []);

  useEffect(() => {
    dialog.current?.querySelector('.gallery-viewer__close')?.focus();
    const onKey = event => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowLeft') move(-1);
      if (event.key === 'ArrowRight') move(1);
      if (event.key === 'Tab') {
        const controls = [...dialog.current.querySelectorAll('button:not([disabled])')];
        const active = controls.indexOf(document.activeElement);
        if (event.shiftKey && active === 0) { event.preventDefault(); controls.at(-1)?.focus(); }
        if (!event.shiftKey && active === controls.length - 1) { event.preventDefault(); controls[0]?.focus(); }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      requestAnimationFrame(() => returnFocus.current?.focus());
    };
  }, [move, onClose, returnFocus]);

  useEffect(() => {
    [-1, 1].forEach(step => { const preload = new Image(); preload.src = galleryImages[(index + step + galleryImages.length) % galleryImages.length].largeSrc; });
    strip.current?.querySelector(`[data-index="${index}"]`)?.scrollIntoView({ behavior: lowMotion ? 'auto' : 'smooth', block: 'nearest', inline: 'center' });
  }, [index, lowMotion]);

  const variants = {
    enter: step => ({ opacity: compact ? 1 : 0, x: lowMotion ? 0 : step > 0 ? '5%' : '-5%', scale: lowMotion ? 1 : .985 }),
    center: { opacity: 1, x: 0, scale: 1 },
    exit: step => ({ opacity: compact ? 1 : 0, x: lowMotion ? 0 : step > 0 ? '-4%' : '4%', scale: lowMotion ? 1 : .99 }),
  };

  return createPortal(<motion.div className="gallery-viewer" role="presentation" initial={reduceMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduceMotion ? 0 : .18 }}>
    <div ref={dialog} className="gallery-viewer__dialog" role="dialog" aria-modal="true" aria-labelledby="gallery-viewer-title">
      <header><strong id="gallery-viewer-title">Galleria</strong><span>{String(index + 1).padStart(2, '0')} / {String(galleryImages.length).padStart(2, '0')}</span><button className="gallery-viewer__close" type="button" onClick={onClose} aria-label="Chiudi foto"><Icon direction="close" /></button></header>
      <div className="gallery-viewer__stage" onTouchStart={event => { touchStart.current = event.touches[0].clientX; }} onTouchEnd={event => { const delta = touchStart.current - event.changedTouches[0].clientX; if (Math.abs(delta) > 45) move(delta > 0 ? 1 : -1); touchStart.current = null; }}>
        <AnimatePresence initial={false} custom={direction} mode="popLayout"><motion.figure key={current.id} custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: lowMotion ? 0 : .24, ease: [0.22, 1, 0.36, 1] }}><img src={current.src} srcSet={current.srcSet} sizes="(max-width: 820px) 100vw, 86vw" width={current.width} height={current.height} alt={current.alt} decoding="async" /><figcaption><span>{current.title}</span><small>{current.category}</small></figcaption></motion.figure></AnimatePresence>
        <button className="gallery-viewer__arrow gallery-viewer__arrow--prev" type="button" onClick={() => move(-1)} aria-label="Foto precedente"><Icon direction="prev" /></button>
        <button className="gallery-viewer__arrow gallery-viewer__arrow--next" type="button" onClick={() => move(1)} aria-label="Foto successiva"><Icon direction="next" /></button>
      </div>
      <div ref={strip} className="gallery-viewer__strip" aria-label="Seleziona una fotografia">{galleryImages.map((image, imageIndex) => <button type="button" key={image.id} data-index={imageIndex} data-active={imageIndex === index ? 'true' : 'false'} onClick={() => { setDirection(imageIndex > index ? 1 : -1); setIndex(imageIndex); }} aria-label={`Mostra ${image.title}, foto ${imageIndex + 1}`} aria-current={imageIndex === index ? 'true' : undefined}><img src={image.src} width="112" height="76" alt="" loading="lazy" decoding="async" /></button>)}</div>
    </div>
  </motion.div>, document.body);
}

function GalleryArchive({ returnFocus, onClose }) {
  const [viewerIndex, setViewerIndex] = useState(null);
  const dialog = useRef(null);
  const photoOpener = useRef(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const pageRoot = document.querySelector('.site-root');
    document.body.style.overflow = 'hidden';
    if (pageRoot) pageRoot.inert = true;
    dialog.current?.querySelector('.gallery-archive__close')?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      if (pageRoot) pageRoot.inert = false;
      requestAnimationFrame(() => returnFocus.current?.focus());
    };
  }, [returnFocus]);

  useEffect(() => {
    if (viewerIndex !== null) return undefined;
    const onKey = event => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'Tab') {
        const controls = [...dialog.current.querySelectorAll('button:not([disabled])')];
        const active = controls.indexOf(document.activeElement);
        if (event.shiftKey && active === 0) { event.preventDefault(); controls.at(-1)?.focus(); }
        if (!event.shiftKey && active === controls.length - 1) { event.preventDefault(); controls[0]?.focus(); }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose, viewerIndex]);

  const openPhoto = (index, trigger) => {
    photoOpener.current = trigger;
    setViewerIndex(index);
  };

  return createPortal(<>
    <motion.div className="gallery-archive" role="presentation" initial={reduceMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduceMotion ? 0 : .2 }}>
      <div ref={dialog} className="gallery-archive__dialog" role="dialog" aria-modal="true" aria-labelledby="gallery-archive-title">
        <header className="gallery-archive__header"><strong id="gallery-archive-title">Archivio fotografico.</strong><button className="gallery-archive__close" type="button" onClick={onClose} aria-label="Chiudi archivio fotografico"><span>Chiudi</span><Icon direction="close" /></button></header>
        <div className="gallery-archive__grid" aria-label="Fotografie Crazy Gang">
          {galleryImages.map((image, index) => <figure className={`gallery-photo${image.height > image.width ? ' gallery-photo--portrait' : ''}`} key={image.id}>
            <button type="button" onClick={(event) => openPhoto(index, event.currentTarget)} aria-label={`Apri ${image.title}, foto ${index + 1} di ${galleryImages.length}`}>
              <img src={image.src} srcSet={image.srcSet} sizes="(max-width: 620px) 100vw, (max-width: 980px) 50vw, 34vw" width={image.width} height={image.height} alt={image.alt} loading="lazy" decoding="async" />
            </button>
            <figcaption><span>{image.title}</span><small>{String(index + 1).padStart(2, '0')}</small></figcaption>
          </figure>)}
        </div>
      </div>
    </motion.div>
    <AnimatePresence>{viewerIndex !== null && <GalleryViewer initialIndex={viewerIndex} returnFocus={photoOpener} onClose={() => setViewerIndex(null)} />}</AnimatePresence>
  </>, document.body);
}

export function AnimatedGallery() {
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  const opener = useRef(null);
  const closeArchive = useCallback(() => setArchiveOpen(false), []);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 680px)');
    const update = () => setCompact(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  const revealSelection = [
    galleryImages[0], galleryImages[1], galleryImages[2], galleryImages[4],
    galleryImages[5], galleryImages[6], galleryImages[9], galleryImages[10],
    galleryImages[12], galleryImages[14], galleryImages[20], galleryImages[21],
  ];
  const revealImages = (compact ? revealSelection.slice(0, 8) : revealSelection).map(image => image.src);

  return <section id="galleria" className="gallery section-space" tabIndex={-1} aria-labelledby="gallery-title">
    <header className="gallery-heading"><h2 id="gallery-title">Galleria.</h2><p>Foto dalla scuola, dai saggi e dagli spettacoli Crazy Gang.</p></header>
    <TileReveal className="gallery-curtain" images={revealImages} columns={compact ? 2 : 3} gap={compact ? 6 : 10} gridWidth={compact ? 520 : 1120} tileAspect={compact ? 1.46 : 1.5} grayscale={false} startAssembled stagger={compact ? 0.035 : 0.045} overlap={0.72} zoom={compact ? 1.45 : 1.62} spread={compact ? 0.2 : 0.3} scrollLength={compact ? 0.45 : 0.55} scrub={compact ? 0.01 : 0.012} backgroundColor="#101011">
      <button ref={opener} className="gallery-curtain__action" type="button" onClick={() => setArchiveOpen(true)} aria-label="Apri l’archivio fotografico">
        <span className="gallery-curtain__copy"><strong>Archivio fotografico.</strong><small>Saggi, spettacoli e vita della scuola.</small></span>
        <span className="gallery-curtain__link">Apri la galleria <Icon direction="next" /></span>
      </button>
    </TileReveal>
    <AnimatePresence>{archiveOpen && <GalleryArchive returnFocus={opener} onClose={closeArchive} />}</AnimatePresence>
  </section>;
}
