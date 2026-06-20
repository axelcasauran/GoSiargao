import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { colors, radius, shadow } from '../theme';
import { Icon } from './Icon';
import { AppText } from './Text';

const ToastContext = createContext<(message: string) => void>(() => {});

/** flash a transient confirmation toast (e.g. "Saved to My Trip"). */
export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState('');
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const flash = useCallback((m: string) => {
    setMessage(m);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setMessage(''), 1900);
  }, []);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  return (
    <ToastContext.Provider value={flash}>
      {children}
      {message ? <ToastView message={message} /> : null}
    </ToastContext.Provider>
  );
}

function ToastView({ message }: { message: string }) {
  const y = useRef(new Animated.Value(12)).current;
  useEffect(() => {
    Animated.timing(y, { toValue: 0, duration: 220, useNativeDriver: true }).start();
  }, [y]);

  return (
    <View pointerEvents="none" style={styles.wrap}>
      <Animated.View style={[styles.toast, shadow.raised, { transform: [{ translateY: y }] }]}>
        <Icon name="check" size={17} color="#7BE0B0" strokeWidth={2.4} />
        <AppText variant="semibold" color={colors.white} size={14}>
          {message}
        </AppText>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    bottom: 104,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 95,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    backgroundColor: colors.ink,
    borderRadius: radius.md,
    paddingVertical: 12,
    paddingHorizontal: 18,
  },
});
