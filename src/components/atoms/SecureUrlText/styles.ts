import { typography } from '@/src/theme/typography';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  urlText: {
    color: '#4e8cff',
    fontSize: 16,
    lineHeight: 21,
    fontFamily: typography.fontFamilies.poppins.medium,
    textDecorationLine: 'underline',
    textDecorationColor: '#4e8cff',
  },
});
