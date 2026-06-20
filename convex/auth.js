import Google from '@auth/core/providers/google';
import { convexAuth } from '@convex-dev/auth/server';
/**
 * Convex Auth configured with the Google OAuth provider.
 * Requires `AUTH_GOOGLE_ID` and `AUTH_GOOGLE_SECRET` set on the Convex
 * deployment (see README → Auth setup).
 */
export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
    providers: [Google],
});
