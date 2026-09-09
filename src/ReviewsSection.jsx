import { useEffect, useRef, useState } from 'react';
import { contact } from './content';

// Recensioni pubbliche trascritte a mano dalla scheda Google ufficiale
// (contact.maps → CID 0x132f61f808a89c81:0xe5f28e8c08f3ea59, Largo Orazi e
// Curiazi 12, Roma), verificate una per una il 9 settembre 2026. Testo fedele,
// nessuna riscrittura; "[…]" segnala un taglio in una recensione lunga. Le date
// non sono pubblicate perché diverse recensioni sono datate. Ogni voce:
// { id, author, rating, text, date?: { iso, label } }.
const verifiedReviews = [
  {
    id: 'martina',
    author: 'Martina',
    rating: 5,
    text:
      'Amo la scuola e amo loro. Scuola impeccabile! Sale spaziose e numerose. I ragazzi sono seguiti attentamente e con serietà mettendo a proprio agio gli allievi, indirizzandoli professionalmente da insegnanti di grande spessore. […] Consiglio fortemente. Reputo che sia la scuola migliore di Roma per formare i ragazzi.',
  },
  {
    id: 'enrica-ritorto',
    author: 'Enrica Ritorto',
    rating: 5,
    text: 'Una grande scuola...una grande famiglia, valore che va oltre lo sport!',
  },
  {
    id: 'pasquale-provetta',
    author: 'Pasquale Provetta',
    rating: 5,
    text:
      'Corso di Hung Gar (Kungfu) con insegnanti preparatissimi che fanno corsi sia ai bambini e sia agli adulti... Il sifu ottimo insegnante per i bambini ed adulti... Stile consigliato a tutti i tipi di età',
  },
  {
    id: 'maria-antonella-bizzarri',
    author: 'Maria Antonella Bizzarri',
    rating: 5,
    text: 'Bravi insegnanti. Spettacoli favolosi',
  },
  {
    id: 'fabiola-cossuto',
    author: 'Fabiola Cossuto',
    rating: 5,
    text: 'Una delle migliori scuole di danza della capitale.',
  },
];

function Arrow({ previous = false }) {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d={previous ? 'M19 12H5m6-6-6 6 6 6' : 'M5 12h14m-6-6 6 6-6 6'} stroke="currentColor" strokeWidth="1.7" /></svg>;
}

function ReviewCarousel({ reviews }) {
  const [page, setPage] = useState(0);
  const [paused, setPaused] = useState(false);
  const [perView, setPerView] = useState(() => (window.matchMedia('(max-width: 820px), (hover: none)').matches ? 1 : 3));
  const touchStart = useRef(null);
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const pageCount = Math.max(1, Math.ceil(reviews.length / perView));
  const currentPage = Math.min(page, pageCount - 1);
  // Index of the first card to show. On the last page it is clamped so the strip
  // ends flush with the final review instead of leaving an empty slot.
  const first = Math.max(0, Math.min(currentPage * perView, reviews.length - perView));
  const move = direction => setPage(current => (Math.min(current, pageCount - 1) + direction + pageCount) % pageCount);

  useEffect(() => {
    const query = window.matchMedia('(max-width: 820px), (hover: none)');
    const update = () => setPerView(query.matches ? 1 : 3);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (page > pageCount - 1) setPage(pageCount - 1);
  }, [page, pageCount]);

  useEffect(() => {
    if (reduceMotion || paused || pageCount < 2) return undefined;
    const timer = window.setInterval(() => move(1), 6000);
    return () => window.clearInterval(timer);
  }, [paused, reduceMotion, pageCount]);

  if (!reviews.length) return null;

  const swipeEnd = event => {
    if (pageCount < 2 || touchStart.current == null) return;
    const distance = touchStart.current - event.changedTouches[0].clientX;
    if (Math.abs(distance) > 45) move(distance > 0 ? 1 : -1);
    touchStart.current = null;
  };

  return <div className="review-carousel" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocusCapture={() => setPaused(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false); }}>
    <div className="review-carousel__window" onTouchStart={event => { touchStart.current = event.touches[0].clientX; }} onTouchEnd={swipeEnd}>
      <div className="review-carousel__track" style={{ '--first': first }} data-motion={reduceMotion ? 'off' : undefined}>
        {reviews.map(review => <article className="review-card" key={review.id}><div className="review-card__stars" aria-label={`${review.rating} stelle su 5`}>{'★'.repeat(review.rating)}</div><blockquote>{review.text}</blockquote><footer><strong>{review.author}</strong>{review.date && <time dateTime={review.date.iso}>{review.date.label}</time>}<small className="review-card__source">Recensione Google</small></footer></article>)}
      </div>
    </div>
    {pageCount > 1 && <div className="review-carousel__controls" aria-label="Controlli recensioni"><button type="button" onClick={() => move(-1)} aria-label="Recensioni precedenti"><Arrow previous /></button><span aria-live="polite">{currentPage + 1} di {pageCount}</span><button type="button" onClick={() => move(1)} aria-label="Recensioni successive"><Arrow /></button></div>}
  </div>;
}

export function ReviewsSection() {
  return <section id="recensioni" className="reviews section-space" tabIndex={-1} aria-labelledby="reviews-title">
    <div className="reviews__inner">
      <header className="reviews__heading reveal"><h2 id="reviews-title">Recensioni</h2><p>Valutazione pubblica su Google Maps</p></header>
      <div className="reviews__summary">
        <div className="reviews__rating" aria-label="Valutazione Google Maps: 4,8 su 5"><strong>4,8</strong><span aria-hidden="true">★★★★★</span></div>
        <div><p>Valutazione media pubblicata sulla scheda Google Maps di Crazy Gang School.</p></div>
      </div>
      <ReviewCarousel reviews={verifiedReviews} />
      {/* Una sola CTA alla scheda Google: non è stato possibile ricavare un URL
          specifico e verificato per scrivere una recensione. */}
      <div className="reviews__actions">
        <a href={contact.maps} target="_blank" rel="noreferrer">Leggi tutte le recensioni <Arrow /><span className="sr-only"> (nuova scheda)</span></a>
      </div>
    </div>
  </section>;
}
