import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, View } from 'react-native';
import type { EventItem, Place } from '../data/places';
import { usePlaceActions } from '../lib/usePlaceActions';
import { colors, radius, shadow } from '../theme';
import { Icon } from './Icon';
import { PhotoBlock } from './PhotoBlock';
import { Badge, HeartButton } from './primitives';
import { AppText, Display } from './Text';

function MonoTag({ children }: { children: string }) {
  return (
    <AppText variant="mono" size={9} color="rgba(255,255,255,0.62)" style={styles.monoTag}>
      {children}
    </AppText>
  );
}

function CatChip({ label }: { label: string }) {
  return (
    <View style={styles.catChip}>
      <AppText variant="semibold" size={10} color={colors.white}>
        {label}
      </AppText>
    </View>
  );
}

/** Wide card used in Discover collections. */
export function CollectionCard({ place, width = 228 }: { place: Place; width?: number }) {
  const { isSaved, open, onHeart } = usePlaceActions();
  const saved = isSaved(place.id);
  return (
    <Pressable onPress={() => open(place.id)} style={{ width }}>
      <PhotoBlock tint={place.tint} style={styles.collectionPhoto}>
        <LinearGradient
          colors={['rgba(10,20,22,0.35)', 'rgba(10,20,22,0)']}
          start={{ x: 0, y: 1 }}
          end={{ x: 0, y: 0.45 }}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.tlChip}>
          <CatChip label={place.catLabel} />
        </View>
        <View style={styles.trHeart}>
          <HeartButton saved={saved} onPress={() => onHeart(place.id)} size={16} />
        </View>
        <View style={styles.blMono}>
          <MonoTag>photo</MonoTag>
        </View>
      </PhotoBlock>
      <Display size={16} style={{ marginTop: 9 }} numberOfLines={1}>
        {place.name}
      </Display>
      <View style={styles.metaRow}>
        <AppText size={12} color={colors.muted}>
          {place.area}
        </AppText>
        <View style={styles.dot} />
        <AppText size={12} color={colors.muted}>
          {place.tags[0]}
        </AppText>
      </View>
    </Pressable>
  );
}

/** Small card used for "Nearby" on the detail screen. */
export function NearbyCard({ place }: { place: Place }) {
  const { open } = usePlaceActions();
  return (
    <Pressable onPress={() => open(place.id)} style={{ width: 150 }}>
      <PhotoBlock tint={place.tint} style={styles.nearbyPhoto} />
      <Display size={14} style={{ marginTop: 7 }} numberOfLines={1}>
        {place.name}
      </Display>
      <AppText size={11} color={colors.muted} style={{ marginTop: 1 }}>
        {place.area}
      </AppText>
    </Pressable>
  );
}

/** Horizontal list row on Explore. */
export function ExploreRow({ place }: { place: Place }) {
  const { isSaved, open, onHeart } = usePlaceActions();
  const saved = isSaved(place.id);
  return (
    <Pressable onPress={() => open(place.id)} style={[styles.row, shadow.card]}>
      <PhotoBlock tint={place.tint} style={styles.rowPhoto}>
        <View style={styles.blMonoSm}>
          <MonoTag>photo</MonoTag>
        </View>
      </PhotoBlock>
      <View style={styles.rowBody}>
        <View style={styles.rowTop}>
          <View style={{ flex: 1 }}>
            <Display size={17} numberOfLines={1}>
              {place.name}
            </Display>
            <AppText size={12} color={colors.muted} style={{ marginTop: 2 }}>
              {place.catLabel} · {place.area}
            </AppText>
          </View>
          <HeartButton saved={saved} onPress={() => onHeart(place.id)} variant="plain" />
        </View>
        <View style={styles.rowMeta}>
          <View style={styles.openPill}>
            <AppText variant="semibold" size={11} color={colors.green}>
              {place.openNow ? 'Open now' : 'Tide-dependent'}
            </AppText>
          </View>
          <AppText variant="medium" size={12} color={colors.muted}>
            {place.price}
          </AppText>
          <View style={styles.dot} />
          <AppText size={12} color={colors.muted}>
            {place.tags[0]}
          </AppText>
        </View>
      </View>
    </Pressable>
  );
}

/** Grid card on My Trip → Saved. */
export function SavedCard({ place }: { place: Place }) {
  const { open, onHeart } = usePlaceActions();
  return (
    <Pressable onPress={() => open(place.id)} style={{ flex: 1 }}>
      <PhotoBlock tint={place.tint} style={styles.savedPhoto}>
        <View style={styles.offlineChip}>
          <Icon name="download" size={11} color={colors.white} strokeWidth={2.4} />
          <AppText variant="semibold" size={9} color={colors.white}>
            Offline
          </AppText>
        </View>
        <View style={styles.savedHeart}>
          <HeartButton saved onPress={() => onHeart(place.id)} size={15} />
        </View>
      </PhotoBlock>
      <Display size={15} style={{ marginTop: 7 }} numberOfLines={1}>
        {place.name}
      </Display>
      <AppText size={12} color={colors.muted} style={{ marginTop: 1 }}>
        {place.area}
      </AppText>
    </Pressable>
  );
}

/** Event card in the Discover "Happening this week" rail. */
export function EventDiscoverCard({ event, onOpen }: { event: EventItem; onOpen: () => void }) {
  return (
    <Pressable onPress={onOpen} style={{ width: 172 }}>
      <PhotoBlock tint={event.tint} style={styles.eventDiscoverPhoto}>
        <View style={styles.dateBadge}>
          <AppText variant="bold" size={10} color={colors.coral} tracking={0.6}>
            {event.date}
          </AppText>
          <Display size={17}>{event.day}</Display>
        </View>
      </PhotoBlock>
      <Display size={15} style={{ marginTop: 8 }} numberOfLines={2}>
        {event.name}
      </Display>
      <AppText size={12} color={colors.muted} style={{ marginTop: 2 }}>
        {event.time} · {event.venue}
      </AppText>
    </Pressable>
  );
}

/** Event row on the Events agenda. */
export function EventAgendaRow({ event, onOpen }: { event: EventItem; onOpen: () => void }) {
  return (
    <Pressable onPress={onOpen} style={styles.agendaRow}>
      <View style={styles.agendaDate}>
        <AppText variant="bold" size={11} color={colors.coral} tracking={0.6}>
          {event.date}
        </AppText>
        <Display size={26}>{event.day}</Display>
        <View style={[styles.agendaDot, { backgroundColor: event.tint }]} />
      </View>
      <PhotoBlock tint={event.tint} style={styles.agendaPhoto}>
        <LinearGradient
          colors={['rgba(10,20,22,0.55)', 'rgba(10,20,22,0)']}
          start={{ x: 0, y: 1 }}
          end={{ x: 0, y: 0.4 }}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.agendaTag}>
          <AppText variant="bold" size={11} color={colors.ink}>
            {event.tag}
          </AppText>
        </View>
        <View style={styles.agendaBody}>
          <Display size={19} color={colors.white} numberOfLines={1}>
            {event.name}
          </Display>
          <AppText size={12} color="rgba(255,255,255,0.88)" style={{ marginTop: 3 }}>
            {event.time} · {event.venue}
          </AppText>
        </View>
      </PhotoBlock>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  monoTag: { textTransform: 'uppercase', letterSpacing: 0.4 },
  catChip: {
    backgroundColor: 'rgba(10,20,22,0.34)',
    borderRadius: radius.pill,
    paddingVertical: 4,
    paddingHorizontal: 9,
  },
  collectionPhoto: { height: 152, borderRadius: 16 },
  nearbyPhoto: { height: 104, borderRadius: 14 },
  tlChip: { position: 'absolute', left: 9, top: 9 },
  trHeart: { position: 'absolute', right: 9, top: 9 },
  blMono: { position: 'absolute', left: 9, bottom: 8 },
  blMonoSm: { position: 'absolute', left: 6, bottom: 5 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 3 },
  dot: { width: 3, height: 3, borderRadius: 9, backgroundColor: '#b8c0c0' },

  row: {
    flexDirection: 'row',
    gap: 13,
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: 11,
    marginBottom: 13,
  },
  rowPhoto: { width: 104, height: 104, borderRadius: 14 },
  rowBody: { flex: 1, minWidth: 0 },
  rowTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  rowMeta: { marginTop: 'auto', flexDirection: 'row', alignItems: 'center', gap: 7, flexWrap: 'wrap', paddingTop: 8 },
  openPill: {
    backgroundColor: 'rgba(47,122,79,0.10)',
    borderRadius: radius.pill,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },

  savedPhoto: { height: 130, borderRadius: 16 },
  offlineChip: {
    position: 'absolute',
    top: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(10,20,22,0.34)',
    borderRadius: radius.pill,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  savedHeart: { position: 'absolute', top: 7, right: 7 },

  eventDiscoverPhoto: { height: 118, borderRadius: 16 },
  dateBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: colors.white,
    borderRadius: 11,
    paddingVertical: 5,
    paddingHorizontal: 9,
    alignItems: 'center',
  },

  agendaRow: { flexDirection: 'row', gap: 14, marginBottom: 18 },
  agendaDate: { width: 54, alignItems: 'center' },
  agendaDot: { width: 7, height: 7, borderRadius: 9, marginTop: 8 },
  agendaPhoto: { flex: 1, minHeight: 128, borderRadius: 18, justifyContent: 'flex-end', padding: 14 },
  agendaTag: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: radius.pill,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  agendaBody: {},
});

export { Badge };
