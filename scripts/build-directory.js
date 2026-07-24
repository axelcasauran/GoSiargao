/**
 * Build src/data/directory.ts from scripts/directory-source.json.
 *
 * The source JSON is the raw Google-Places export bundled with the offline
 * "General Luna, Siargao — Island Directory" map. This script maps each place
 * onto the app's Place model (icon category, on-brand tint, rating labels) and
 * keeps the true GPS coordinates the Map screen projects.
 *
 * Run:  node scripts/build-directory.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'scripts', 'directory-source.json');
const OUT = path.join(ROOT, 'src', 'data', 'directory.ts');

const { places: PLACES } = JSON.parse(fs.readFileSync(SRC, 'utf8'));

// 12 real categories -> app icon category + on-brand tint + short chip label.
const CAT_CONFIG = {
  'Restaurants & Cafés':          { cat: 'eat',   tint: '#F2762E', short: 'Cafés' },
  'Local Eateries & BBQ':         { cat: 'eat',   tint: '#E4572E', short: 'Eateries' },
  'Bars & Nightlife':             { cat: 'eat',   tint: '#C2410C', short: 'Bars' },
  'Hotels & Resorts':             { cat: 'stay',  tint: '#E84F5C', short: 'Hotels' },
  'Hostels & Guesthouses':        { cat: 'stay',  tint: '#D9536A', short: 'Hostels' },
  'Things To Do':                 { cat: 'tour',  tint: '#2F7A4F', short: 'Things to do' },
  'Surf & Water Sports':          { cat: 'beach', tint: '#0E7C86', short: 'Surf' },
  'Wellness & Spas':              { cat: 'tour',  tint: '#4C9A8E', short: 'Wellness' },
  'Pharmacies & Clinics':         { cat: 'tour',  tint: '#C0453B', short: 'Health' },
  'ATMs & Money':                 { cat: 'tour',  tint: '#3E7CB1', short: 'ATMs' },
  'Transport & Fuel':             { cat: 'tour',  tint: '#6B7B7E', short: 'Transport' },
  'Shops, Groceries & Services':  { cat: 'tour',  tint: '#B07D3C', short: 'Shops' },
};

const TOWNS = ['Del Carmen', 'Dapa', 'Pilar', 'Santa Monica', 'Burgos', 'San Isidro', 'San Benito', 'Pacifico', 'Santa Fe', 'Socorro', 'Union'];

function areaFor(addr) {
  if (!addr) return 'General Luna';
  if (/cloud\s*9/i.test(addr)) return 'Cloud 9';
  if (/catangnan/i.test(addr)) return 'Catangnan';
  if (/general luna/i.test(addr)) return 'General Luna';
  for (const t of TOWNS) if (addr.includes(t)) return t;
  return 'General Luna';
}

function slugify(s) {
  return (
    s
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/&/g, ' and ')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 48) || 'place'
  );
}

const fmtInt = (n) => (n || 0).toLocaleString('en-US');

const seen = {};
const rows = PLACES.map((p) => {
  const cfg = CAT_CONFIG[p.category] || { cat: 'tour', tint: '#6B7B7E', short: p.category };
  let slug = slugify(p.name);
  if (seen[slug]) { seen[slug]++; slug = `${slug}-${seen[slug]}`; } else { seen[slug] = 1; }

  const rating = typeof p.rating === 'number' ? p.rating : 0;
  const reviews = typeof p.reviews_count === 'number' ? p.reviews_count : 0;
  const ratingLabel = rating ? `★ ${rating.toFixed(1)}` : 'New';
  const reviewsLabel = reviews ? `${fmtInt(reviews)} reviews` : 'No reviews yet';
  const best = rating >= 4.7 ? 'Top rated' : rating >= 4.3 ? 'Well rated' : rating ? 'Worth a stop' : 'New spot';
  const area = areaFor(p.address);

  return {
    id: slug,
    name: p.name,
    area,
    cat: cfg.cat,
    catLabel: p.category,
    catShort: cfg.short,
    tint: cfg.tint,
    image: '',
    tags: [ratingLabel, reviewsLabel],
    price: reviews ? reviewsLabel : '',
    priceLabel: ratingLabel,
    hours: p.hours || 'Hours vary',
    best,
    travel: area,
    openNow: true,
    blurb: p.summary || '',
    lat: p.lat,
    lng: p.lng,
    rating,
    reviews,
    phone: p.phone || '',
    address: p.address || '',
    mapsUrl: p.maps || '',
    dirsUrl: p.dirs || '',
    placeId: p.place_id || '',
    category: p.category,
  };
});

const pretty = (arr) =>
  JSON.stringify(arr, null, 0)
    .replace(/\},\{/g, '},\n  {')
    .replace(/^\[/, '[\n  ')
    .replace(/\]$/, ',\n]');

const out = `/**
 * Siargao (General Luna) offline directory — ${rows.length} real places compiled
 * from Google Places, transcribed from the bundled offline map export.
 *
 * GENERATED FILE — do not edit by hand. Regenerate with:
 *   node scripts/build-directory.js
 * Each entry carries true GPS coordinates so the Map screen can project and
 * navigate them offline (see src/app/(tabs)/explore.tsx).
 */
import type { Place } from './places';

export const DIRECTORY: Place[] = ${pretty(rows)};

/** Category filter config (12 real categories → chip labels + tints). */
export const DIRECTORY_CATEGORIES: { label: string; short: string; tint: string; cat: string }[] = ${pretty(
  Object.entries(CAT_CONFIG).map(([label, c]) => ({ label, short: c.short, tint: c.tint, cat: c.cat })),
)};
`;

fs.writeFileSync(OUT, out);
console.log(`Wrote ${path.relative(ROOT, OUT)} with ${rows.length} places`);
