import { EditProvider } from '@/src/context/EditContext';
import { useTheme } from '@/src/theme/ThemeContext';
import Screen from '@/src/UI/Screen';
import { Stack } from 'expo-router';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function EditLayout() {
  const { colors, isDark } = useTheme();

  return (
    <EditProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Screen
          preset="auto"
          safeAreaEdges={['top', 'bottom']}
          backgroundColor={colors.background}
          contentContainerStyle={styles.screenContent}
          statusBarStyle={isDark ? 'light' : 'dark'}
        >
          <Stack
            initialRouteName="index"
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="name" />
            <Stack.Screen name="username" />
            <Stack.Screen name="bio" />
            <Stack.Screen name="links" />
            <Stack.Screen name="gender" />
            <Stack.Screen name="location" />
          </Stack>
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
