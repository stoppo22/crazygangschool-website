const image = (file, width, height, alt, credit, source, position = '50% 50%') => ({
  src: `/images/courses/${file}-1200.webp`,
  srcSet: [640, 1200, 1800].map(size => `/images/courses/${file}-${size}.webp ${size}w`).join(', '),
  width, height, alt, credit, source, position,
});

const session = (day, start, end) => ({ day, start, end });

export const courses = [
  {
    slug: 'danza-moderna',
    title: 'Danza Moderna',
    preview: 'Gioco danza 3–4 anni · Moderna dai 5 anni',
    metaTitle: 'Corso di Danza Moderna a Roma — Crazy Gang School',
    metaDescription:
      'Gioco danza 3–4 anni e danza moderna dai 5 anni per bambini, ragazzi e adulti, tutti i livelli, alla Crazy Gang School di Roma (Colli Albani).',
    summary: 'Gioco danza per i più piccoli e danza moderna per bambini e ragazzi.',
    ages: ['Gioco danza: 3–4 anni', 'Bambini: dai 5 anni compiuti', 'Ragazzi e adulti: gruppi divisi per età'],
    levels: ['Principianti', 'Intermedio', 'Avanzato'],
    programs: ['Gioco danza', 'Danza moderna bambini', 'Danza moderna ragazzi e adulti'],
    schedule: [
      { name: 'Mini', age: '3–4 anni', sessions: [session('Venerdì', '17:00', '18:00')] },
      { name: 'Topini', age: '5–6 anni', sessions: [session('Mercoledì', '17:00', '18:00')] },
      { name: 'Koala', age: '6–7 anni', sessions: [session('Martedì', '17:00', '18:00'), session('Giovedì', '17:00', '18:00')] },
      { name: 'Panda', age: '7–9 anni', sessions: [session('Martedì', '17:00', '18:00'), session('Giovedì', '17:00', '18:00')] },
      { name: 'Junior', age: '9–11 anni', level: 'Avanzato', sessions: [session('Martedì', '18:00', '19:00'), session('Giovedì', '18:00', '19:00'), session('Venerdì', '17:00', '18:30')] },
      { name: 'Special D Red', age: '10+ anni', level: 'Avanzato', sessions: [session('Lunedì', '17:00', '18:30'), session('Mercoledì', '18:00', '19:30'), session('Venerdì', '18:30', '19:30')] },
      { name: 'Special D Blue', age: '10+ anni', level: 'Avanzato', sessions: [session('Lunedì', '18:00', '19:30'), session('Mercoledì', '17:00', '18:30'), session('Venerdì', '18:30', '19:30')] },
      { name: 'Teenagers', age: '11–15 anni', level: 'Principianti', sessions: [session('Martedì', '19:00', '20:00'), session('Giovedì', '19:00', '20:00')] },
      { name: 'Intermedi', age: '14+ anni', sessions: [session('Lunedì', '18:00', '19:30'), session('Mercoledì', '18:00', '19:30')] },
      { name: 'Special B', age: '14+ anni', sessions: [session('Lunedì', '16:30', '18:00'), session('Mercoledì', '16:30', '18:00'), session('Venerdì', '18:00', '19:00')] },
      { name: 'Special A', age: '14+ anni', sessions: [session('Lunedì', '20:00', '21:30'), session('Mercoledì', '20:00', '21:30'), session('Venerdì', '19:00', '20:30')] },
      { name: 'Over avanzato', age: 'Adulti', sessions: [session('Martedì', '20:00', '21:30')] },
      { name: 'Over principianti', age: 'Adulti', sessions: [session('Giovedì', '20:00', '21:00')] },
    ],
    image: image('dance-modern', 1800, 1164, 'Ballerina contemporanea in movimento davanti a un fondale arancione.', 'Israyosoy S. · Pexels', 'https://www.pexels.com/photo/contemporary-dancer-in-vibrant-motion-28972636/', '48% 44%'),
  },
  {
    slug: 'danza-classica',
    title: 'Danza Classica',
    preview: 'Bambini dai 5 anni · Ragazzi tutti i livelli',
    metaTitle: 'Corso di Danza Classica a Roma — Crazy Gang School',
    metaDescription:
      'Danza classica dai 5 anni compiuti per bambini, ragazzi e adulti: propedeutica, perfezionamento e percorso professionale alla Crazy Gang School di Roma.',
    summary: 'Danza classica per bambini dai 5 anni compiuti, ragazzi e adulti.',
    ages: ['Bambini: dai 5 anni compiuti', 'Ragazzi e adulti'],
    levels: ['Propedeutica', 'Avviamento', 'Perfezionamento', 'Principianti / Intermedio', 'Professionale'],
    programs: ['Danza classica bambini', 'Danza classica ragazzi e adulti'],
    schedule: [
      { name: 'Propedeutica', age: '5+ anni', sessions: [session('Mercoledì', '17:00', '18:00')] },
      // TODO(content): confermare il nome definitivo; nel materiale originale compare “AVVIAMENTO??”.
      { name: 'Avviamento', age: '8–10 anni', sessions: [session('Lunedì', '17:00', '18:00'), session('Mercoledì', '18:00', '19:00')] },
      { name: 'Perfezionamento', age: '11–13 anni', sessions: [session('Lunedì', '18:00', '19:00'), session('Venerdì', '19:00', '20:00')] },
      { name: 'Principianti / Intermedio', age: '15+ e adulti', sessions: [session('Venerdì', '18:00', '19:00')] },
      { name: 'Professionale', age: '15+ e adulti', sessions: [session('Lunedì', '19:00', '20:30'), session('Mercoledì', '19:00', '20:30')] },
    ],
    image: image('dance-classical', 1800, 1198, 'Giovane ballerina in una sala danza davanti allo specchio.', 'Đậu Photograph · Pexels', 'https://www.pexels.com/photo/artistic-dance-pose-in-modern-ballet-studio-30826528/', '50% 38%'),
  },
  {
    slug: 'tip-tap',
    title: 'Tip Tap',
    preview: 'Dai 14 anni · Principianti e avanzato',
    metaTitle: 'Corso di Tip Tap a Roma — Crazy Gang School',
    metaDescription:
      'Tip tap dai 14 anni, gruppi principianti e intermedio / avanzato, alla Crazy Gang School di Roma, zona Colli Albani.',
    summary: 'Tip Tap per ragazzi dai 14 anni, con gruppi principianti e intermedio / avanzato.',
    ages: ['Dai 14 anni'],
    levels: ['Principianti', 'Intermedio / Avanzato'],
    programs: ['Tip Tap'],
    schedule: [
      { name: 'Tap principianti', age: '14+ anni', sessions: [session('Giovedì', '18:00', '19:00')] },
      { name: 'Tap intermedio / avanzato', age: '14+ anni', sessions: [session('Giovedì', '19:00', '20:00')] },
    ],
    image: image('tap', 1800, 2225, 'Dettaglio di scarpe da tip tap durante una performance.', 'Jay Brand · Pexels', 'https://www.pexels.com/photo/32448644', '50% 67%'),
  },
  {
    slug: 'k-pop',
    title: 'K-Pop',
    preview: 'Dai 9 anni',
    metaTitle: 'Corso di K-Pop a Roma — Crazy Gang School',
    metaDescription:
      'Corso di K-pop dai 9 anni alla Crazy Gang School di Roma, zona Colli Albani.',
    summary: 'Corso di K-Pop dai 9 anni.',
    ages: ['Dai 9 anni'],
    levels: ['Livello non specificato'],
    programs: ['K-Pop'],
    schedule: [
      { name: 'K-Pop', age: '9+ anni', sessions: [session('Lunedì', '17:00', '18:00')] },
    ],
    image: image('kpop', 1800, 1200, 'Gruppo di giovani in movimento in uno studio illuminato da luci al neon.', 'Yan Krukau · Pexels', 'https://www.pexels.com/photo/a-group-of-people-dancing-7312375/', '50% 45%'),
  },
  {
    slug: 'kung-fu',
    title: 'Kung Fu',
    preview: 'Bambini dai 6 anni compiuti',
    metaTitle: 'Corso di Kung Fu a Roma — Crazy Gang School',
    metaDescription:
      'Kung fu per bambini dai 6 anni, ragazzi dagli 11 anni e adulti alla Crazy Gang School di Roma, zona Colli Albani.',
    summary: 'Kung Fu per bambini, ragazzi e adulti.',
    ages: ['Bambini: dai 6 anni', 'Ragazzi: dagli 11 anni', 'Adulti'],
    levels: ['Livello non specificato'],
    programs: ['Kung Fu Baby', 'Kung Fu Ragazzi', 'Kung Fu Adulti'],
    schedule: [
      { name: 'Kung Fu Baby', age: '6+ anni', sessions: [session('Martedì', '18:00', '19:00'), session('Giovedì', '18:00', '19:00')] },
      { name: 'Kung Fu Ragazzi', age: '11+ anni', sessions: [session('Martedì', '19:00', '20:30'), session('Giovedì', '19:00', '20:30')] },
      { name: 'Kung Fu Adulti', age: 'Adulti', sessions: [session('Martedì', '19:00', '20:30'), session('Giovedì', '19:00', '20:30')] },
    ],
    image: image('kung-fu', 1800, 2398, 'Praticante di arti marziali concentrato in una posizione tecnica.', 'Alireza Heidarpour · Pexels', 'https://www.pexels.com/photo/martial-artist-in-focused-kung-fu-pose-29817841/', '50% 30%'),
  },
  {
    slug: 'hip-hop',
    title: 'Hip Hop',
    preview: 'Bambini dai 5 anni compiuti',
    metaTitle: 'Corso di Hip Hop a Roma — Crazy Gang School',
    metaDescription:
      'Hip hop dai 5 anni e breakdance dagli 11 anni per bambini e ragazzi alla Crazy Gang School di Roma, zona Colli Albani.',
    summary: 'Hip Hop per bambini e ragazzi, con Breakdance dagli 11 anni.',
    ages: ['Hip Hop: dai 5 anni', 'Breakdance: dagli 11 anni'],
    levels: ['Livello non specificato'],
    programs: ['Hip Hop Baby', 'Hip Hop Ragazzi', 'Breakdance'],
    schedule: [
      { name: 'Hip Hop Baby', age: '5+ anni', sessions: [session('Martedì', '17:00', '18:00'), session('Giovedì', '17:00', '18:00')] },
      { name: 'Hip Hop Ragazzi', age: '10+ anni', sessions: [session('Martedì', '18:00', '19:00'), session('Giovedì', '18:00', '19:00')] },
      { name: 'Breakdance', age: '11+ anni', sessions: [session('Martedì', '16:00', '17:00'), session('Giovedì', '16:00', '17:00')] },
    ],
    image: image('hip-hop', 1800, 2772, 'Danzatore hip hop durante una performance davanti a un murale.', 'Beatriz Braga · Pexels', 'https://www.pexels.com/photo/street-dancer-performing-break-dance-11063348/', '48% 45%'),
  },
  {
    slug: 'danze-latino-americane',
    title: 'Danze Latino Americane',
    preview: 'Salsa Cubana · Bachata · Lady Style',
    metaTitle: 'Danze Latino Americane a Roma — Crazy Gang School',
    metaDescription:
      'Salsa cubana, bachata, lady style e danze standard e latino-americane per adulti, livello amatoriale e competizione, alla Crazy Gang School di Roma.',
    summary: 'Salsa Cubana, Bachata, Lady Style e percorsi Standard, Latino Americane e Latin Style per single.',
    ages: ['Tutte le età', 'I gruppi con orario indicato sono per adulti'],
    levels: ['Salsa Cubana: base, 1° e 2° livello', 'Bachata: base e 1° livello', 'Percorsi per single: amatoriale e competizione'],
    programs: ['Salsa Cubana', 'Bachata', 'Lady Style', 'Danze Standard', 'Danze Latino Americane', 'Latin Style per single', 'Samba', 'Cha Cha Cha', 'Rumba', 'Paso Doble', 'Jive'],
    schedule: [
      { name: 'Salsa Cubana — 1° livello', age: 'Adulti', sessions: [session('Mercoledì', '20:00', '21:00')] },
      { name: 'Salsa Cubana — 2° livello', age: 'Adulti', sessions: [session('Mercoledì', '21:00', '22:00')] },
      { name: 'Bachata Moderna — 1° livello', age: 'Adulti', sessions: [session('Mercoledì', '22:00', '23:00')] },
      { name: 'Salsa base principiante', age: 'Adulti', sessions: [session('Giovedì', '20:30', '21:30')] },
      { name: 'Bachata base principiante', age: 'Adulti', sessions: [session('Giovedì', '21:30', '22:30')] },
      { name: 'Lady Style', age: 'Adulti', sessions: [session('Giovedì', '21:30', '22:30')] },
      { name: 'Danze Standard', age: 'Adulti', sessions: [session('Mercoledì', '21:00', '22:30'), session('Venerdì', '21:00', '22:30')] },
    ],
    image: image('latin', 3265, 4898, 'Coppia che balla tango in uno spazio urbano.', 'Nathana Rebouças · Unsplash', 'https://unsplash.com/photos/couple-dancing-photograph-Zunukrg0Grg', '50% 48%'),
  },
];

export const findCourse = pathname => {
  const match = pathname.match(/^\/corsi\/([^/]+)\/?$/);
  return match ? courses.find(course => course.slug === match[1]) : null;
};
