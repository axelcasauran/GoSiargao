import { useAuthActions } from '@convex-dev/auth/react';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SavedCard } from '@/components/cards';
import { GlyphPath, Icon } from '@/components/Icon';
import { Segmented } from '@/components/primitives';
import { AppText, Display } from '@/components/Text';
import { ITINERARY } from '@/data/places';
import { usePlaces } from '@/lib/catalog';
import { useSavedSlugs } from '@/lib/saves';
import { colors, radius, shadow } from '@/theme';

export default function TripScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { signOut } = useAuthActions();
  const places = usePlaces();
  const savedSlugs = useSavedSlugs();
  const [tab, setTab] = useState<'saved' | 'itinerary'>('saved');

  const savedPlaces = savedSlugs.map((s) => places[s]).filter(Boolean);

  return (
    <ScrollView
      style={styles.root}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingTop: insets.top + 8, paddingBottom: 100 + insets.bottom }}
    >
      <View style={{ paddingHorizontal: 22 }}>
        <View style={styles.headRow}>
          <Display size={26}>My Trip</Display>
          <Pressable onPress={() => signOut()} hitSlop={8}>
            <AppText variant="semibold" size={13} color={colors.muted}>Sign out</AppText>
          </Pressable>
        </View>
        <View style={{ marginTop: 14 }}>
          <Segmented
            value={tab}
            onChange={(k) => setTab(k as 'saved' | 'itinerary')}
            options={[
              { key: 'saved', label: `Saved (${savedPlaces.length})` },
              { key: 'itinerary', label: 'Itinerary' },
            ]}
          />
        </View>
      </View>

      {tab === 'saved' ? (
        <View style={{ paddingHorizontal: 22, paddingTop: 16 }}>
          {savedPlaces.length > 0 ? (
            <View style={styles.grid}>
              {savedPlaces.map((p) => (
                <View key={p.id} style={styles.gridItem}>
                  <SavedCard place={p} />
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.empty}>
              <View style={styles.emptyIcon}>
                <Icon name="heart" size={34} color={colors.teal} strokeWidth={1.8} />
              </View>
              <Display size={20} style={{ textAlign: 'center' }}>Nothing saved yet</Display>
              <AppText size={14} color={colors.muted} style={styles.emptyText}>
                Tap the heart on any spot to keep it here — works offline once you&apos;ve saved it.
              </AppText>
              <Pressable style={styles.cta} onPress={() => router.push('/')}>
                <AppText variant="semibold" size={14} color={colors.white}>Start exploring</AppText>
              </Pressable>
            </View>
          )}
        </View>
      ) : (
        <View style={{ paddingHorizontal: 22, paddingTop: 18 }}>
          {ITINERARY.map((day) => (
            <View key={day.label} style={{ marginBottom: 22 }}>
              <View style={styles.dayHead}>
                <Display size={18}>{day.label}</Display>
                <View style={styles.dayLine} />
                <AppText size={12} color={colors.muted}>{day.date}</AppText>
              </View>
              {day.items.map((it) => {
                const p = places[it.placeId];
                return (
                  <Pressable
                    key={it.placeId + it.timeLabel}
                    onPress={() => router.push({ pathname: '/place/[id]', params: { id: it.placeId } })}
                    style={[styles.itinRow, shadow.card]}
                  >
                    <View style={[styles.itinIcon, { backgroundColor: p?.tint ?? colors.teal }]}>
                      <GlyphPath d={it.path} size={20} color={colors.white} strokeWidth={1.9} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <AppText variant="semibold" size={11} color={colors.muted}>{it.timeLabel}</AppText>
                      <Display size={16}>{p?.name ?? it.placeId}</Display>
                    </View>
                    <Icon name="list" size={18} color={colors.faint} strokeWidth={2.2} />
                  </Pressable>
                );
              })}
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  headRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 13 },
  gridItem: { width: '48%' },
  empty: { alignItems: 'center', paddingVertical: 60, paddingHorizontal: 8 },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  emptyText: { textAlign: 'center', marginTop: 6, lineHeight: 21 },
  cta: {
    marginTop: 20,
    backgroundColor: colors.teal,
    borderRadius: radius.md,
    paddingVertical: 13,
    paddingHorizontal: 22,
  },
  dayHead: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  dayLine: { flex: 1, height: 1, backgroundColor: colors.card },
  itinRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 11,
    marginBottom: 10,
  },
  itinIcon: { width: 46, height: 46, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
});
