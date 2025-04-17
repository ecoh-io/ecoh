import { StyleSheet } from 'react-native';
import { typography } from '@/src/theme/typography';

export const styles = StyleSheet.create({
  wrapper: {
    alignSelf: 'center',
    flexDirection: 'column',
    gap: 14,
  },
  mediaContainer: {
    position: 'relative',
    overflow: 'hidden',
    width: '100%',
    height: '100%',
  },
  textContent: {
    fontSize: 16,
    lineHeight: 22,
    fontFamily: typography.fontFamilies.poppins.regular,
  },
});
