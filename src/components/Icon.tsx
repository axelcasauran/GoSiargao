import { Circle, Path, Rect, Svg } from 'react-native-svg';

/**
 * Stroke-based icon set, transcribed 1:1 from the Siargao design's inline SVGs.
 * All icons live on a 24x24 viewBox and stroke with `color`.
 */
export type IconName =
  | 'pin'
  | 'search'
  | 'waves'
  | 'star'
  | 'heart'
  | 'list'
  | 'map'
  | 'download'
  | 'chevronRight'
  | 'chevronLeft'
  | 'info'
  | 'navigation'
  | 'whatsapp'
  | 'phone'
  | 'check'
  | 'clock'
  | 'home'
  | 'compass'
  | 'calendar'
  | 'bookmark';

type Props = {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
  /** Fill color for solid icons (star, active heart). */
  fill?: string;
};

export function Icon({ name, size = 22, color = '#1E2A2E', strokeWidth = 2, fill = 'none' }: Props) {
  const common = {
    stroke: color,
    strokeWidth,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    fill,
  };
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {render(name, common, color)}
    </Svg>
  );
}

function render(name: IconName, p: any, color: string) {
  switch (name) {
    case 'pin':
      return [
        <Path key="a" d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" {...p} />,
        <Circle key="b" cx={12} cy={10} r={2.6} {...p} />,
      ];
    case 'search':
      return [
        <Circle key="a" cx={11} cy={11} r={7} {...p} />,
        <Path key="b" d="m21 21-4.3-4.3" {...p} />,
      ];
    case 'waves':
      return (
        <Path
          d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5s2.4 2 5 2c1.3 0 1.9-.5 2.5-1 M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2s2.4 2 5 2c1.3 0 1.9-.5 2.5-1 M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2s2.4 2 5 2c1.3 0 1.9-.5 2.5-1"
          {...p}
        />
      );
    case 'star':
      return (
        <Path
          d="m12 2 2.9 6.3 6.9.7-5.1 4.6 1.4 6.8L12 17.6 5.9 20.4l1.4-6.8L2.2 9l6.9-.7z"
          {...p}
          fill={color}
          stroke="none"
        />
      );
    case 'heart':
      return (
        <Path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z" {...p} />
      );
    case 'list':
      return <Path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" {...p} />;
    case 'map':
      return [
        <Path key="a" d="m3 6 6-2 6 2 6-2v14l-6 2-6-2-6 2z" {...p} />,
        <Path key="b" d="M9 4v14M15 6v14" {...p} />,
      ];
    case 'download':
      return [
        <Path key="a" d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" {...p} />,
        <Path key="b" d="M7 10l5 5 5-5M12 15V3" {...p} />,
      ];
    case 'chevronRight':
      return <Path d="m9 18 6-6-6-6" {...p} />;
    case 'chevronLeft':
      return <Path d="m15 18-6-6 6-6" {...p} />;
    case 'info':
      return [
        <Circle key="a" cx={12} cy={12} r={9.5} {...p} />,
        <Path key="b" d="M12 16v-4M12 8h.01" {...p} />,
      ];
    case 'navigation':
      return <Path d="m3 11 19-9-9 19-2-8-8-2z" {...p} />;
    case 'whatsapp':
      return (
        <Path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8z" {...p} />
      );
    case 'phone':
      return (
        <Path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" {...p} />
      );
    case 'check':
      return <Path d="M20 6 9 17l-5-5" {...p} />;
    case 'clock':
      return [
        <Circle key="a" cx={12} cy={12} r={9.5} {...p} />,
        <Path key="b" d="M12 7v5l3 2" {...p} />,
      ];
    case 'home':
      return [
        <Path key="a" d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" {...p} />,
        <Path key="b" d="M9 22V12h6v10" {...p} />,
      ];
    case 'compass':
      return [
        <Circle key="a" cx={12} cy={12} r={9.5} {...p} />,
        <Path key="b" d="m15.5 8.5-2.2 5.3-5.3 2.2 2.2-5.3z" {...p} />,
      ];
    case 'calendar':
      return [
        <Rect key="a" x={3} y={4} width={18} height={18} rx={2.5} {...p} />,
        <Path key="b" d="M8 2v4M16 2v4M3 10h18" {...p} />,
      ];
    case 'bookmark':
      return <Path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" {...p} />;
    default:
      return null;
  }
}

/**
 * Renders a raw SVG path `d` string (used for the data-driven category and
 * "facts" icons that ship as path strings in the catalog).
 */
export function GlyphPath({
  d,
  size = 24,
  color = '#FFFFFF',
  strokeWidth = 1.9,
}: {
  d: string;
  size?: number;
  color?: string;
  strokeWidth?: number;
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d={d}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}
