/**
 * Go Siargao design tokens — extracted verbatim from the Claude Design
 * source (Siargao.dc.html). Warm cream + teal island palette.
 */

export const colors = {
  // surfaces
  bg: '#F4ECE0', // app background (cream)
  card: '#E7DAC6', // beige card / segmented control track
  white: '#FFFFFF',
  phone: '#0C1416',

  // brand
  teal: '#0E7C86', // primary
  tealDark: '#0A5A62',
  green: '#2F7A4F', // "open now"
  orange: '#F2762E', // featured / price accent
  coral: '#E84F5C', // hearts / dates / "stay"

  // text
  ink: '#1E2A2E', // headings
  body: '#3A4A4D', // paragraph
  muted: '#6B7B7E', // secondary
  faint: '#9AA6A6',

  // hairlines
  line: 'rgba(30,42,46,0.07)',
  lineStrong: 'rgba(30,42,46,0.15)',
} as const;

/** Tints used by the placeholder "photo" blocks, keyed by category. */
export const categoryTint: Record<string, string> = {
  eat: colors.orange,
  tour: colors.green,
  stay: colors.coral,
  beach: colors.teal,
  events: colors.tealDark,
};

export const fonts = {
  // body — Inter (exact match to the design)
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
  // display — Space Grotesk stands in for Clash Display
  // (drop Clash Display TTFs into assets/fonts and remap to match 1:1).
  display: 'SpaceGrotesk_600SemiBold',
  displayBold: 'SpaceGrotesk_700Bold',
  mono: 'monospace',
} as const;

export const radius = {
  sm: 11,
  md: 14,
  lg: 18,
  xl: 20,
  card: 26,
  pill: 999,
} as const;

export const shadow = {
  card: {
    shadowColor: '#142828',
    shadowOpacity: 0.12,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  raised: {
    shadowColor: '#142828',
    shadowOpacity: 0.16,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 14 },
    elevation: 8,
  },
} as const;

/** Diagonal hatch overlay opacity used over tinted photo placeholders. */
export const HATCH = 'rgba(255,255,255,0.08)';
