import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Linking, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Defs, Line, Pattern, Rect, Svg } from 'react-native-svg';
import { NearbyCard } from '@/components/cards';
import { GlyphPath, Icon } from '@/components/Icon';
import { PhotoBlock } from '@/components/PhotoBlock';
import { HeartButton } from '@/components/primitives';
import { AppText, Display } from '@/components/Text';
import { placeFacts, TIP_BANK } from '@/data/places';
import { usePlaces } from '@/lib/catalog';
import { useToast } from '@/components/Toast';
import { usePlaceActions } from '@/lib/usePlaceActions';
import { colors, radius, shadow } from '@/theme';

export default function PlaceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const flash = useToast();
  const places = usePlaces();
  const { isSaved, onHeart } = usePlaceActions();

  const place = id ? places[id] : undefined;
  if (!place) {
    return (
      <View style={[styles.root, { alignItems: 'center', justifyContent: 'center' }]}>
        <AppText color={colors.muted}>Place not found.</AppText>
      </View>
    );
  }

  const facts = placeFacts(place);
  const tips = TIP_BANK[place.id] ?? TIP_BANK.default;
  const nearby = Object.values(places).filter((p) => p.id !== place.id).slice(0, 4);
  const saved = isSaved(place.id);

  const directions = () => {
    flash('Opening Directions…');
    Linking.openURL(
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name + ' Siargao')}`,
    ).catch(() => {});
  };

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 0 }}>
        {/* Gallery header */}
        <PhotoBlock tint={place.tint} style={styles.header} gap={15} opacity={0.07}>
          <LinearGradient
            colors={['rgba(255,255,255,0.22)', 'rgba(10,20,22,0)', 'rgba(10,20,22,0)', 'rgba(10,20,22,0.25)']}
            locations={[0, 0.22, 0.6, 1]}
            style={StyleSheet.absoluteFill}
          />
          <AppText variant="mono" size={10} color="rgba(255,255,255,0.7)" style={styles.galleryMono}>
            PHOTO GALLERY · {place.name.toUpperCase()}
          </AppText>
          <View style={styles.dots}>
            <View style={[styles.dot, { width: 22, backgroundColor: colors.white }]} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>
        </PhotoBlock>

        {/* Sheet */}
        <View style={styles.sheet}>
          <View style={styles.badges}>
            <Badge text={place.openNow ? 'Open now' : 'Tide-dependent'} color={colors.white} bg={colors.green} />
            <Badge text={place.catLabel} color={colors.teal} bg="rgba(14,124,134,0.1)" />
            <Badge text={place.priceLabel} color={colors.orange} bg="rgba(242,118,46,0.12)" />
          </View>
          <Display size={30} style={{ lineHeight: 32 }}>{place.name}</Display>
          <View style={styles.areaRow}>
            <Icon name="pin" size={15} color={colors.muted} strokeWidth={2} />
            <AppText variant="medium" size={14} color={colors.muted}>{place.area}, Siargao</AppText>
          </View>

          {/* Facts */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.facts}>
            {facts.map((f) => (
              <View key={f.label} style={[styles.fact, shadow.card]}>
                <GlyphPath d={f.path} size={18} color={colors.teal} strokeWidth={1.9} />
                <AppText variant="semibold" size={10} color={colors.muted} style={styles.factLabel}>
                  {f.label.toUpperCase()}
                </AppText>
                <AppText variant="semibold" size={13} color={colors.ink} style={{ marginTop: 2 }}>
                  {f.value}
                </AppText>
              </View>
            ))}
          </ScrollView>

          <Display size={18} style={{ marginTop: 22 }}>The lowdown</Display>
          <AppText size={15} color={colors.body} style={{ marginTop: 8, lineHeight: 24 }}>{place.blurb}</AppText>

          {/* Mini map */}
          <View style={styles.miniMap}>
            <Svg style={StyleSheet.absoluteFill} width="100%" height="100%">
              <Defs>
                <Pattern id="dgrid" patternUnits="userSpaceOnUse" width={30} height={30}>
                  <Line x1={0} y1={0} x2={30} y2={0} stroke="rgba(14,124,134,0.07)" strokeWidth={1} />
                  <Line x1={0} y1={0} x2={0} y2={30} stroke="rgba(14,124,134,0.07)" strokeWidth={1} />
                </Pattern>
              </Defs>
              <Rect width="100%" height="100%" fill="url(#dgrid)" />
            </Svg>
            <View style={styles.miniPin}>
              <View style={[styles.miniPinBody, { backgroundColor: place.tint }]} />
            </View>
            <Pressable onPress={directions} style={[styles.dirBtn, shadow.card]}>
              <Icon name="navigation" size={15} color={colors.teal} strokeWidth={2.2} />
              <AppText variant="semibold" size={13} color={colors.teal}>Open Directions</AppText>
            </Pressable>
          </View>

          {/* Good to know */}
          <View style={styles.tipsBox}>
            <View style={styles.tipsHead}>
              <Icon name="info" size={17} color={colors.tealDark} strokeWidth={2} />
              <Display size={16}>Good to know</Display>
            </View>
            {tips.map((tip) => (
              <View key={tip} style={styles.tipRow}>
                <View style={styles.tipDot} />
                <AppText size={14} color={colors.body} style={{ flex: 1, lineHeight: 20 }}>{tip}</AppText>
              </View>
            ))}
          </View>

          {/* Nearby */}
          <Display size={18} style={{ marginTop: 24 }}>Nearby</Display>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.nearby}>
            {nearby.map((p) => (
              <NearbyCard key={p.id} place={p} />
            ))}
          </ScrollView>
          <View style={{ height: 120 }} />
        </View>
      </ScrollView>

      {/* Top bar */}
      <View style={[styles.topBar, { top: insets.top + 6 }]}>
        <Pressable onPress={() => router.back()} style={[styles.roundBtn, shadow.card]}>
          <Icon name="chevronLeft" size={21} color={colors.ink} strokeWidth={2.2} />
        </Pressable>
        <Pressable onPress={() => onHeart(place.id)} style={[styles.roundBtn, shadow.card]}>
          <Icon name="heart" size={21} color={saved ? colors.coral : colors.faint} fill={saved ? colors.coral : 'none'} />
        </Pressable>
      </View>

      {/* Sticky action bar */}
      <View style={[styles.actionBar, { paddingBottom: insets.bottom + 14 }]}>
        <ActionBtn icon="whatsapp" label="WhatsApp" bg={colors.green} onPress={() => flash('Opening WhatsApp…')} />
        <ActionBtn icon="navigation" label="Directions" bg={colors.orange} onPress={directions} />
        <ActionBtn icon="phone" label="Call" bg={colors.ink} onPress={() => flash('Calling…')} />
      </View>
    </View>
  );
}

function Badge({ text, color, bg }: { text: string; color: string; bg: string }) {
  return (
    <View style={{ backgroundColor: bg, borderRadius: radius.pill, paddingVertical: 5, paddingHorizontal: 11 }}>
      <AppText variant="semibold" size={11} color={color}>{text}</AppText>
    </View>
  );
}

function ActionBtn({
  icon,
  label,
  bg,
  onPress,
}: {
  icon: 'whatsapp' | 'navigation' | 'phone';
  label: string;
  bg: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={[styles.actionBtn, { backgroundColor: bg }]}>
      <Icon name={icon} size={20} color={colors.white} />
      <AppText variant="bold" size={12} color={colors.white}>{label}</AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  header: { height: 340 },
  galleryMono: { position: 'absolute', left: 12, bottom: 46, textTransform: 'uppercase', letterSpacing: 0.5 },
  dots: { position: 'absolute', left: 0, right: 0, bottom: 30, flexDirection: 'row', justifyContent: 'center', gap: 6 },
  dot: { width: 6, height: 6, borderRadius: 9, backgroundColor: 'rgba(255,255,255,0.55)' },
  sheet: {
    marginTop: -26,
    backgroundColor: colors.bg,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    paddingHorizontal: 22,
    paddingTop: 22,
  },
  badges: { flexDirection: 'row', gap: 7, marginBottom: 10, flexWrap: 'wrap' },
  areaRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 6 },
  facts: { gap: 9, marginTop: 18, paddingBottom: 4 },
  fact: { backgroundColor: colors.white, borderRadius: 14, padding: 12, minWidth: 96 },
  factLabel: { letterSpacing: 0.4, marginTop: 8 },
  miniMap: {
    height: 150,
    borderRadius: 18,
    overflow: 'hidden',
    marginTop: 20,
    backgroundColor: '#dfe6e2',
  },
  miniPin: { position: 'absolute', left: '50%', top: '50%', transform: [{ translateX: -15 }, { translateY: -30 }] },
  miniPinBody: {
    width: 30,
    height: 30,
    borderTopLeftRadius: 999,
    borderTopRightRadius: 999,
    borderBottomRightRadius: 999,
    borderBottomLeftRadius: 2,
    transform: [{ rotate: '45deg' }],
    borderWidth: 3,
    borderColor: colors.white,
  },
  dirBtn: {
    position: 'absolute',
    right: 12,
    bottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingVertical: 9,
    paddingHorizontal: 14,
  },
  tipsBox: { backgroundColor: colors.card, borderRadius: 18, padding: 16, marginTop: 20 },
  tipsHead: { flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 4 },
  tipRow: { flexDirection: 'row', gap: 9, marginTop: 11, alignItems: 'flex-start' },
  tipDot: { width: 5, height: 5, borderRadius: 9, backgroundColor: colors.teal, marginTop: 7 },
  nearby: { gap: 13, marginTop: 13, paddingBottom: 4 },
  topBar: {
    position: 'absolute',
    left: 18,
    right: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 5,
  },
  roundBtn: {
    width: 40,
    height: 40,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    gap: 10,
    backgroundColor: 'rgba(244,236,224,0.96)',
    borderTopWidth: 1,
    borderTopColor: colors.line,
    paddingTop: 12,
    paddingHorizontal: 18,
  },
  actionBtn: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    gap: 4,
  },
});
