import Screen from '@/src/components/layout/Screen';
import { EditProvider } from '@/src/context/EditContext';
import { useTheme } from '@/src/theme/ThemeContext';
import { Slot, Stack } from 'expo-router';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function AlbumLayout() {
  const { colors, isDark } = useTheme();

  return (
    <EditProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Screen
          preset="fixed"
          safeAreaEdges={['top']}
          backgroundColor={colors.background}
          contentContainerStyle={styles.screenContent}
          statusBarStyle={isDark ? 'light' : 'dark'}
        >
          <Slot />
        </Screen>
      </GestureHandlerRootView>
    </EditProvider>
  );
}

const styles = StyleSheet.create({
  screenContent: {
    flex: 1,
  },
});
