import { Text as RNText, type TextProps } from 'react-native';
import { colors, fonts } from '../theme';

type Variant =
  | 'display'
  | 'displayBold'
  | 'regular'
  | 'medium'
  | 'semibold'
  | 'bold'
  | 'mono';

const family: Record<Variant, string> = {
  display: fonts.display,
  displayBold: fonts.displayBold,
  regular: fonts.regular,
  medium: fonts.medium,
  semibold: fonts.semibold,
  bold: fonts.bold,
  mono: fonts.mono,
};

type Props = TextProps & {
  variant?: Variant;
  color?: string;
  size?: number;
  /** letter-spacing */
  tracking?: number;
};

export function AppText({
  variant = 'regular',
  color = colors.ink,
  size,
  tracking,
  style,
  ...rest
}: Props) {
  return (
    <RNText
      {...rest}
      style={[{ fontFamily: family[variant], color, fontSize: size, letterSpacing: tracking }, style]}
    />
  );
}

/** Clash-Display-style heading. */
export function Display({ size = 20, ...rest }: Props) {
  return <AppText variant="display" size={size} {...rest} />;
}
