import { PLACES } from '../src/data/places';
import { mutation } from './_generated/server';

/**
 * Populate the `places` table from the bundled catalog.
 * Run with: `npx convex run seed:run` (or `npm run seed`).
 */
export const run = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query('places').collect();
    for (const row of existing) await ctx.db.delete(row._id);

    let n = 0;
    for (const p of Object.values(PLACES)) {
      await ctx.db.insert('places', {
        slug: p.id,
        name: p.name,
        area: p.area,
        cat: p.cat,
        catLabel: p.catLabel,
        catShort: p.catShort,
        tint: p.tint,
        image: p.image,
        tags: p.tags,
        price: p.price,
        priceLabel: p.priceLabel,
        hours: p.hours,
        best: p.best,
        travel: p.travel,
        openNow: p.openNow,
        blurb: p.blurb,
        lat: p.lat,
        lng: p.lng,
        rating: p.rating,
        reviews: p.reviews,
        phone: p.phone,
        address: p.address,
        mapsUrl: p.mapsUrl,
        dirsUrl: p.dirsUrl,
        placeId: p.placeId,
        category: p.category,
      });
      n++;
    }
    return `Seeded ${n} places`;
  },
});
