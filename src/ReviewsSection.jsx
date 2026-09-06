const googleProfile = 'https://www.google.com/maps/place/Crazy+Gang+School/@41.8724821,12.5294285,17z/data=!3m1!4b1!4m6!3m5!1s0x132f61f808a89c81:0xe5f28e8c08f3ea59!8m2!3d41.8724821!4d12.5294285!16s%2Fg%2F11cs2v__pm';

function Arrow() {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 19 19 5M7 5h12v12" stroke="currentColor" strokeWidth="1.7" /></svg>;
}

export function ReviewsSection() {
  return <section id="recensioni" className="reviews section-space" tabIndex={-1} aria-labelledby="reviews-title">
    <div className="reviews__inner">
      <header className="reviews__heading reveal"><p>Google Maps</p><h2 id="reviews-title">Recensioni.</h2></header>
      <div className="reviews__summary">
        <div className="reviews__rating" aria-label="Valutazione Google Maps: 4,8 su 5"><strong>4,8</strong><span aria-hidden="true">★★★★★</span></div>
        <div><p>Rating visualizzato sulla scheda Google Maps di Crazy Gang School il 6 settembre 2026.</p><p>Il numero delle recensioni non è disponibile in modo verificabile dalla scheda pubblica consultata.</p></div>
      </div>
      <div className="reviews__unavailable" data-review-status="awaiting-verification">
        <h3>Testi delle recensioni non pubblicati</h3>
        <p>Google Maps non ha reso disponibili autori e testi completi durante la verifica. Questa area resta vuota finché i contenuti non potranno essere controllati direttamente.</p>
      </div>
      <div className="reviews__actions">
        <a href={googleProfile} target="_blank" rel="noreferrer">Leggi tutte le recensioni <Arrow /><span className="sr-only"> (nuova scheda)</span></a>
        <a href={googleProfile} target="_blank" rel="noreferrer">Lascia una recensione <Arrow /><span className="sr-only"> (nuova scheda)</span></a>
      </div>
    </div>
  </section>;
}
