import { getAuthUserId } from '@convex-dev/auth/server';
import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

/** Slugs of the signed-in user's saved places (realtime). */
export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    const rows = await ctx.db
      .query('saves')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .collect();
    return rows.map((r) => r.placeSlug);
  },
});

/** Toggle a place in the user's saved list. Returns the new saved state. */
export const toggle = mutation({
  args: { placeSlug: v.string() },
  handler: async (ctx, { placeSlug }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error('Not authenticated');

    const existing = await ctx.db
      .query('saves')
      .withIndex('by_user_place', (q) => q.eq('userId', userId).eq('placeSlug', placeSlug))
      .unique();

    if (existing) {
      await ctx.db.delete(existing._id);
      return false;
    }
    await ctx.db.insert('saves', { userId, placeSlug });
    return true;
  },
});
