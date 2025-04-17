import { StyleSheet } from 'react-native';
import { typography } from '@/src/theme/typography';

export const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  blurContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: '95%',
    height: '95%',
    borderRadius: 1000,
    overflow: 'hidden',
  },
  percentageText: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: typography.fontFamilies.poppins.medium,
  },
});
