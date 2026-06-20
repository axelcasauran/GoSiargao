import { useAuthActions } from '@convex-dev/auth/react';
import { makeRedirectUri } from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Path, Svg } from 'react-native-svg';
import { PhotoBlock } from '../PhotoBlock';
import { AppText, Display } from '../Text';
import { colors, radius, shadow } from '../../theme';

WebBrowser.maybeCompleteAuthSession();

function GoogleMark() {
  return (
    <Svg width={20} height={20} viewBox="0 0 48 48">
      <Path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.3 6.1 29.4 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z"
      />
      <Path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.7 16 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.3 6.1 29.4 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
      />
      <Path
        fill="#4CAF50"
        d="M24 44c5.2 0 10-2 13.6-5.2l-6.3-5.3C29.2 35 26.7 36 24 36c-5.3 0-9.7-3.1-11.3-7.6l-6.5 5C9.6 39.6 16.2 44 24 44z"
      />
      <Path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4 5.5l6.3 5.3C41.6 35.3 44 30.1 44 24c0-1.3-.1-2.3-.4-3.5z"
      />
    </Svg>
  );
}

type LoginScreenProps = {
  /** TEMP: when set, "Continue" skips OAuth and signals a fake login. */
  onFakeLogin?: () => void;
};

export function LoginScreen({ onFakeLogin }: LoginScreenProps) {
  const { signIn } = useAuthActions();
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onGoogle() {
    // TEMP: fake login — continue to the app without authenticating.
    if (onFakeLogin) {
      onFakeLogin();
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const redirectTo = makeRedirectUri({ scheme: 'gosiargao' });
      const { redirect } = await signIn('google', { redirectTo });
      const result = await WebBrowser.openAuthSessionAsync(String(redirect), redirectTo);
      if (result.type === 'success') {
        const code = new URL(result.url).searchParams.get('code');
        if (code) await signIn('google', { code });
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Sign-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.hero}>
        <PhotoBlock tint={colors.teal} style={styles.heroPhoto} opacity={0.07} gap={15} />
        <View style={styles.heroBadge}>
          <AppText variant="semibold" size={11} color={colors.white} tracking={1.2}>
            ISLAND GUIDE
          </AppText>
        </View>
      </View>

      <View style={[styles.sheet, { paddingBottom: insets.bottom + 28 }]}>
        <View style={styles.brandRow}>
          <View style={styles.pin}>
            <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={colors.white} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
              <Path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" />
              <Path d="M14 10a2 2 0 1 1-4 0 2 2 0 0 1 4 0" />
            </Svg>
          </View>
          <AppText variant="semibold" size={12} color={colors.teal} tracking={1.2}>
            GO SIARGAO
          </AppText>
        </View>

        <Display size={32} style={{ marginTop: 14, lineHeight: 34 }}>
          The island in{'\n'}your pocket.
        </Display>
        <AppText size={15} color={colors.muted} style={{ marginTop: 10, lineHeight: 22 }}>
          Surf spots, lagoons, the best tacos and every sunset bar — saved, mapped and
          ready offline.
        </AppText>

        <Pressable
          onPress={onGoogle}
          disabled={loading}
          style={[styles.googleBtn, shadow.card, loading && { opacity: 0.6 }]}
        >
          {loading ? (
            <ActivityIndicator color={colors.ink} />
          ) : (
            <>
              <GoogleMark />
              <AppText variant="semibold" size={15} color={colors.ink}>
                Continue with Google
              </AppText>
            </>
          )}
        </Pressable>

        {error ? (
          <AppText size={13} color={colors.coral} style={{ marginTop: 12, textAlign: 'center' }}>
            {error}
          </AppText>
        ) : null}

        <AppText size={12} color={colors.faint} style={{ marginTop: 16, textAlign: 'center', lineHeight: 18 }}>
          By continuing you agree to the Terms & Privacy Policy.
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  hero: { flex: 1, margin: 14, borderRadius: 28, overflow: 'hidden' },
  heroPhoto: { flex: 1, borderRadius: 28 },
  heroBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: 'rgba(10,20,22,0.3)',
    borderRadius: radius.pill,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  sheet: { paddingHorizontal: 24, paddingTop: 8 },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  pin: {
    width: 26,
    height: 26,
    borderRadius: 9,
    backgroundColor: colors.teal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleBtn: {
    marginTop: 24,
    backgroundColor: colors.white,
    borderRadius: radius.md,
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
});
