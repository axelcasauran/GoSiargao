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
        tint: v.string(),
        tags: v.array(v.string()),
        price: v.string(),
        priceLabel: v.string(),
        hours: v.string(),
        best: v.string(),
        travel: v.string(),
        openNow: v.boolean(),
        blurb: v.string(),
    }).index('by_slug', ['slug']),
    // Per-user saved places — the realtime "My Trip" list.
    saves: defineTable({
        userId: v.id('users'),
        placeSlug: v.string(),
    })
        .index('by_user', ['userId'])
        .index('by_user_place', ['userId', 'placeSlug']),
});
