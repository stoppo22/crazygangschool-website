function Arrow() {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 19 19 5M7 5h12v12" stroke="currentColor" strokeWidth="1.7" /></svg>;
}

// Compact band between "Insegnanti" and "Recensioni". AID Musical and Musical
// Passion compaiono sul sito storico della scuola sotto una dicitura di
// ospitalità (CONTEXT.md): qui sono solo due collegamenti esterni, senza alcuna
// affermazione di partnership, sponsorizzazione o collaborazione.
export function GuestsSection() {
  return <section id="ospiti" className="guests" aria-labelledby="guests-title">
    <div className="guests__inner">
      <h2 id="guests-title" className="guests__title">Ospiti della struttura</h2>
      <div className="guests__links">
        <a href="http://www.aidmusical.it/" target="_blank" rel="noreferrer">AID Musical <Arrow /><span className="sr-only"> (nuova scheda)</span></a>
        <a href="https://www.musicalpassionschool.com/" target="_blank" rel="noreferrer">Musical Passion <Arrow /><span className="sr-only"> (nuova scheda)</span></a>
      </div>
    </div>
  </section>;
}
