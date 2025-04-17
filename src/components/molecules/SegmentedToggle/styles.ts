import { StyleSheet } from 'react-native';
import { typography } from '@/src/theme/typography';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 4,
    position: 'relative',
    overflow: 'hidden',
  },
  activeSegment: {
    position: 'absolute',
    top: 4,
    bottom: 4,
    left: 0,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  segment: {
    flex: 1,
    height: 42,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  activeText: {
    fontFamily: typography.fontFamilies.poppins.semiBold,
    fontSize: 14,
  },
  inactiveText: {
    fontFamily: typography.fontFamilies.poppins.medium,
    fontSize: 14,
  },
});
