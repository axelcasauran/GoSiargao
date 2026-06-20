import { Pressable, StyleSheet, View, type ViewStyle } from 'react-native';
import { colors, radius } from '../theme';
import { Icon } from './Icon';
import { AppText } from './Text';

/** Small rounded label, e.g. "Open now", "Featured", price tags. */
export function Badge({
  label,
  color = colors.white,
  bg = colors.green,
  style,
}: {
  label: string;
  color?: string;
  bg?: string;
  style?: ViewStyle;
}) {
  return (
    <View style={[styles.badge, { backgroundColor: bg }, style]}>
      <AppText variant="semibold" size={11} color={color}>
        {label}
      </AppText>
    </View>
  );
}

/** Filter chip used on Explore / Events. */
export function Chip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        {
          backgroundColor: active ? colors.ink : 'transparent',
          borderColor: active ? colors.ink : colors.lineStrong,
        },
      ]}
    >
      <AppText variant="semibold" size={13} color={active ? colors.white : colors.ink}>
        {label}
      </AppText>
    </Pressable>
  );
}

/** Circular heart toggle. `overlay` sits on a photo; `plain` on a light card. */
export function HeartButton({
  saved,
  onPress,
  variant = 'overlay',
  size = 19,
}: {
  saved: boolean;
  onPress: () => void;
  variant?: 'overlay' | 'plain';
  size?: number;
}) {
  if (variant === 'plain') {
    return (
      <Pressable onPress={onPress} hitSlop={8} style={styles.plainHeart}>
        <Icon
          name="heart"
          size={21}
          color={saved ? colors.coral : colors.faint}
          fill={saved ? colors.coral : 'none'}
        />
      </Pressable>
    );
  }
  return (
    <Pressable onPress={onPress} hitSlop={6} style={[styles.overlayHeart, { width: size + 19, height: size + 19 }]}>
      <Icon
        name="heart"
        size={size}
        color={saved ? colors.coral : colors.white}
        fill={saved ? colors.coral : 'none'}
      />
    </Pressable>
  );
}

/** Two-option segmented control (List/Map, Saved/Itinerary). */
export function Segmented({
  options,
  value,
  onChange,
  renderLabel,
}: {
  options: { key: string; label: string; icon?: 'list' | 'map' }[];
  value: string;
  onChange: (key: string) => void;
  renderLabel?: (o: { key: string; label: string }) => string;
}) {
  return (
    <View style={styles.segment}>
      {options.map((o) => {
        const active = o.key === value;
        return (
          <Pressable
            key={o.key}
            onPress={() => onChange(o.key)}
            style={[styles.segmentBtn, { backgroundColor: active ? colors.white : 'transparent' }]}
          >
            {o.icon ? (
              <Icon name={o.icon} size={15} color={active ? colors.teal : colors.muted} strokeWidth={2.2} />
            ) : null}
            <AppText variant="semibold" size={13} color={active ? colors.teal : colors.muted}>
              {renderLabel ? renderLabel(o) : o.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderRadius: radius.pill,
    paddingVertical: 4,
    paddingHorizontal: 9,
  },
  chip: {
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  plainHeart: { padding: 2 },
  overlayHeart: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    backgroundColor: 'rgba(10,20,22,0.32)',
  },
  segment: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 3,
  },
  segmentBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    justifyContent: 'center',
    borderRadius: 9,
    paddingVertical: 7,
    paddingHorizontal: 14,
  },
});
