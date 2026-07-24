import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ExploreRow } from '@/components/cards';
import { OfflineMap } from '@/components/OfflineMap';
import { Segmented } from '@/components/primitives';
import { AppText, Display } from '@/components/Text';
import { CATEGORY_FILTERS, placeInCategory, type Place } from '@/data/places';
import { usePlaces } from '@/lib/catalog';
import { usePlaceActions } from '@/lib/usePlaceActions';
import { colors, radius } from '@/theme';

function score(p: Place): number {
  return (p.rating ?? 0) * Math.log10((p.reviews ?? 0) + 10);
}

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();
  const places = usePlaces();
  const { open } = usePlaceActions();
  const [view, setView] = useState<'list' | 'map'>('list');
  const [cat, setCat] = useState('all');

  const list = useMemo(() => {
    return Object.values(places)
      .filter((p) => placeInCategory(p, cat))
      .sort((a, b) => score(b) - score(a));
  }, [places, cat]);

  return (
    <View style={styles.root}>
      <View style={{ paddingTop: insets.top + 8, paddingHorizontal: 22 }}>
        <View style={styles.headRow}>
          <View>
            <Display size={26}>Explore</Display>
            <AppText size={12} color={colors.muted} style={{ marginTop: 1 }}>
              {list.length} places · General Luna & around
            </AppText>
          </View>
          <Segmented
            value={view}
            onChange={(k) => setView(k as 'list' | 'map')}
            options={[
              { key: 'list', label: 'List', icon: 'list' },
              { key: 'map', label: 'Map', icon: 'map' },
            ]}
          />
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
          {CATEGORY_FILTERS.map((c) => {
            const active = c.key === cat;
            return (
              <Pressable
                key={c.key}
                onPress={() => setCat(c.key)}
                style={[
                  styles.catChip,
                  {
                    backgroundColor: active ? c.tint : 'transparent',
                    borderColor: active ? c.tint : colors.lineStrong,
                  },
                ]}
              >
                <AppText variant="semibold" size={13} color={active ? colors.white : colors.ink}>
                  {c.label}
                </AppText>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {view === 'list' ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 22, paddingTop: 6, paddingBottom: 100 + insets.bottom }}
        >
          {list.map((p) => (
            <ExploreRow key={p.id} place={p} />
          ))}
          {list.length === 0 ? (
            <AppText size={14} color={colors.muted} style={{ textAlign: 'center', paddingTop: 40 }}>
              No spots match that filter.
            </AppText>
          ) : null}
        </ScrollView>
      ) : (
        <OfflineMap places={list} onOpen={open} bottomInset={insets.bottom} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  headRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  chips: { gap: 8, paddingVertical: 14 },
  catChip: {
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
});
