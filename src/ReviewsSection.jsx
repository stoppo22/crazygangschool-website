import { useEffect, useRef, useState } from 'react';
import { contact } from './content';

// TODO(launch): inserire qui solo recensioni verificate una per una sulla scheda
// Google (autore, testo, data, valutazione). Mai testo generato. Finché l'array
// è vuoto il carosello non viene mostrato. Vedi LAUNCH_CHECKLIST.md.
const verifiedReviews = [];

function Arrow({ previous = false }) {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d={previous ? 'M19 12H5m6-6-6 6 6 6' : 'M5 12h14m-6-6 6 6-6 6'} stroke="currentColor" strokeWidth="1.7" /></svg>;
}

function ReviewCarousel({ reviews }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const viewport = useRef(null);
  const touchStart = useRef(null);
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const move = direction => setIndex(current => (current + direction + reviews.length) % reviews.length);

  useEffect(() => {
    if (!reviews.length) return;
    const card = viewport.current?.children[index];
    if (card) viewport.current.scrollTo({ left: card.offsetLeft, behavior: reduceMotion ? 'auto' : 'smooth' });
  }, [index, reduceMotion, reviews.length]);

  useEffect(() => {
    if (reduceMotion || paused || reviews.length < 2) return undefined;
    const timer = window.setInterval(() => move(1), 6000);
    return () => window.clearInterval(timer);
  }, [paused, reduceMotion, reviews.length]);

  if (!reviews.length) return null;

  return <div className="review-carousel" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocusCapture={() => setPaused(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false); }}>
    <div ref={viewport} className="review-carousel__viewport" onTouchStart={event => { touchStart.current = event.touches[0].clientX; }} onTouchEnd={event => { const distance = touchStart.current - event.changedTouches[0].clientX; if (Math.abs(distance) > 45) move(distance > 0 ? 1 : -1); touchStart.current = null; }}>
      {reviews.map(review => <article className="review-card" key={review.id}><div aria-label={`${review.rating} stelle su 5`}>{'★'.repeat(review.rating)}</div><blockquote>{review.text}</blockquote><footer><strong>{review.author}</strong>{review.date && <time dateTime={review.date.iso}>{review.date.label}</time>}</footer></article>)}
    </div>
    <div className="review-carousel__controls" aria-label="Controlli recensioni"><button type="button" onClick={() => move(-1)} aria-label="Recensione precedente"><Arrow previous /></button><span aria-live="polite">{index + 1} di {reviews.length}</span><button type="button" onClick={() => move(1)} aria-label="Recensione successiva"><Arrow /></button></div>
  </div>;
}

export function ReviewsSection() {
  return <section id="recensioni" className="reviews section-space" tabIndex={-1} aria-labelledby="reviews-title">
    <div className="reviews__inner">
      <header className="reviews__heading reveal"><h2 id="reviews-title">Recensioni.</h2><p>Valutazione pubblica su Google Maps</p></header>
      <div className="reviews__summary">
        <div className="reviews__rating" aria-label="Valutazione Google Maps: 4,8 su 5"><strong>4,8</strong><span aria-hidden="true">★★★★★</span></div>
        <div><p>Valutazione media pubblicata sulla scheda Google Maps di Crazy Gang School.</p></div>
      </div>
      <ReviewCarousel reviews={verifiedReviews} />
      <div className="reviews__actions">
        <a href={contact.maps} target="_blank" rel="noreferrer">Leggi tutte le recensioni <Arrow /><span className="sr-only"> (nuova scheda)</span></a>
        <a href={contact.maps} target="_blank" rel="noreferrer">Lascia una recensione <Arrow /><span className="sr-only"> (nuova scheda)</span></a>
      </div>
    </div>
  </section>;
}
