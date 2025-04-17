import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '@/src/theme/ThemeContext';
import { Image } from 'expo-image';
import { typography } from '@/src/theme/typography';
import Button from '@/src/components/atoms/Button';
import AnimatedWrapper from '@/src/animation/AnimatedWrapper';

const { width } = Dimensions.get('window');
const logoSize = width * 0.55;

const Index: React.FC = () => {
  const { colors } = useTheme();

  const handleRegister = () => {
    router.push('/(auth)/register');
  };

  const handleLogin = () => {
    router.push('/(auth)/login');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.topContent}>
        <AnimatedWrapper animation="scale-in" duration={2000}>
          <Image
            source={require('@/assets/images/Applogo.png')}
            style={styles.logo}
            contentFit="contain"
          />
        </AnimatedWrapper>
      </View>

      <AnimatedWrapper animation="slide-up" duration={2000}>
        <View style={styles.bottomContent}>
          <Button
            title="Sign in"
            onPress={handleLogin}
            variant="primary"
            gradientColors={['#00c6ff', '#0072ff']}
            size="large"
            style={styles.button}
          />
          <Button
            title="Create account"
            onPress={handleRegister}
            variant="secondary"
            size="large"
            style={styles.button}
          />
          <Text style={[styles.footer, { color: colors.text + '99' }]}>
            © {new Date().getFullYear()} Ecoh
          </Text>
        </View>
      </AnimatedWrapper>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  topContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomContent: {
    marginBottom: 48,
  },
  logo: {
    width: logoSize,
    height: logoSize,
    marginBottom: 12,
  },
  tagline: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    opacity: 0.8,
  },
  button: {
    marginBottom: 16,
  },
  footer: {
    textAlign: 'center',
    fontSize: 12,
    marginTop: 12,
    fontFamily: typography.fontFamilies.poppins.medium,
  },
});

export default Index;
