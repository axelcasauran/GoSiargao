import { ConvexAuthProvider } from '@convex-dev/auth/react';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import {
  SpaceGrotesk_600SemiBold,
  SpaceGrotesk_700Bold,
} from '@expo-google-fonts/space-grotesk';
import { Authenticated, AuthLoading, Unauthenticated } from 'convex/react';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LoginScreen } from '@/components/auth/LoginScreen';
import { SetupNeeded } from '@/components/SetupNeeded';
import { ToastProvider } from '@/components/Toast';
import { convex, isConvexConfigured, secureStorage } from '@/lib/convex';
import { colors } from '@/theme';

SplashScreen.preventAutoHideAsync();

function Splash() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg }}>
      <ActivityIndicator color={colors.teal} size="large" />
    </View>
  );
}

function AppStack() {
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="place/[id]" options={{ presentation: 'card', animation: 'slide_from_right' }} />
      <Stack.Screen name="search" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
    </Stack>
  );
}

function AuthGate() {
  // TEMP: fake-login bypass. Tapping "Continue" on the login screen flips this
  // and renders the app without authenticating. Remove `fakeAuthed` (and the
  // `onFakeLogin` prop below) to restore the real Convex auth gate.
  const [fakeAuthed, setFakeAuthed] = useState(false);
  if (fakeAuthed) return <AppStack />;

  return (
    <>
      <AuthLoading>
        <Splash />
      </AuthLoading>
      <Unauthenticated>
        <LoginScreen onFakeLogin={() => setFakeAuthed(true)} />
      </Unauthenticated>
      <Authenticated>
        <AppStack />
      </Authenticated>
    </>
  );
}

export default function RootLayout() {
  const [loaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    SpaceGrotesk_600SemiBold,
    SpaceGrotesk_700Bold,
  });

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync();
  }, [loaded]);

  if (!loaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        {!isConvexConfigured || !convex ? (
          <SetupNeeded />
        ) : (
          <ConvexAuthProvider client={convex} storage={secureStorage}>
            <ToastProvider>
              <AuthGate />
            </ToastProvider>
          </ConvexAuthProvider>
        )}
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
