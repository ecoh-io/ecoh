import { StyleSheet } from 'react-native';
import { typography } from '@/src/theme/typography';

export const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 70,
    left: 0,
    right: 0,
    height: 70,
    paddingHorizontal: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 100,
  },
  label: {
    fontSize: 16,
    fontFamily: typography.fontFamilies.poppins.medium,
  },
  deleteButton: {
    padding: 10,
    borderRadius: 12,
  },
});
