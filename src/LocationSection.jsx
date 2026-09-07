import { useState } from 'react';
import { contact } from './content';

function Arrow() {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 19 19 5M7 5h12v12" stroke="currentColor" strokeWidth="1.7" /></svg>;
}

export function LocationSection() {
  const [interactive, setInteractive] = useState(false);
  return <section id="dove-siamo" className="location section-space" tabIndex={-1} aria-labelledby="location-title">
    <div className="location__inner">
      <div className="location__copy reveal">
        <h2 id="location-title">Dove siamo</h2>
        <address><strong>Crazy Gang School</strong><span>{contact.address}</span><span>{contact.city}</span></address>
        <p className="location__metro">{contact.metro}</p>
        <p>A pochi passi dalla fermata Metro A Colli Albani.</p>
        <a href={contact.maps} target="_blank" rel="noreferrer">Apri su Google Maps <Arrow /><span className="sr-only"> (nuova scheda)</span></a>
      </div>
      <div className={`location-map ${interactive ? 'is-interactive' : ''}`}>
        <iframe title="Mappa di Crazy Gang School a Roma" src={contact.mapsEmbed} loading="lazy" referrerPolicy="no-referrer-when-downgrade" tabIndex={interactive ? 0 : -1} />
        {!interactive && <button type="button" onClick={() => setInteractive(true)}>Attiva la mappa</button>}
        {interactive && <button className="location-map__disable" type="button" onClick={() => setInteractive(false)}>Disattiva interazione</button>}
      </div>
    </div>
  </section>;
}
