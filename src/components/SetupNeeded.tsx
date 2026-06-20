import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius } from '../theme';
import { Icon } from './Icon';
import { AppText, Display } from './Text';

/** Shown when EXPO_PUBLIC_CONVEX_URL is not configured yet. */
export function SetupNeeded() {
  const insets = useSafeAreaInsets();
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bg }}
      contentContainerStyle={[styles.c, { paddingTop: insets.top + 60, paddingBottom: insets.bottom + 40 }]}
    >
      <View style={styles.icon}>
        <Icon name="info" size={34} color={colors.teal} strokeWidth={1.8} />
      </View>
      <Display size={24} style={{ textAlign: 'center' }}>
        Connect Convex
      </Display>
      <AppText size={14} color={colors.muted} style={styles.p}>
        The realtime backend isn&apos;t configured yet. From the project folder run:
      </AppText>
      <View style={styles.code}>
        <AppText variant="mono" size={13} color={colors.ink}>
          npx convex dev
        </AppText>
      </View>
      <AppText size={14} color={colors.muted} style={styles.p}>
        That writes your deployment URL to <AppText variant="semibold" size={14} color={colors.ink}>.env.local</AppText> as
        {' '}EXPO_PUBLIC_CONVEX_URL. Then seed the catalog and restart:
      </AppText>
      <View style={styles.code}>
        <AppText variant="mono" size={13} color={colors.ink}>
          npm run seed
        </AppText>
      </View>
      <AppText size={13} color={colors.faint} style={[styles.p, { marginTop: 18 }]}>
        See README.md → &quot;Setup&quot; for Google OAuth credentials.
      </AppText>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  c: { paddingHorizontal: 32, alignItems: 'center' },
  icon: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  p: { textAlign: 'center', marginTop: 14, lineHeight: 21 },
  code: {
    marginTop: 14,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});
