import { useId } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { Defs, Pattern, Rect, Svg } from 'react-native-svg';

type Props = {
  tint: string;
  /** stripe width in px (design uses ~13) */
  gap?: number;
  opacity?: number;
  style?: ViewStyle;
  children?: React.ReactNode;
};

/**
 * The tinted "photo" placeholder used throughout the design — a solid color
 * fill overlaid with a 135° repeating diagonal hatch.
 */
export function PhotoBlock({ tint, gap = 13, opacity = 0.08, style, children }: Props) {
  const id = useId().replace(/:/g, '');
  return (
    <View style={[styles.base, { backgroundColor: tint }, style]}>
      <Svg style={StyleSheet.absoluteFill} width="100%" height="100%">
        <Defs>
          <Pattern
            id={id}
            patternUnits="userSpaceOnUse"
            width={gap * 2}
            height={gap * 2}
            patternTransform="rotate(135)"
          >
            <Rect x={0} y={0} width={gap} height={gap * 2} fill={`rgba(255,255,255,${opacity})`} />
          </Pattern>
        </Defs>
        <Rect width="100%" height="100%" fill={`url(#${id})`} />
      </Svg>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: { overflow: 'hidden' },
});
