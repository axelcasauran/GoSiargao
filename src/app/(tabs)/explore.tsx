import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Defs, Line, Pattern, Rect, Svg } from 'react-native-svg';
import { ExploreRow } from '@/components/cards';
import { GlyphPath, Icon } from '@/components/Icon';
import { PhotoBlock } from '@/components/PhotoBlock';
import { Chip, Segmented } from '@/components/primitives';
import { AppText, Display } from '@/components/Text';
import { catPath, EXPLORE_CHIPS, MAP_PINS, type Place } from '@/data/places';
import { usePlaces } from '@/lib/catalog';
import { usePlaceActions } from '@/lib/usePlaceActions';
import { colors, radius, shadow } from '@/theme';

function matchesFilter(p: Place, f: string): boolean {
  if (f === 'Open Now') return p.openNow;
  if (f === 'Free') return p.price === 'Free';
  if (f === 'Foodie') return p.cat === 'eat';
  if (f === 'Surf') return `${p.tags.join(' ')} ${p.catLabel}`.toLowerCase().includes('surf');
  return `${p.name} ${p.area}`.toLowerCase().includes(f.toLowerCase());
}

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();
  const places = usePlaces();
  const [view, setView] = useState<'list' | 'map'>('list');
  const [filters, setFilters] = useState<string[]>(['Open Now']);

  const list = useMemo(() => {
    const all = Object.values(places);
    if (filters.length === 0) return all;
    return all.filter((p) => filters.every((f) => matchesFilter(p, f)));
  }, [places, filters]);

  const toggleFilter = (f: string) =>
    setFilters((prev) => (prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]));

  return (
    <View style={styles.root}>
      <View style={{ paddingTop: insets.top + 8, paddingHorizontal: 22 }}>
        <View style={styles.headRow}>
          <Display size={26}>Explore</Display>
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
          {EXPLORE_CHIPS.map((c) => (
            <Chip key={c} label={c} active={filters.includes(c)} onPress={() => toggleFilter(c)} />
          ))}
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
              No spots match those filters.
            </AppText>
          ) : null}
        </ScrollView>
      ) : (
        <MapView places={places} bottomInset={insets.bottom} />
      )}
    </View>
  );
}

function MapView({ places, bottomInset }: { places: Record<string, Place>; bottomInset: number }) {
  const { open } = usePlaceActions();
  const [sel, setSel] = useState('cloud9');
  const preview = places[sel];

  return (
    <View style={styles.map}>
      {/* grid + landmass blobs */}
      <Svg style={StyleSheet.absoluteFill} width="100%" height="100%">
        <Defs>
          <Pattern id="grid" patternUnits="userSpaceOnUse" width={38} height={38}>
            <Line x1={0} y1={0} x2={38} y2={0} stroke="rgba(14,124,134,0.06)" strokeWidth={1} />
            <Line x1={0} y1={0} x2={0} y2={38} stroke="rgba(14,124,134,0.06)" strokeWidth={1} />
          </Pattern>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#grid)" />
      </Svg>
      <View style={styles.blobA} />
      <View style={styles.blobB} />

      {/* pins */}
      {MAP_PINS.map((pin) => {
        const p = places[pin.id];
        if (!p) return null;
        const selected = pin.id === sel;
        const size = selected ? 40 : 30;
        return (
          <Pressable
            key={pin.id}
            onPress={() => setSel(pin.id)}
            style={[styles.pin, { left: pin.x as any, top: pin.y as any, transform: [{ translateX: -size / 2 }, { translateY: -size }] }]}
          >
            <View style={[styles.pinBody, { width: size, height: size, backgroundColor: p.tint }]}>
              <View style={{ transform: [{ rotate: '-45deg' }] }}>
                <GlyphPath d={catPath(p.cat)} size={14} color={colors.white} strokeWidth={2.2} />
              </View>
            </View>
          </Pressable>
        );
      })}

      {/* offline download pill */}
      <View style={styles.dlWrap}>
        <View style={[styles.dlPill, shadow.card]}>
          <Icon name="download" size={15} color={colors.green} strokeWidth={2.2} />
          <AppText variant="semibold" size={12}>Offline map downloaded</AppText>
        </View>
      </View>

      {/* preview card */}
      {preview ? (
        <Pressable onPress={() => open(preview.id)} style={[styles.preview, { bottom: 18 + bottomInset }, shadow.raised]}>
          <PhotoBlock tint={preview.tint} image={preview.image} style={styles.previewPhoto} />
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <AppText variant="semibold" size={11} color={preview.tint}>{preview.catLabel}</AppText>
            <Display size={18} style={{ marginTop: 1 }}>{preview.name}</Display>
            <AppText size={12} color={colors.muted} style={{ marginTop: 3 }}>
              {preview.area} · {preview.price} · {preview.tags[0]}
            </AppText>
          </View>
          <Icon name="chevronRight" size={20} color={colors.faint} strokeWidth={2.4} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  headRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  chips: { gap: 8, paddingVertical: 14 },
  map: { flex: 1, overflow: 'hidden', backgroundColor: '#dfe6e2' },
  blobA: {
    position: 'absolute',
    left: '-10%',
    top: '18%',
    width: '60%',
    height: '30%',
    backgroundColor: 'rgba(47,122,79,0.16)',
    borderRadius: 160,
  },
  blobB: {
    position: 'absolute',
    right: '-12%',
    bottom: '8%',
    width: '55%',
    height: '40%',
    backgroundColor: 'rgba(14,124,134,0.12)',
    borderRadius: 160,
  },
  pin: { position: 'absolute', zIndex: 2 },
  pinBody: {
    borderTopLeftRadius: 999,
    borderTopRightRadius: 999,
    borderBottomRightRadius: 999,
    borderBottomLeftRadius: 2,
    transform: [{ rotate: '45deg' }],
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: colors.white,
    ...shadow.card,
  },
  dlWrap: { position: 'absolute', top: 14, left: 0, right: 0, alignItems: 'center' },
  dlPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: colors.white,
    borderRadius: radius.pill,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  preview: {
    position: 'absolute',
    left: 18,
    right: 18,
    flexDirection: 'row',
    gap: 12,
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: 11,
    zIndex: 3,
  },
  previewPhoto: { width: 84, height: 84, borderRadius: 14 },
});
