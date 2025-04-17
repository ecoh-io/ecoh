import { StyleSheet } from 'react-native';
import { typography } from '@/src/theme/typography';

export const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'column',
    gap: 8,
    marginVertical: 12,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  input: {
    width: 48,
    height: 48,
    borderWidth: 2,
    borderRadius: 12,
    textAlign: 'center',
    fontSize: 20,
    fontFamily: typography.fontFamilies.poppins.medium,
  },
  errorText: {
    fontSize: 14,
    fontFamily: typography.fontFamilies.poppins.medium,
    marginTop: 4,
  },
});
