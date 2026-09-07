const galleryImage = (id, width, height, title, category, source) => ({
  id,
  src: `/images/gallery/${id}-640.webp`,
  largeSrc: `/images/gallery/${id}-1600.webp`,
  srcSet: `/images/gallery/${id}-640.webp 640w, /images/gallery/${id}-960.webp 960w, /images/gallery/${id}-1600.webp 1600w`,
  width,
  height,
  title,
  category,
  alt: `Fotografia dall?archivio Crazy Gang: ${title}.`,
  source,
});

const HOME = 'https://www.crazygangschool.com/';
const MODERN = 'https://www.crazygangschool.com/copia-di-galleria';
const BABY = 'https://www.crazygangschool.com/baby-gang';
const CLASSICAL = 'https://www.crazygangschool.com/danza-classica-1-s87qy';

// Titles and categories reproduce source-site labels; dates and production credits remain unverified.
export const galleryImages = [
  galleryImage('sister-act', 1600, 1045, 'Sister Act', 'Spettacoli', HOME),
  galleryImage('ensemble', 1600, 1064, 'Ensemble', 'Danza moderna', MODERN),
  galleryImage('producers-01', 1600, 1057, 'The Producers', 'Spettacoli', HOME),
  galleryImage('dracula-03', 1600, 2400, 'Dracula', 'Spettacoli', HOME),
  galleryImage('mary-poppins-01', 1600, 1073, 'Mary Poppins', 'Spettacoli', HOME),
  galleryImage('modern-01', 1600, 1067, 'Danza moderna', 'Saggi e spettacoli', MODERN),
  galleryImage('baby-01', 1023, 680, 'Baby Crazy Gang', 'Baby Crazy Gang', BABY),
  galleryImage('producers-02', 1600, 1042, 'The Producers', 'Spettacoli', HOME),
  galleryImage('modern-03', 1600, 2408, 'Danza moderna', 'Saggi e spettacoli', MODERN),
  galleryImage('dracula-01', 1600, 1067, 'Dracula', 'Spettacoli', HOME),
  galleryImage('baby-02', 1023, 670, 'Baby Crazy Gang', 'Baby Crazy Gang', BABY),
  galleryImage('mary-poppins-02', 1600, 1071, 'Mary Poppins', 'Spettacoli', HOME),
  galleryImage('modern-04', 1600, 1064, 'Danza moderna', 'Saggi e spettacoli', MODERN),
  galleryImage('producers-03', 1600, 1060, 'The Producers', 'Spettacoli', HOME),
  galleryImage('classical', 1600, 1000, 'Danza classica', 'Danza classica', CLASSICAL),
  galleryImage('baby-03', 1023, 671, 'Baby Crazy Gang', 'Baby Crazy Gang', BABY),
  galleryImage('dracula-04', 1600, 2400, 'Dracula', 'Spettacoli', HOME),
  galleryImage('modern-05', 1600, 1064, 'Danza moderna', 'Saggi e spettacoli', MODERN),
  galleryImage('mary-poppins-03', 1600, 1032, 'Mary Poppins', 'Spettacoli', HOME),
  galleryImage('baby-04', 1023, 680, 'Baby Crazy Gang', 'Baby Crazy Gang', BABY),
  galleryImage('producers-04', 1600, 1058, 'The Producers', 'Spettacoli', HOME),
  galleryImage('modern-06', 1600, 1060, 'Danza moderna', 'Saggi e spettacoli', MODERN),
  galleryImage('baby-05', 1023, 656, 'Baby Crazy Gang', 'Baby Crazy Gang', BABY),
  galleryImage('dracula-02', 1600, 1067, 'Dracula', 'Spettacoli', HOME),
  galleryImage('modern-02', 1600, 1063, 'Danza moderna', 'Saggi e spettacoli', MODERN),
  galleryImage('baby-06', 1023, 685, 'Baby Crazy Gang', 'Baby Crazy Gang', BABY),
  galleryImage('modern-07', 1600, 1064, 'Danza moderna', 'Saggi e spettacoli', MODERN),
  galleryImage('modern-08', 1600, 1064, 'Danza moderna', 'Saggi e spettacoli', MODERN),
];
