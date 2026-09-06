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
export const photos = { hero: ensemble, studio: ensemble, stage: sisterAct };

export const courseGroups = [
  { id: 'danza', title: 'Danza', subtitle: 'Classica, moderna, primi passi.', names: ['Danza Classica', 'Danza Moderna', 'Propedeutica'], photo: 'studio' },
  { id: 'ritmo', title: 'Ritmo', subtitle: 'Linguaggi del movimento.', names: ['Hip Hop', 'Break Dance', 'Tap'], photo: 'stage' },
  { id: 'incontro', title: 'Incontro', subtitle: 'Danze di coppia e arti marziali.', names: ['Salsa Cubana', 'Danze Standard', 'Danze Latino Americane', 'Kung Fu'], photo: 'studio' },
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

