import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { PLACES, type Place } from '../data/places';

function toPlace(d: any): Place {
  return {
    id: d.slug,
    name: d.name,
    area: d.area,
    cat: d.cat,
    catLabel: d.catLabel,
    catShort: d.catShort,
    tint: d.tint,
    image: d.image ?? '',
    tags: d.tags,
    price: d.price,
    priceLabel: d.priceLabel,
    hours: d.hours,
    best: d.best,
    travel: d.travel,
    openNow: d.openNow,
    blurb: d.blurb,
    lat: d.lat,
    lng: d.lng,
    rating: d.rating,
    reviews: d.reviews,
    phone: d.phone,
    address: d.address,
    mapsUrl: d.mapsUrl,
    dirsUrl: d.dirsUrl,
    placeId: d.placeId,
    category: d.category,
  };
}

/**
 * The place catalog keyed by slug. Reads from Convex in realtime; falls back
 * to the bundled catalog while loading or before the DB has been seeded.
 */
export function usePlaces(): Record<string, Place> {
  const data = useQuery(api.places.list) as any[] | undefined;
  if (!data || data.length === 0) return PLACES;
  const out: Record<string, Place> = {};
  for (const d of data) out[d.slug] = toPlace(d);
  return out;
}

export function usePlace(slug: string | undefined): Place | undefined {
  const places = usePlaces();
  if (!slug) return undefined;
  return places[slug];
}
