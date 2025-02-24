import React, { useMemo } from 'react';
import { TouchableOpacity, View, StyleSheet, Alert, Text } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useRegistration } from '@/src/context/RegistrationContext';
import { typography } from '@/src/theme/typography';
import { useTheme } from '@/src/theme/ThemeContext';

export default function RegistrationHeader() {
  const { prevStep, state, clearFormData, steps } = useRegistration();
  const { colors } = useTheme();

  const showAlert = () => {
    if (state.currentStep === 0) {
      Alert.alert(
        'Do you want to stop creating your account?',
        `If you stop now, you'll lose any progress you've made.`,
        [
          {
            text: `Stop creating account`,
            onPress: () => {
              clearFormData();
              router.back();
            },
          },
          {
            text: 'Continue creating account',
            onPress: () => console.log('Here'),
            style: 'cancel',
          },
        ],
        { cancelable: false }, // Prevents dismissing the alert by tapping outside
      );
    } else {
      prevStep();
    }
  };

  return (
    <View
      style={[styles.stepperContainer, { backgroundColor: colors.background }]}
    >
      {/* Back Arrow */}
      <TouchableOpacity onPress={showAlert} style={styles.backButton}>
        <Entypo name="chevron-left" size={32} color={colors.text} />
      </TouchableOpacity>
      <View style={{ flexDirection: 'column', alignItems: 'center', flex: 1 }}>
        <Text style={[styles.text, { color: colors.text }]}>
          {steps[state.currentStep]}
        </Text>
        <Text style={[styles.text, { color: colors.text }]}>
          {state.currentStep + 1 + ' of ' + steps.length}
        </Text>
      </View>
      <View style={{ flex: 1 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  stepperContainer: {
    flexDirection: 'row', // Aligns the back arrow and progress bar horizontally
    width: '100%',
    alignItems: 'center', // Vertically aligns the back arrow and progress bar
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  backButton: {
    flex: 1,
  },
  Wrapper: {
    flex: 1, // Makes the progress bar take up the remaining space
  },
  text: {
    fontFamily: typography.fontFamilies.poppins.medium,
    fontSize: typography.fontSizes.body,
  },
});
