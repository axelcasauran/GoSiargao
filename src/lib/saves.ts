import { useMutation, useQuery } from 'convex/react';
import { useCallback } from 'react';
import { api } from '../../convex/_generated/api';

/** The signed-in user's saved place slugs (realtime). */
export function useSavedSlugs(): string[] {
  const data = useQuery(api.saves.list) as string[] | undefined;
  return data ?? [];
}

/** Returns a `toggle(slug)` callback backed by the Convex mutation. */
export function useToggleSave() {
  const toggle = useMutation(api.saves.toggle);
  return useCallback(
    (placeSlug: string) => {
      void toggle({ placeSlug });
    },
    [toggle],
  );
}
