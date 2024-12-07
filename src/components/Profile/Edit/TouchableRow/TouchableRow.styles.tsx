import { typography } from '@/src/theme/typography';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  touchableContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  touchableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  touchableRowTextContainer: {
    flexDirection: 'column',
    marginLeft: 10,
    flex: 1,
  },
  touchableRowLabel: {
    fontSize: typography.fontSizes.body,
    fontFamily: typography.fontFamilies.poppins.medium,
  },
  touchableRowValue: {
    fontSize: typography.fontSizes.button,
    fontFamily: typography.fontFamilies.poppins.medium,
    opacity: 0.7,
  },
});
