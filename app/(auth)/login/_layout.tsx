import { useTheme } from '@/src/theme/ThemeContext';
import Screen from '@/src/UI/Screen';
import { Entypo } from '@expo/vector-icons';
import { Stack, router } from 'expo-router';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

export default function Layout() {
  const { colors } = useTheme();
  const backPressed = () => {
    router.back();
  };

  return (
    <Screen
      preset="fixed"
      contentContainerStyle={{
        flex: 1,
      }}
    >
      <View
        style={[
          styles.stepperContainer,
          { backgroundColor: colors.background },
        ]}
      >
        <TouchableOpacity onPress={backPressed}>
          <Entypo name="chevron-left" size={32} color="black" />
        </TouchableOpacity>
      </View>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'fade',
          animationDuration: 300,
        }}
      >
        <Stack.Screen name="login" />
      </Stack>
    </Screen>
  );
}

const styles = StyleSheet.create({
  stepperContainer: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
});
