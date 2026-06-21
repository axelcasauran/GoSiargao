import { Image } from 'expo-image';
import { useId } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { Defs, Pattern, Rect, Svg } from 'react-native-svg';

type Props = {
  tint: string;
  /** Optional photo URL. When set, it fills the block; the tint shows while it loads. */
  image?: string;
  /** stripe width in px (design uses ~13) */
  gap?: number;
  opacity?: number;
  style?: ViewStyle;
  children?: React.ReactNode;
};

/**
 * The "photo" block used throughout the design. With an `image` it renders the
 * real photo (cover-fit) over the category tint, which doubles as the loading
 * placeholder. Without one it falls back to the tinted 135° diagonal hatch.
 */
export function PhotoBlock({ tint, image, gap = 13, opacity = 0.08, style, children }: Props) {
  const id = useId().replace(/:/g, '');
  return (
    <View style={[styles.base, { backgroundColor: tint }, style]}>
      {image ? (
        <Image
          source={{ uri: image }}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          transition={250}
          cachePolicy="memory-disk"
        />
      ) : (
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
      )}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: { overflow: 'hidden' },
});
