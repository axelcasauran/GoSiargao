import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import { useToast } from '../components/Toast';
import { useSavedSlugs, useToggleSave } from './saves';

/**
 * Central place interactions, mirroring the design's `decorate()` helper:
 * open a place, and toggle-save with a confirmation toast.
 */
export function usePlaceActions() {
  const router = useRouter();
  const savedSlugs = useSavedSlugs();
  const toggle = useToggleSave();
  const flash = useToast();

  const isSaved = useCallback((slug: string) => savedSlugs.includes(slug), [savedSlugs]);

  const open = useCallback(
    (slug: string) => router.push({ pathname: '/place/[id]', params: { id: slug } }),
    [router],
  );

  const onHeart = useCallback(
    (slug: string) => {
      const willSave = !savedSlugs.includes(slug);
      toggle(slug);
      if (willSave) flash('Saved to My Trip');
    },
    [savedSlugs, toggle, flash],
  );

  return { savedSlugs, isSaved, open, onHeart };
}
