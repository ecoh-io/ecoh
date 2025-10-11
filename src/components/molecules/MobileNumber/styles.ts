import { typography } from '@/src/theme/typography';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 0,
  },
  inputWrapper: {
    position: 'relative',
    height: 54, // same height as your other fields
    borderRadius: 16,
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    justifyContent: 'center',
  },
  innerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 54,
  },
  label: {
    position: 'absolute',
    top: -8, // sits just above the border
    backgroundColor: '#fff',
    paddingHorizontal: 4,
    zIndex: 1,
    fontSize: 12,
    left: 14,
    color: '#333',
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
    fontSize: 14,
    fontWeight: '600',
    marginRight: 6,
  },
  divider: {
    width: 2,
    height: 24,
    borderRadius: 1,
  },
  input: {
    flex: 1,
    fontSize: 16,
    lineHeight: 23,
    color: '#333',
    padding: 0,
    margin: 0,
    height: 54,
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
