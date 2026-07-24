import { authTables } from '@convex-dev/auth/server';
import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  // Convex Auth tables (users, authSessions, authAccounts, ...)
  ...authTables,

  // The Siargao place catalog.
  places: defineTable({
    slug: v.string(),
    name: v.string(),
    area: v.string(),
    cat: v.string(),
    catLabel: v.string(),
    catShort: v.optional(v.string()),
    tint: v.string(),
    image: v.optional(v.string()),
    tags: v.array(v.string()),
    price: v.string(),
    priceLabel: v.string(),
    hours: v.string(),
    best: v.string(),
    travel: v.string(),
    openNow: v.boolean(),
    blurb: v.string(),

    // Real Google Places data (GPS + contact) for the offline map & actions.
    lat: v.optional(v.number()),
    lng: v.optional(v.number()),
    rating: v.optional(v.number()),
    reviews: v.optional(v.number()),
    phone: v.optional(v.string()),
    address: v.optional(v.string()),
    mapsUrl: v.optional(v.string()),
    dirsUrl: v.optional(v.string()),
    placeId: v.optional(v.string()),
    category: v.optional(v.string()),
  }).index('by_slug', ['slug']),

  // Per-user saved places — the realtime "My Trip" list.
  saves: defineTable({
    userId: v.id('users'),
    placeSlug: v.string(),
  })
    .index('by_user', ['userId'])
    .index('by_user_place', ['userId', 'placeSlug']),
});
