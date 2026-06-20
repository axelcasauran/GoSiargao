import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { EventAgendaRow } from '@/components/cards';
import { Chip } from '@/components/primitives';
import { AppText, Display } from '@/components/Text';
import { EVENT_CHIPS, EVENTS } from '@/data/places';
import { usePlaceActions } from '@/lib/usePlaceActions';
import { colors } from '@/theme';

export default function EventsScreen() {
  const insets = useSafeAreaInsets();
  const { open } = usePlaceActions();
  const [filter, setFilter] = useState('This week');

  return (
    <ScrollView
      style={styles.root}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingTop: insets.top + 8, paddingBottom: 100 + insets.bottom }}
    >
      <View style={{ paddingHorizontal: 22 }}>
        <Display size={26}>What&apos;s on</Display>
        <AppText size={13} color={colors.muted} style={{ marginTop: 2 }}>
          June 2026 · General Luna & around
        </AppText>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
          {EVENT_CHIPS.map((c) => (
            <Chip key={c} label={c} active={filter === c} onPress={() => setFilter(c)} />
          ))}
        </ScrollView>
      </View>

      <View style={{ paddingHorizontal: 22, paddingTop: 10 }}>
        {EVENTS.map((ev) => (
          <EventAgendaRow key={ev.id} event={ev} onOpen={() => (ev.place ? open(ev.place) : undefined)} />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  chips: { gap: 8, paddingVertical: 16 },
});
