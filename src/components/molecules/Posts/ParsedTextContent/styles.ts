import { StyleSheet } from 'react-native';
import { typography } from '@/src/theme/typography';

export const styles = StyleSheet.create({
  textContent: {
    fontSize: typography.fontSizes.body,
    fontFamily: typography.fontFamilies.poppins.regular,
    lineHeight: 22,
  },
  urlText: {
    textDecorationLine: 'underline',
    color: '#007AFF',
  },
  hashtagText: {
    color: '#007AFF',
  },
  mentionText: {
    color: '#007AFF',
  },
  boldText: {
    fontFamily: typography.fontFamilies.poppins.bold,
  },
  italicText: {
    fontStyle: 'italic',
  },
  strikethroughText: {
    textDecorationLine: 'line-through',
  },
});
