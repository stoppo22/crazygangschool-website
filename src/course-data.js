const image = (file, width, height, alt, credit, source, position = '50% 50%') => ({
  src: `/images/courses/${file}-1200.webp`,
  srcSet: [640, 1200, 1800].map(size => `/images/courses/${file}-${size}.webp ${size}w`).join(', '),
  width, height, alt, credit, source, position,
});

export const courses = [
  {
    slug: 'danza-moderna',
    title: 'Danza Moderna',
    preview: 'Gioco danza 3–4 anni · Moderna dai 5 anni',
    summary: 'Gioco danza per i più piccoli e danza moderna per bambini e ragazzi.',
    ages: ['Gioco danza: 3–4 anni', 'Bambini: dai 5 anni compiuti', 'Ragazzi: fascia specifica da verificare'],
    levels: ['Ragazzi: tutti i livelli', 'Livelli dei gruppi bambini: da verificare'],
    programs: ['Gioco danza', 'Danza moderna bambini', 'Danza moderna ragazzi'],
    image: image('dance-modern', 1800, 1164, 'Ballerina contemporanea in movimento davanti a un fondale arancione.', 'Israyosoy S. · Pexels', 'https://www.pexels.com/photo/contemporary-dancer-in-vibrant-motion-28972636/', '48% 44%'),
  },
  {
    slug: 'danza-classica',
    title: 'Danza Classica',
    preview: 'Bambini dai 5 anni · Ragazzi tutti i livelli',
    summary: 'Danza classica per bambini dai 5 anni compiuti e per ragazzi.',
    ages: ['Bambini: dai 5 anni compiuti', 'Ragazzi: fascia specifica da verificare'],
    levels: ['Ragazzi: tutti i livelli', 'Livelli dei gruppi bambini: da verificare'],
    programs: ['Danza classica bambini', 'Danza classica ragazzi'],
    image: image('dance-classical', 1800, 1198, 'Giovane ballerina in una sala danza davanti allo specchio.', 'Đậu Photograph · Pexels', 'https://www.pexels.com/photo/artistic-dance-pose-in-modern-ballet-studio-30826528/', '50% 38%'),
  },
  {
    slug: 'tip-tap',
    title: 'Tip Tap',
    preview: 'Corso disponibile · Dettagli da verificare',
    summary: 'Corso di Tip Tap. Fasce d’età e articolazione del percorso sono da verificare.',
    ages: ['Fasce d’età da verificare'],
    levels: ['Livelli da verificare'],
    programs: ['Ulteriori dettagli da verificare'],
    image: image('tap', 1800, 2225, 'Dettaglio di scarpe da tip tap durante una performance.', 'Jay Brand · Pexels', 'https://www.pexels.com/photo/32448644', '50% 67%'),
  },
  {
    slug: 'k-pop',
    title: 'K-Pop',
    preview: 'Corso disponibile · Dettagli da verificare',
    summary: 'Corso di K-Pop. Fasce d’età, livelli e articolazione del percorso sono da verificare.',
    ages: ['Fasce d’età da verificare'],
    levels: ['Livelli da verificare'],
    programs: ['Ulteriori dettagli da verificare'],
    image: image('kpop', 1800, 1200, 'Gruppo di giovani in movimento in uno studio illuminato da luci al neon.', 'Yan Krukau · Pexels', 'https://www.pexels.com/photo/a-group-of-people-dancing-7312375/', '50% 45%'),
  },
  {
    slug: 'kung-fu',
    title: 'Kung Fu',
    preview: 'Bambini dai 6 anni compiuti',
    summary: 'Corso di Kung Fu per bambini dai 6 anni compiuti.',
    ages: ['Bambini: dai 6 anni compiuti'],
    levels: ['Livelli da verificare'],
    programs: ['Articolazione del corso da verificare'],
    image: image('kung-fu', 1800, 2398, 'Praticante di arti marziali concentrato in una posizione tecnica.', 'Alireza Heidarpour · Pexels', 'https://www.pexels.com/photo/martial-artist-in-focused-kung-fu-pose-29817841/', '50% 30%'),
  },
  {
    slug: 'hip-hop',
    title: 'Hip Hop',
    preview: 'Bambini dai 5 anni compiuti',
    summary: 'Corso di Hip Hop per bambini dai 5 anni compiuti.',
    ages: ['Bambini: dai 5 anni compiuti'],
    levels: ['Livelli da verificare'],
    programs: ['Articolazione del corso da verificare'],
    image: image('hip-hop', 1800, 2772, 'Danzatore hip hop durante una performance davanti a un murale.', 'Beatriz Braga · Pexels', 'https://www.pexels.com/photo/street-dancer-performing-break-dance-11063348/', '48% 45%'),
  },
  {
    slug: 'danze-latino-americane',
    title: 'Danze Latino Americane',
    preview: 'Salsa Cubana · Bachata · Lady Style',
    summary: 'Salsa Cubana, Bachata, Lady Style e percorsi Standard, Latino Americane e Latin Style per single.',
    ages: ['Percorsi per single: tutte le età', 'Fasce d’età degli altri percorsi: da verificare'],
    levels: ['Salsa Cubana: base, 1° e 2° livello', 'Bachata: base e 1° livello', 'Percorsi per single: amatoriale e competizione'],
    programs: ['Salsa Cubana', 'Bachata', 'Lady Style', 'Per single: Samba, Cha Cha Cha, Rumba, Paso Doble e Jive'],
    image: image('latin', 3265, 4898, 'Coppia che balla tango in uno spazio urbano.', 'Nathana Rebouças · Unsplash', 'https://unsplash.com/photos/couple-dancing-photograph-Zunukrg0Grg', '50% 48%'),
  },
];

export const findCourse = pathname => {
  const match = pathname.match(/^\/corsi\/([^/]+)\/?$/);
  return match ? courses.find(course => course.slug === match[1]) : null;
};
