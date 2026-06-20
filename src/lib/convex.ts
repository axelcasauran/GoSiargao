import { ConvexReactClient } from 'convex/react';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

/** Deployment URL — set in `.env.local` as EXPO_PUBLIC_CONVEX_URL. */
export const CONVEX_URL = process.env.EXPO_PUBLIC_CONVEX_URL;
export const isConvexConfigured = typeof CONVEX_URL === 'string' && CONVEX_URL.length > 0;

/**
 * Convex client. Null until `EXPO_PUBLIC_CONVEX_URL` is set, which lets the
 * app render a "setup needed" screen instead of crashing on boot.
 */
export const convex = isConvexConfigured
  ? new ConvexReactClient(CONVEX_URL as string, { unsavedChangesWarning: false })
  : null;

/** SecureStore-backed token storage for Convex Auth (native only). */
export const secureStorage =
  Platform.OS === 'web'
    ? undefined
    : {
        getItem: SecureStore.getItemAsync,
        setItem: (key: string, value: string) => SecureStore.setItemAsync(key, value),
        removeItem: SecureStore.deleteItemAsync,
      };
