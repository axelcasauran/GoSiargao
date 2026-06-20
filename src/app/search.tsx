import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon } from '@/components/Icon';
import { PhotoBlock } from '@/components/PhotoBlock';
import { AppText, Display } from '@/components/Text';
import { POPULAR, RECENTS, type Place } from '@/data/places';
import { usePlaces } from '@/lib/catalog';
import { colors, fonts, radius, shadow } from '@/theme';

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const places = usePlaces();
  const [query, setQuery] = useState('');

  const q = query.trim().toLowerCase();
  const results = useMemo<Place[]>(() => {
    if (!q) return [];
    return Object.values(places).filter((p) =>
      `${p.name} ${p.area} ${p.catLabel} ${p.tags.join(' ')}`.toLowerCase().includes(q),
    );
  }, [places, q]);

  const openPlace = (slug: string) => router.replace({ pathname: '/place/[id]', params: { id: slug } });

  return (
    <View style={[styles.root, { paddingTop: insets.top + 6 }]}>
      <View style={styles.searchRow}>
        <View style={[styles.field, shadow.card]}>
          <Icon name="search" size={19} color={colors.muted} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Tacos, lagoons, sunset..."
            placeholderTextColor={colors.faint}
            style={styles.input}
            autoFocus
            returnKeyType="search"
          />
        </View>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <AppText variant="semibold" size={14} color={colors.teal}>Cancel</AppText>
        </Pressable>
      </View>

      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 22, paddingTop: 6, paddingBottom: 30 + insets.bottom }}
      >
        {!q ? (
          <View>
            <AppText variant="bold" size={12} color={colors.muted} tracking={0.9} style={styles.label}>
              POPULAR RIGHT NOW
            </AppText>
            <View style={styles.popular}>
              {POPULAR.map((p) => (
                <Pressable key={p} onPress={() => setQuery(p)} style={styles.popularChip}>
                  <AppText variant="medium" size={14}>{p}</AppText>
                </Pressable>
              ))}
            </View>
            <AppText variant="bold" size={12} color={colors.muted} tracking={0.9} style={[styles.label, { marginTop: 26 }]}>
              RECENT
            </AppText>
            {RECENTS.map((r) => (
              <Pressable key={r} onPress={() => setQuery(r)} style={styles.recentRow}>
                <Icon name="clock" size={17} color={colors.faint} strokeWidth={2} />
                <AppText size={15} color={colors.body}>{r}</AppText>
              </Pressable>
            ))}
          </View>
        ) : (
          <View>
            <AppText variant="bold" size={12} color={colors.muted} tracking={0.7} style={styles.label}>
              {results.length} RESULTS
            </AppText>
            {results.map((p) => (
              <Pressable key={p.id} onPress={() => openPlace(p.id)} style={styles.resultRow}>
                <PhotoBlock tint={p.tint} style={styles.resultPhoto} gap={9} opacity={0.1} />
                <View style={{ flex: 1 }}>
                  <Display size={16}>{p.name}</Display>
                  <AppText size={12} color={colors.muted}>{p.catLabel} · {p.area}</AppText>
                </View>
                <Icon name="chevronRight" size={18} color={colors.faint} strokeWidth={2.2} />
              </Pressable>
            ))}
            {results.length === 0 ? (
              <View style={styles.noResults}>
                <Display size={18} style={{ textAlign: 'center' }}>No spots match that</Display>
                <AppText size={14} color={colors.muted} style={{ marginTop: 5, textAlign: 'center' }}>
                  Try “lagoon”, “pizza”, or a beach name.
                </AppText>
              </View>
            ) : null}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 18,
    paddingBottom: 12,
  },
  field: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    backgroundColor: colors.white,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  input: { flex: 1, fontFamily: fonts.regular, fontSize: 15, color: colors.ink, padding: 0 },
  label: { textTransform: 'uppercase', marginVertical: 6 },
  popular: { flexDirection: 'row', flexWrap: 'wrap', gap: 9 },
  popularChip: {
    borderWidth: 1,
    borderColor: colors.card,
    backgroundColor: colors.white,
    borderRadius: radius.pill,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  recentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  resultPhoto: { width: 56, height: 56, borderRadius: 12 },
  noResults: { alignItems: 'center', paddingVertical: 50 },
});
