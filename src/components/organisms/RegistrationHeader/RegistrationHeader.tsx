import React, { useEffect, useRef } from 'react';
import { Alert, Animated } from 'react-native';
import { router } from 'expo-router';
import { useRegistration } from '@/src/context/RegistrationContext';
import AnimatedProgressRing from './AnimatedProgressRing';
import HeaderWithBack from '@/src/components/layout/HeaderWithBack';

const RegistrationHeader: React.FC = () => {
  const { prevStep, state, clearFormData, steps } = useRegistration();

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const progress = (state.currentStep + 1) / steps.length;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 5,
      tension: 80,
      useNativeDriver: true,
    }).start();
  }, []);

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
            style: 'cancel',
          },
        ],
        { cancelable: false },
      );
    } else {
      prevStep();
    }
  };

  return (
    <HeaderWithBack
      title="Create Account"
      onBackPress={showAlert}
      right={
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <AnimatedProgressRing
            progress={progress}
            text={`${state.currentStep + 1}/${steps.length}`}
          />
        </Animated.View>
      }
    />
  );
};

export default RegistrationHeader;
