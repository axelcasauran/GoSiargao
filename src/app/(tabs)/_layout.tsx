import { Tabs } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon, type IconName } from '@/components/Icon';
import { AppText } from '@/components/Text';
import { colors } from '@/theme';

const ITEMS: Record<string, { label: string; icon: IconName }> = {
  index: { label: 'Discover', icon: 'home' },
  explore: { label: 'Explore', icon: 'compass' },
  events: { label: 'Events', icon: 'calendar' },
  trip: { label: 'My Trip', icon: 'bookmark' },
};

type TabBarProps = {
  state: { routes: { key: string; name: string }[]; index: number };
  navigation: {
    emit: (e: { type: 'tabPress'; target: string; canPreventDefault: true }) => {
      defaultPrevented: boolean;
    };
    navigate: (name: string) => void;
  };
};

function TabBar({ state, navigation }: TabBarProps) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.bar, { height: 64 + insets.bottom, paddingBottom: insets.bottom }]}>
      {state.routes.map((route, i) => {
        const item = ITEMS[route.name];
        if (!item) return null;
        const focused = state.index === i;
        const color = focused ? colors.teal : colors.muted;
        return (
          <Pressable
            key={route.key}
            style={styles.tab}
            onPress={() => {
              const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
              if (!focused && !event.defaultPrevented) navigation.navigate(route.name);
            }}
          >
            <Icon name={item.icon} size={24} color={color} strokeWidth={2} />
            <AppText variant="semibold" size={11} color={color}>
              {item.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: colors.bg } }}
      tabBar={(props) => <TabBar {...props} />}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="explore" />
      <Tabs.Screen name="events" />
      <Tabs.Screen name="trip" />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(244,236,224,0.97)',
    borderTopWidth: 1,
    borderTopColor: colors.line,
    paddingTop: 11,
    paddingHorizontal: 14,
  },
  tab: { flex: 1, alignItems: 'center', gap: 5 },
});
