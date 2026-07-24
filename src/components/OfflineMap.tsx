import { Image } from 'expo-image';
import { useEffect, useMemo, useRef, useState } from 'react';
import { type LayoutChangeEvent, Pressable, StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { Defs, Line, Pattern, Rect, Svg } from 'react-native-svg';
import { catPath, type Place } from '@/data/places';
import { colors, radius, shadow } from '@/theme';
import { GlyphPath, Icon } from './Icon';
import { PhotoBlock } from './PhotoBlock';
import { AppText, Display } from './Text';

const TILE = 256;
const MIN_Z = 10.5;
const MAX_Z = 18;
const D2R = Math.PI / 180;
const MAX_PINS = 220;

const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));

/** Web-Mercator projection → world coords in [0,1] (same math as the offline export). */
function project(lat: number, lng: number) {
  return {
    wx: (lng + 180) / 360,
    wy: (1 - Math.asinh(Math.tan(lat * D2R)) / Math.PI) / 2,
  };
}

type Marker = Place & { wx: number; wy: number };
type ViewState = { cx: number; cy: number; z: number };

/** Fit the viewport around a set of markers (4–96% quantiles, like the export). */
function computeFit(ms: Marker[], w: number, h: number): ViewState | null {
  if (!ms.length || !w || !h) return null;
  const xs = ms.map((m) => m.wx).sort((a, b) => a - b);
  const ys = ms.map((m) => m.wy).sort((a, b) => a - b);
  const q = (a: number[], f: number) => a[Math.floor(f * (a.length - 1))];
  const x1 = q(xs, 0.04);
  const x2 = q(xs, 0.96);
  const y1 = q(ys, 0.04);
  const y2 = q(ys, 0.96);
  const need = Math.max((x2 - x1) / ((w - 80) / TILE), (y2 - y1) / ((h - 80) / TILE), 1e-9);
  return { cx: (x1 + x2) / 2, cy: (y1 + y2) / 2, z: clamp(Math.log2(1 / need), MIN_Z, MAX_Z) };
}

const SUBS = ['a', 'b', 'c'];
const tileUrl = (z: number, x: number, y: number) =>
  `https://${SUBS[(x + y) % 3]}.tile.openstreetmap.org/${z}/${x}/${y}.png`;

/**
 * Offline-capable GPS map. Projects real coordinates with Web Mercator, streams
 * OpenStreetMap raster tiles (disk-cached by expo-image, so panned areas stay
 * available offline) and falls back to a coordinate graticule when no tiles are
 * reachable — mirroring the bundled directory's offline map export.
 */
export function OfflineMap({
  places,
  onOpen,
  bottomInset,
}: {
  places: Place[];
  onOpen: (id: string) => void;
  bottomInset: number;
}) {
  const markers = useMemo<Marker[]>(
    () =>
      places
        .filter((p) => typeof p.lat === 'number' && typeof p.lng === 'number')
        .map((p) => ({ ...p, ...project(p.lat as number, p.lng as number) })),
    [places],
  );

  const [size, setSize] = useState({ w: 0, h: 0 });
  const [view, setView] = useState<ViewState | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [online, setOnline] = useState<boolean | null>(null);

  const viewRef = useRef<ViewState | null>(null);
  useEffect(() => {
    viewRef.current = view;
  }, [view]);

  const okTiles = useRef(0);
  const errTiles = useRef(0);
  const pinchStart = useRef(13);

  // Fit to the current marker set whenever the filter or layout changes.
  const markerKey = useMemo(() => markers.map((m) => m.id).join('|'), [markers]);
  useEffect(() => {
    if (!size.w || !size.h) return;
    const f = computeFit(markers, size.w, size.h);
    if (f) setView(f);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [markerKey, size.w, size.h]);

  // Keep a valid selection within the visible set.
  useEffect(() => {
    if (markers.length === 0) {
      setSelected(null);
    } else if (!selected || !markers.some((m) => m.id === selected)) {
      setSelected(markers[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [markerKey]);

  const gesture = useMemo(() => {
    const pan = Gesture.Pan()
      .runOnJS(true)
      .onChange((e) => {
        setView((v) => {
          if (!v) return v;
          const S = TILE * Math.pow(2, v.z);
          return { ...v, cx: v.cx - e.changeX / S, cy: v.cy - e.changeY / S };
        });
      });
    const pinch = Gesture.Pinch()
      .runOnJS(true)
      .onBegin(() => {
        pinchStart.current = viewRef.current?.z ?? 13;
      })
      .onChange((e) => {
        setView((v) => (v ? { ...v, z: clamp(pinchStart.current + Math.log2(e.scale), MIN_Z, MAX_Z) } : v));
      });
    return Gesture.Simultaneous(pan, pinch);
  }, []);

  const zoomBy = (dz: number) =>
    setView((v) => (v ? { ...v, z: clamp(v.z + dz, MIN_Z, MAX_Z) } : v));
  const recenter = () => {
    const f = computeFit(markers, size.w, size.h);
    if (f) setView(f);
  };

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setSize((s) => (s.w === width && s.h === height ? s : { w: width, h: height }));
  };

  const { tiles, pins, scale } = useMemo(() => {
    if (!view || !size.w || !size.h) return { tiles: [] as any[], pins: [] as any[], scale: null as any };
    const { cx, cy, z } = view;
    const { w: W, h: H } = size;
    const S = TILE * Math.pow(2, z);
    const zt = clamp(Math.round(z), 1, 19);
    const n = 1 << zt;
    const tsz = TILE * Math.pow(2, z - zt);

    const tx1 = Math.floor((cx - W / 2 / S) * n);
    const ty1 = Math.floor((cy - H / 2 / S) * n);
    const tx2 = Math.floor((cx + W / 2 / S) * n);
    const ty2 = Math.floor((cy + H / 2 / S) * n);

    const tileList: { key: string; x: number; y: number; size: number; uri: string }[] = [];
    for (let tx = tx1; tx <= tx2; tx++) {
      for (let ty = ty1; ty <= ty2; ty++) {
        if (ty < 0 || ty >= n) continue;
        const wxn = ((tx % n) + n) % n;
        tileList.push({
          key: `${zt}/${wxn}/${ty}`,
          x: (tx / n - cx) * S + W / 2,
          y: (ty / n - cy) * S + H / 2,
          size: tsz + 1,
          uri: tileUrl(zt, wxn, ty),
        });
      }
    }

    const pinList: { id: string; x: number; y: number; tint: string; cat: Place['cat'] }[] = [];
    for (const m of markers) {
      const x = (m.wx - cx) * S + W / 2;
      const y = (m.wy - cy) * S + H / 2;
      if (x < -40 || x > W + 40 || y < -44 || y > H + 40) continue;
      pinList.push({ id: m.id, x, y, tint: m.tint, cat: m.cat });
      if (pinList.length >= MAX_PINS) break;
    }

    const lat = 2 * Math.atan(Math.exp((1 - 2 * cy) * Math.PI)) - Math.PI / 2;
    const mpp = (156543.03392 * Math.cos(lat)) / Math.pow(2, z);
    const target = mpp * 90;
    const opts = [50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000];
    let meters = 50000;
    for (const mo of opts) if (mo >= target) { meters = mo; break; }
    const scaleBar = { px: meters / mpp, label: meters >= 1000 ? `${meters / 1000} km` : `${meters} m` };

    return { tiles: tileList, pins: pinList, scale: scaleBar };
  }, [view, size.w, size.h, markers]);

  const onTileLoad = () => {
    okTiles.current += 1;
    if (online !== true) setOnline(true);
  };
  const onTileError = () => {
    errTiles.current += 1;
    if (okTiles.current === 0 && errTiles.current >= 3 && online !== false) setOnline(false);
  };

  const preview = selected ? places.find((p) => p.id === selected) : undefined;

  return (
    <View style={styles.root} onLayout={onLayout}>
      {/* Offline fallback: soft landmass + graticule (shows through when tiles are absent). */}
      <View style={styles.blobA} />
      <View style={styles.blobB} />
      <Svg style={StyleSheet.absoluteFill} width="100%" height="100%">
        <Defs>
          <Pattern id="omgrid" patternUnits="userSpaceOnUse" width={40} height={40}>
            <Line x1={0} y1={0} x2={40} y2={0} stroke="rgba(14,124,134,0.08)" strokeWidth={1} />
            <Line x1={0} y1={0} x2={0} y2={40} stroke="rgba(14,124,134,0.08)" strokeWidth={1} />
          </Pattern>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#omgrid)" />
      </Svg>

      <GestureDetector gesture={gesture}>
        <View style={StyleSheet.absoluteFill}>
          {/* OSM raster tiles */}
          {tiles.map((t) => (
            <Image
              key={t.key}
              source={{ uri: t.uri }}
              style={{ position: 'absolute', left: t.x, top: t.y, width: t.size, height: t.size }}
              contentFit="fill"
              cachePolicy="memory-disk"
              transition={0}
              pointerEvents="none"
              onLoad={onTileLoad}
              onError={onTileError}
            />
          ))}

          {/* Pins */}
          {pins.map((pin) => {
            const isSel = pin.id === selected;
            const d = isSel ? 38 : 26;
            return (
              <Pressable
                key={pin.id}
                onPress={() => setSelected(pin.id)}
                hitSlop={6}
                style={[
                  styles.pin,
                  { left: pin.x, top: pin.y, transform: [{ translateX: -d / 2 }, { translateY: -d }], zIndex: isSel ? 3 : 2 },
                ]}
              >
                <View style={[styles.pinBody, { width: d, height: d, backgroundColor: pin.tint }]}>
                  <View style={{ transform: [{ rotate: '-45deg' }] }}>
                    <GlyphPath d={catPath(pin.cat)} size={isSel ? 15 : 12} color={colors.white} strokeWidth={2.2} />
                  </View>
                </View>
              </Pressable>
            );
          })}
        </View>
      </GestureDetector>

      {/* Status pill */}
      <View style={styles.statusWrap} pointerEvents="none">
        <View style={[styles.statusPill, shadow.card]}>
          <Icon
            name="download"
            size={14}
            color={online === false ? colors.orange : colors.green}
            strokeWidth={2.2}
          />
          <AppText variant="semibold" size={12}>
            {online === false ? 'Offline · map grid' : 'Live map · cached offline'}
          </AppText>
        </View>
      </View>

      {/* Zoom + recenter controls */}
      <View style={[styles.controls, { bottom: (preview ? 128 : 28) + bottomInset }]}>
        <Pressable style={[styles.ctrlBtn, shadow.card]} onPress={() => zoomBy(1)}>
          <AppText variant="bold" size={20} color={colors.ink}>
            +
          </AppText>
        </Pressable>
        <Pressable style={[styles.ctrlBtn, shadow.card]} onPress={() => zoomBy(-1)}>
          <AppText variant="bold" size={22} color={colors.ink}>
            −
          </AppText>
        </Pressable>
        <Pressable style={[styles.ctrlBtn, shadow.card]} onPress={recenter}>
          <Icon name="navigation" size={18} color={colors.teal} strokeWidth={2.2} />
        </Pressable>
      </View>

      {/* Scale bar + attribution */}
      {scale ? (
        <View style={styles.scaleWrap} pointerEvents="none">
          <View style={styles.scaleRow}>
            <View style={[styles.scaleBar, { width: Math.min(scale.px, 160) }]} />
            <AppText variant="semibold" size={11} color={colors.body}>
              {scale.label}
            </AppText>
          </View>
          <AppText size={9} color={colors.muted}>
            © OpenStreetMap
          </AppText>
        </View>
      ) : null}

      {/* Preview card */}
      {preview ? (
        <Pressable
          onPress={() => onOpen(preview.id)}
          style={[styles.preview, { bottom: 18 + bottomInset }, shadow.raised]}
        >
          <PhotoBlock tint={preview.tint} image={preview.image} style={styles.previewPhoto} />
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <AppText variant="semibold" size={11} color={preview.tint}>
              {preview.catShort ?? preview.catLabel}
            </AppText>
            <Display size={18} style={{ marginTop: 1 }} numberOfLines={1}>
              {preview.name}
            </Display>
            <AppText size={12} color={colors.muted} style={{ marginTop: 3 }} numberOfLines={1}>
              {preview.area}
              {preview.rating ? ` · ★ ${preview.rating.toFixed(1)}` : ''}
              {preview.reviews ? ` · ${preview.reviews.toLocaleString()} reviews` : ''}
            </AppText>
          </View>
          <Icon name="chevronRight" size={20} color={colors.faint} strokeWidth={2.4} />
        </Pressable>
      ) : null}

      {markers.length === 0 ? (
        <View style={styles.emptyWrap} pointerEvents="none">
          <AppText size={14} color={colors.muted}>
            No mapped spots match those filters.
          </AppText>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, overflow: 'hidden', backgroundColor: '#dfe6e2' },
  blobA: {
    position: 'absolute',
    left: '-10%',
    top: '18%',
    width: '60%',
    height: '30%',
    backgroundColor: 'rgba(47,122,79,0.12)',
    borderRadius: 160,
  },
  blobB: {
    position: 'absolute',
    right: '-12%',
    bottom: '8%',
    width: '55%',
    height: '40%',
    backgroundColor: 'rgba(14,124,134,0.10)',
    borderRadius: 160,
  },
  pin: { position: 'absolute' },
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
  statusWrap: { position: 'absolute', top: 14, left: 0, right: 0, alignItems: 'center' },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: colors.white,
    borderRadius: radius.pill,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  controls: { position: 'absolute', right: 14, gap: 9, alignItems: 'center' },
  ctrlBtn: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scaleWrap: { position: 'absolute', left: 16, bottom: 12, gap: 2 },
  scaleRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  scaleBar: { height: 3, backgroundColor: colors.body, borderRadius: 2 },
  preview: {
    position: 'absolute',
    left: 18,
    right: 18,
    flexDirection: 'row',
    gap: 12,
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: 11,
    zIndex: 4,
  },
  previewPhoto: { width: 84, height: 84, borderRadius: 14 },
  emptyWrap: { position: 'absolute', top: '46%', left: 0, right: 0, alignItems: 'center' },
});
