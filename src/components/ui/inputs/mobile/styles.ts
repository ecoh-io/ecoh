import { typography } from '@/src/theme/typography';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    marginBottom: 0,
    flexDirection: 'column',
    gap: 10,
  },
  inputWrapper: {
    position: 'relative',
    height: 54,
    borderRadius: 16,
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  innerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 54,
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
  countryCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  flag: {
    fontSize: 18,
    marginRight: 4,
  },
  code: {
    fontSize: 16,
    fontFamily: typography.fontFamilies.poppins.medium,
    marginRight: 6,
  },
  divider: {
    width: 1.5,
    height: 26,
    borderRadius: 1,
  },
  input: {
    flex: 1,
    fontSize: 16,
    lineHeight: 23,
    padding: 0,
    margin: 0,
    height: 54,
    fontFamily: typography.fontFamilies.poppins.medium,
  },
  inputText: {
    fontSize: 16,
    flex: 1,
    lineHeight: 23,
    fontFamily: typography.fontFamilies.poppins.medium,
  },
  errorText: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 16,
    color: 'red',
    fontFamily: typography.fontFamilies.poppins.medium,
  },
  helperText: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
    marginLeft: 4,
  },
});
