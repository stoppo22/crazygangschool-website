// Factual source: CONTEXT.md. All operational availability remains unconfirmed.
// Historical material from the documented school website; rights and credits need verification.
const archivePhoto = (name, width, height, alt, caption, source) => ({
  src: `/images/archive-${name}-1100.webp`,
  srcSet: [640, 1100, 1600].map(size => `/images/archive-${name}-${size}.webp ${size}w`).join(', '),
  width, height, alt, caption, source, position: '50% 50%', mobilePosition: '50% 50%',
});
const ensemble = archivePhoto('ensemble', 2126, 1414,
  'Un gruppo di interpreti in camicia bianca si esibisce su un palco con una scenografia teatrale.',
  'Dalla galleria del sito Crazy Gang',
  'https://www.crazygangschool.com/copia-di-galleria');
const sisterAct = archivePhoto('sister-act', 3300, 2156,
  'Un ensemble in costumi da suora danza sul palco; la scenografia riporta il nome Crazy Gang.',
  'Sister Act · etichetta dell’archivio originale',
  'https://www.crazygangschool.com/');
const placeholder = (name, widths, width, height) => ({
  src: `/images/placeholder-${name}-900.webp`,
  srcSet: widths.map(size => `/images/placeholder-${name}-${size}.webp ${size}w`).join(', '),
  width, height, alt: '', caption: 'Fotografia segnaposto', placeholder: true,
  position: '50% 50%', mobilePosition: '50% 50%',
});
const stagePlaceholder = placeholder('stage', [480, 900, 1300], 1400, 1869);
const studioPlaceholder = placeholder('studio', [480, 900, 1100], 1100, 1650);
export const photos = {
  heroMain: { ...stagePlaceholder, position: '50% 45%', mobilePosition: '50% 45%' },
  heroDetail: { ...studioPlaceholder, position: '50% 32%', mobilePosition: '50% 32%' },
  disciplineOne: { ...studioPlaceholder, position: '50% 48%', mobilePosition: '50% 48%' },
  disciplineTwo: { ...stagePlaceholder, position: '50% 68%', mobilePosition: '50% 68%' },
  studio: ensemble, stage: sisterAct,
};

export const disciplines = [
  { id: 'classica', name: 'Danza Classica' },
  { id: 'moderna', name: 'Danza Moderna' },
  { id: 'hip-hop', name: 'Hip Hop' },
  { id: 'tap', name: 'Tap' },
  { id: 'break-dance', name: 'Break Dance' },
  { id: 'salsa', name: 'Salsa Cubana' },
  { id: 'standard', name: 'Danze Standard' },
  { id: 'latino', name: 'Danze Latino Americane' },
  { id: 'kung-fu', name: 'Kung Fu' },
  { id: 'propedeutica', name: 'Propedeutica' },
];

export const faculty = [
  ['Lucrezia Stopponi', 'Danza Moderna'], ['Claudio Salvatori', 'Danza Moderna'],
  ['Dina Serri', 'Danza Moderna'], ['Giulia Segneri', 'Danza Moderna'],
  ['Flavia Fraietta', 'Danza Classica e Propedeutica'], ["Emiliano D'Angelo", 'Hip Hop'],
  ['Gaia Stopponi', 'Danza Moderna'], ['Sabrina Sottile', 'Salsa Cubana'],
  ['Angelo Riolo', 'Kung Fu e Kuai'], ['Massimo e Tiziana', 'Danze Standard e Latino Americane'],
  ['Gloria di Domizio', 'Danza Moderna'],
];

export const contact = {
  email: 'info@crazygang.it', phone: '067883621', mobile: '3334027525',
  address: 'L.go Orazi e Curiazi, 12 - Roma',
  instagram: 'https://www.instagram.com/crazygangschool/',
  facebook: 'https://www.facebook.com/crazygangschool85/?fref=ts',
};


