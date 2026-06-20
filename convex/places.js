import { v } from 'convex/values';
import { query } from './_generated/server';
/** All places in the catalog. */
export const list = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query('places').collect();
    },
});
/** A single place by its slug (e.g. "cloud9"). */
export const get = query({
    args: { slug: v.string() },
    handler: async (ctx, { slug }) => {
        return await ctx.db
            .query('places')
            .withIndex('by_slug', (q) => q.eq('slug', slug))
            .unique();
    },
});
