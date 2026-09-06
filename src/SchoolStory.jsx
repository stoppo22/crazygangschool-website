import { useState } from 'react';
import { StickyScroll } from './components/godui/StickyScroll';
import { contact, photos } from './content';

const mapsSearch = 'https://www.google.com/maps/search/?api=1&query=Largo+Orazi+e+Curiazi+12%2C+Roma';
const mapsEmbed = 'https://maps.google.com/maps?q=Largo%20Orazi%20e%20Curiazi%2012%2C%2000181%20Roma%20RM&t=&z=17&ie=UTF8&iwloc=B&output=embed';

function Arrow() {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 19 19 5M7 5h12v12" stroke="currentColor" strokeWidth="1.7" /></svg>;
}

function StoryImage({ photo, label, placeholder = false }) {
  return <figure className="school-visual__photo" data-placeholder={placeholder ? 'true' : undefined} style={{ '--position': photo.position }}>
    <img src={photo.src} srcSet={photo.srcSet} sizes="(max-width: 820px) 100vw, 48vw" width={photo.width} height={photo.height} alt={photo.alt} loading="lazy" />
    <figcaption>{label}</figcaption>
  </figure>;
}

function SchoolMap() {
  const [interactive, setInteractive] = useState(false);
  return <div className={`school-map ${interactive ? 'is-interactive' : ''}`}>
    <iframe
      src={mapsEmbed}
      title="Mappa Google della sede Crazy Gang School, Largo Orazi e Curiazi 12, Roma"
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      tabIndex={interactive ? 0 : -1}
    />
    {!interactive && <button type="button" onClick={() => setInteractive(true)}>Attiva la mappa</button>}
    {interactive && <button className="school-map__disable" type="button" onClick={() => setInteractive(false)}>Disattiva interazione</button>}
    <a href={mapsSearch} target="_blank" rel="noreferrer">Apri su Google Maps <Arrow /><span className="sr-only"> (nuova scheda)</span></a>
  </div>;
}

export function SchoolStory() {
  const items = [
    {
      title: 'Dal 1985, a Roma.',
      description: <div className="school-copy"><p>Crazy Gang School è a Roma dal 1985. La scuola propone percorsi per bambini, ragazzi e adulti: danza moderna e classica, Hip Hop, Tip Tap, K-Pop, danze latino-americane e Kung Fu.</p><p>Negli anni la scuola ha portato in scena saggi, rassegne, Crazy Party e spettacoli in cui danza, canto e recitazione fanno parte del lavoro sul palco.</p></div>,
      content: <StoryImage photo={photos.studio} label="Fotografia dall’archivio del sito Crazy Gang" />,
    },
    {
      title: 'Dove siamo',
      description: <div className="school-copy school-copy--place"><address>Largo Orazi e Curiazi, 12<br />00181 Roma</address><p><strong>Metro A · Colli Albani</strong><br />A pochi passi dalla stazione.</p><a href={mapsSearch} target="_blank" rel="noreferrer">Apri su Google Maps <Arrow /><span className="sr-only"> (nuova scheda)</span></a></div>,
      content: <SchoolMap />,
    },
    {
      id: 'insegnanti',
      title: 'La direzione artistica',
      description: <ul className="artistic-direction"><li><strong>Marco Stopponi</strong><span>Coreografo, insegnante, direttore artistico</span></li><li><strong>Stefano Stopponi</strong><span>Coreografo, insegnante, direttore artistico</span></li></ul>,
      content: <StoryImage photo={photos.heroDetail} label="Fotografia segnaposto · da sostituire con un ritratto della direzione artistica" placeholder />,
    },
  ];

  return <section id="scuola" className="school-story" tabIndex={-1} aria-label="La scuola, la sede e la direzione artistica">
    <StickyScroll items={items} />
    <p className="school-story__contact">Prima di raggiungere la sede, contatta la scuola: <a href={`mailto:${contact.email}`}>{contact.email}</a></p>
  </section>;
}
