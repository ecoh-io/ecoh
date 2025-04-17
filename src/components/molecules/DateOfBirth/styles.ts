import { StyleSheet } from 'react-native';
import { typography } from '@/src/theme/typography';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    gap: 8,
    marginVertical: 8,
  },
  label: {
    fontSize: 15,
    fontFamily: typography.fontFamilies.poppins.medium,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1.5,
  },
  icon: {
    marginRight: 10,
  },
  inputText: {
    fontSize: 16,
    flex: 1,
    fontFamily: typography.fontFamilies.poppins.medium,
  },
  helperTextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  helperText: {
    fontSize: 12,
    fontFamily: typography.fontFamilies.poppins.medium,
  },
  helperIcon: {
    marginRight: 2,
  },
  errorText: {
    fontSize: 14,
    fontFamily: typography.fontFamilies.poppins.medium,
  },
  errorChip: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 16,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
});
