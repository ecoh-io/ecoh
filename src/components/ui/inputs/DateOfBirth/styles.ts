import { StyleSheet } from 'react-native';
import { typography } from '@/src/theme/typography';

export const styles = StyleSheet.create({
  container: {
    marginBottom: 0,
    flexDirection: 'column',
    gap: 10,
  },
  inputWrapper: {
    position: 'relative',
    height: 54, // same height as your other fields
    borderRadius: 18,
    backgroundColor: 'transparent',
    paddingHorizontal: 14,
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  floatingLabel: {
    position: 'absolute',
    top: -8, // sits just above the border
    backgroundColor: '#fff',
    paddingHorizontal: 4,
    zIndex: 2,
    fontSize: 12,
    left: 12,
    fontFamily: typography.fontFamilies.poppins.medium,
    pointerEvents: 'none',
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1.5,
  },
  icon: {
    marginRight: 10,
  },
  innerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minHeight: 54,
  },
  inputText: {
    fontSize: 16,
    flex: 1,
    lineHeight: 23,
    fontFamily: typography.fontFamilies.poppins.medium,
  },
  helperTextRow: {
    flexDirection: 'row',
    width: '90%',
    gap: 4,
    alignItems: 'center',
  },
  helperText: {
    fontSize: 12,
    fontFamily: typography.fontFamilies.poppins.semiBold,
  },
  helperIcon: {
    marginRight: 2,
  },
  errorText: {
    fontSize: 12,
    lineHeight: 16,
    color: '#E54848',
    fontFamily: typography.fontFamilies.poppins.semiBold,
  },
});
