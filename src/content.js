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
// TODO(launch): `placeholder: true` marca le foto stock temporanee (attributo
// data-placeholder nel markup, non visibile all'utente). Sostituirle con
// fotografie originali della scuola e rimuovere il flag. Vedi LAUNCH_CHECKLIST.md.
const placeholder = (name, widths, width, height) => ({
  src: `/images/placeholder-${name}-900.webp`,
  srcSet: widths.map(size => `/images/placeholder-${name}-${size}.webp ${size}w`).join(', '),
  width, height, alt: '', caption: '', placeholder: true,
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
  { id: 'salsa', name: 'Salsa Cubana' },
  { id: 'standard', name: 'Danze Standard' },
  { id: 'latino', name: 'Danze Latino Americane' },
  { id: 'kung-fu', name: 'Kung Fu' },
  { id: 'propedeutica', name: 'Propedeutica' },
];

const teacher = (id, name, role, width, height, position = '50% 50%') => ({
  id, name, role,
  image: {
    src: `/images/teachers/${id}.webp`, width, height, position,
    alt: name === 'Massimo e Tiziana' ? 'Ritratto di Massimo e Tiziana.' : `Ritratto di ${name}.`,
    source: 'https://www.crazygangschool.com/insegnanti',
  },
});
export const faculty = [
  teacher('marco-stopponi', 'Marco Stopponi', 'Coreografo, insegnante, direttore artistico', 312, 305),
  teacher('stefano-stopponi', 'Stefano Stopponi', 'Coreografo, insegnante, direttore artistico', 344, 273),
  teacher('lucrezia-stopponi', 'Lucrezia Stopponi', 'Ballerina, insegnante Danza Moderna', 365, 513),
  teacher('claudio-salvatori', 'Claudio Salvatori', 'Insegnante Danza Moderna', 960, 960),
  teacher('dina-serri', 'Dina Serri', 'Insegnante Danza Moderna', 1000, 1023),
  teacher('giulia-segneri', 'Giulia Segneri', 'Insegnante Danza Moderna', 862, 1178),
  teacher('flavia-fraietta', 'Flavia Fraietta', 'Insegnante Danza Classica e Propedeutica', 507, 478),
  teacher('emiliano-dangelo', "Emiliano D'Angelo", 'Insegnante Hip Hop', 719, 601),
  teacher('gaia-stopponi', 'Gaia Stopponi', 'Insegnante Danza Moderna', 1000, 1117),
  teacher('angelo-riolo', 'Angelo Riolo', 'Insegnante Kung Fu e Kuai', 185, 183),
  teacher('massimo-e-tiziana', 'Massimo e Tiziana', 'Insegnanti Danze Standard e Latino Americane', 1000, 667),
  teacher('gloria-di-domizio', 'Gloria di Domizio', 'Insegnante Danza Moderna', 531, 569),
];

export const contact = {
  email: 'info@crazygang.it', phone: '067883621',
  // Verified WhatsApp Business number of the school (06 7883621 → +39 06 7883621).
  // Prefilled message: "Ciao, avrei bisogno di alcune informazioni."
  whatsapp: 'https://wa.me/39067883621?text=Ciao%2C%20avrei%20bisogno%20di%20alcune%20informazioni.',
  address: 'Largo Orazi e Curiazi, 12', city: '00181 Roma', metro: 'Metro A · Colli Albani',
  maps: 'https://www.google.com/maps/place/Crazy+Gang+School/@41.8724821,12.5294285,17z/data=!3m1!4b1!4m6!3m5!1s0x132f61f808a89c81:0xe5f28e8c08f3ea59!8m2!3d41.8724821!4d12.5294285!16s%2Fg%2F11cs2v__pm',
  mapsEmbed: 'https://www.google.com/maps?q=Crazy%20Gang%20School%2C%20Largo%20Orazi%20e%20Curiazi%2012%2C%20Roma&output=embed',
  instagram: 'https://www.instagram.com/crazygangschool/',
  facebook: 'https://www.facebook.com/crazygangschool85/?fref=ts',
};


