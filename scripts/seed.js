require('dotenv').config();
const { connect, Bouquet, sequelize } = require('../models');

const FRONTEND_BASE =
  process.env.FRONTEND_BASE_URL ||
  'https://kolomiiets-taras.github.io/UMT-markup-practice_P1-Kolomiiets-Taras';

function url(path) {
  return `${FRONTEND_BASE.replace(/\/$/, '')}/images/${path}`;
}

const SEED = [
  { title: 'Spring Elegance', price: 35, category: 'romantic', favorite: true, photo: 'top-spring-elegance.jpg', description: 'A delicate blend of peonies, tulips, and roses — perfect for springtime gifting and bright smiles.' },
  { title: 'Berry Chic', price: 40, category: 'bright', favorite: true, photo: 'top-berry-chic.jpg', description: 'A stylish composition of roses, seasonal greenery, and vibrant berries — a bold and elegant floral statement.' },
  { title: 'Lavender Dream', price: 55, category: 'romantic', favorite: true, photo: 'top-lavender-dream.jpg', description: 'A rich bouquet with lavender, lisianthus, and roses — ideal for those who love deep hues and gentle fragrance.' },
  { title: 'Peach Meadow', price: 55, category: 'garden', favorite: true, photo: 'bq-peach-meadow.jpg', description: 'A soft and radiant arrangement of peach and blush roses with lush greenery in a straw basket — light and natural.' },
  { title: 'Tulip Charm', price: 61, category: 'bright', favorite: true, photo: 'bq-tulip-charm.jpg', description: 'A vivid bouquet of bright tulips and roses in a lavender box — cheerful and full of charm.' },
  { title: 'Field Joy', price: 49, category: 'bright', favorite: true, photo: 'bq-field-joy.jpg', description: 'A rustic hand-tied bouquet of sunflowers, lisianthus, and daisies — perfect for brightening the day.' },
  { title: 'Blush Romance', price: 34, category: 'romantic', favorite: false, photo: 'bq-blush-romance.jpg', description: 'A premium bouquet of deep pink and ivory roses, complemented by silver eucalyptus — sophisticated and intimate.' },
  { title: 'Pastel Garden', price: 40, category: 'garden', favorite: false, photo: 'bq-pastel-garden.jpg', description: 'A pastel-toned mix of spray roses and greenery in a woven basket — gentle, airy, and perfect for any occasion.' },
  { title: 'Berry Bloom', price: 32, category: 'romantic', favorite: false, photo: 'bq-berry-bloom.jpg', description: 'A lush mix of rich pink, purple, and cream blooms with textured greens — romantic and elegant.' },
  { title: 'Sweet Whisper', price: 40, category: 'garden', favorite: false, photo: 'bq-sweet-whisper.jpg', description: 'A charming spring bouquet with peonies, roses, and lilac-toned accents — fresh, lively, and expressive.' },
  { title: 'Soft Bloom', price: 37, category: 'romantic', favorite: false, photo: 'bq-soft-bloom.jpg', description: 'A delicate bouquet of pink carnations and roses wrapped in satin paper — soft, stylish, and versatile.' },
  { title: 'Garden Whisper', price: 42, category: 'garden', favorite: false, photo: 'bq-pastel-garden.jpg', description: 'Cottage-style mix of garden roses, hydrangea, and trailing greens — timeless and serene.' },
];

(async () => {
  await connect();
  const force = process.argv.includes('--force');
  if (force) {
    await Bouquet.destroy({ where: {} });
    console.log('Cleared existing bouquets.');
  } else {
    const existing = await Bouquet.count();
    if (existing > 0) {
      console.log(`Database already has ${existing} bouquets. Re-run with --force to wipe.`);
      await sequelize.close();
      return;
    }
  }
  for (const item of SEED) {
    const { photo, ...rest } = item;
    await Bouquet.create({ ...rest, photoURL: url(photo) });
  }
  console.log(`Seeded ${SEED.length} bouquets.`);
  await sequelize.close();
})().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
