import { StyleSheet } from 'react-native';
import { typography } from '@/src/theme/typography';

export const styles = StyleSheet.create({
  container: {
    paddingVertical: 14,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButtonRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  actionWithCount: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 32,
    borderWidth: 1,
  },
  saveButton: {
    justifyContent: 'center',
    padding: 6,
    borderRadius: 32,
    borderWidth: 1,
  },
  countText: {
    marginLeft: 6,
    fontSize: typography.fontSizes.button,
    fontFamily: typography.fontFamilies.poppins.medium,
  },
});
