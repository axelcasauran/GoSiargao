import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CollectionCard, EventDiscoverCard } from '@/components/cards';
import { GlyphPath, Icon } from '@/components/Icon';
import { PhotoBlock } from '@/components/PhotoBlock';
import { HeartButton } from '@/components/primitives';
import { AppText, Display } from '@/components/Text';
import { CATEGORIES, COLLECTIONS, EVENTS } from '@/data/places';
import { usePlaces } from '@/lib/catalog';
import { usePlaceActions } from '@/lib/usePlaceActions';
import { colors, radius, shadow } from '@/theme';

export default function DiscoverScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const places = usePlaces();
  const { isSaved, open, onHeart } = usePlaceActions();
  const hero = places.cloud9;

  return (
    <ScrollView
      style={styles.root}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingTop: insets.top + 6, paddingBottom: 24 }}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <AppText variant="semibold" size={11} color={colors.muted} tracking={1.3} style={styles.kicker}>
            YOU&apos;RE ON
          </AppText>
          <View style={styles.locRow}>
            <Icon name="pin" size={15} color={colors.teal} strokeWidth={2.2} />
            <Display size={21} color={colors.ink}>
              Siargao Island
            </Display>
          </View>
        </View>
        <Pressable style={[styles.iconBtn, shadow.card]} onPress={() => router.push('/search')}>
          <Icon name="search" size={20} color={colors.ink} />
        </Pressable>
      </View>

      {/* Live surf strip */}
      <View style={styles.surf}>
        <Icon name="waves" size={18} color={colors.white} />
        <AppText size={13} color={colors.white} style={{ flex: 1 }}>
          <AppText variant="bold" size={13} color={colors.white}>Cloud 9</AppText> · 3–4ft clean · offshore winds
        </AppText>
        <AppText variant="semibold" size={11} color="rgba(255,255,255,0.8)">LIVE</AppText>
      </View>

      {/* Hero */}
      {hero ? (
        <Pressable onPress={() => open(hero.id)} style={[styles.hero, shadow.raised]}>
          <PhotoBlock tint={hero.tint} image={hero.image} style={styles.heroFill} gap={14} opacity={0.07} />
          <LinearGradient
            colors={['rgba(10,20,22,0.74)', 'rgba(10,20,22,0.1)', 'rgba(10,20,22,0.18)']}
            locations={[0, 0.54, 1]}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.featured}>
            <Icon name="star" size={13} color={colors.white} />
            <AppText variant="bold" size={11} color={colors.white} tracking={0.4}>FEATURED</AppText>
          </View>
          <View style={styles.heroHeart}>
            <HeartButton saved={isSaved(hero.id)} onPress={() => onHeart(hero.id)} size={19} />
          </View>
          <View style={styles.heroFooter}>
            <View style={styles.heroTags}>
              <View style={styles.openNow}>
                <AppText variant="semibold" size={11} color={colors.white}>Open now</AppText>
              </View>
              <AppText variant="medium" size={12} color="rgba(255,255,255,0.85)">General Luna</AppText>
            </View>
            <Display size={30} color={colors.white} style={{ lineHeight: 32 }}>
              Catch the sunrise{'\n'}at Cloud 9
            </Display>
          </View>
        </Pressable>
      ) : null}

      {/* Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.catRow}
      >
        {CATEGORIES.map((cat) => (
          <Pressable
            key={cat.key}
            style={styles.cat}
            onPress={() => router.push(cat.key === 'events' ? '/events' : '/explore')}
          >
            <View style={[styles.catIcon, { backgroundColor: cat.tint }, shadow.card]}>
              <GlyphPath d={cat.path} size={25} color={colors.white} strokeWidth={1.9} />
            </View>
            <AppText variant="semibold" size={12}>{cat.label}</AppText>
          </Pressable>
        ))}
      </ScrollView>

      {/* Happening this week */}
      <View style={styles.sectionHead}>
        <Display size={20}>Happening this week</Display>
        <Pressable onPress={() => router.push('/events')}>
          <AppText variant="semibold" size={13} color={colors.teal}>See all</AppText>
        </Pressable>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.railRow}>
        {EVENTS.slice(0, 3).map((ev) => (
          <EventDiscoverCard
            key={ev.id}
            event={ev}
            onOpen={() => (ev.place ? open(ev.place) : undefined)}
          />
        ))}
      </ScrollView>

      {/* Collections */}
      {COLLECTIONS.map((col) => (
        <View key={col.key} style={{ marginTop: 8 }}>
          <View style={styles.sectionHead}>
            <Display size={20}>{col.title}</Display>
            <Pressable onPress={() => router.push('/explore')}>
              <AppText variant="semibold" size={13} color={colors.teal}>See all</AppText>
            </Pressable>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.railRowWide}>
            {col.items.map((slug) => {
              const p = places[slug];
              return p ? <CollectionCard key={slug} place={p} /> : null;
            })}
          </ScrollView>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    paddingVertical: 4,
  },
  kicker: { textTransform: 'uppercase' },
  locRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 1 },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  surf: {
    marginHorizontal: 22,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.teal,
    borderRadius: 14,
    paddingVertical: 11,
    paddingHorizontal: 14,
  },
  hero: {
    marginHorizontal: 22,
    marginTop: 18,
    height: 420,
    borderRadius: 20,
    overflow: 'hidden',
  },
  heroFill: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  featured: {
    position: 'absolute',
    top: 14,
    left: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.orange,
    borderRadius: radius.pill,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  heroHeart: { position: 'absolute', top: 13, right: 13 },
  heroFooter: { position: 'absolute', left: 18, right: 18, bottom: 42 },
  heroTags: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  openNow: {
    backgroundColor: 'rgba(47,122,79,0.9)',
    borderRadius: radius.pill,
    paddingVertical: 4,
    paddingHorizontal: 9,
  },
  catRow: { gap: 10, paddingHorizontal: 22, paddingTop: 22, paddingBottom: 6 },
  cat: { alignItems: 'center', gap: 8, width: 64 },
  catIcon: {
    width: 58,
    height: 58,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHead: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    paddingTop: 18,
  },
  railRow: { gap: 12, paddingHorizontal: 22, paddingTop: 14, paddingBottom: 4 },
  railRowWide: { gap: 14, paddingHorizontal: 22, paddingTop: 14, paddingBottom: 6 },
});
