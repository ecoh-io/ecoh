// src/components/TextPost/styles.ts
import { StyleSheet } from 'react-native';
import { typography } from '@/src/theme/typography'; // adjust path as needed

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    gap: 14,
  },
  textContainer: {
    paddingLeft: 25,
  },
  textContent: {
    fontSize: 16,
    lineHeight: 22,
    fontFamily: typography.fontFamilies.poppins.regular,
  },
  boldText: {
    fontFamily: typography.fontFamilies.poppins.bold,
  },
  italicText: {
    fontFamily: typography.fontFamilies.poppins.italic,
  },
  strikethroughText: {
    textDecorationLine: 'line-through',
  },
  hashtagText: {
    color: '#1DA1F2',
  },
  mentionText: {
    color: '#3498db',
  },
  urlText: {
    color: '#4e8cff',
    fontSize: 16,
    lineHeight: 21,
    fontFamily: typography.fontFamilies.poppins.medium,
    textDecorationLine: 'underline',
    textDecorationColor: '#4e8cff',
  },
});
