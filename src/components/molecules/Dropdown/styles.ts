// styles.ts
import { StyleSheet } from 'react-native';
import { typography } from '@/src/theme/typography';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    position: 'relative',
  },
  trigger: {
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftIcon: {
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  triggerText: {
    fontSize: 16,
    flex: 1,
    fontFamily: typography.fontFamilies.poppins.medium,
  },
  arrowIcon: {
    marginLeft: 8,
  },
  dropdownContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    zIndex: 9999,
  },
  dropdown: {
    borderRadius: 12,
    marginTop: 4,
    overflow: 'hidden',
    borderWidth: 1,
  },
  flatList: {
    borderRadius: 12,
    maxHeight: 225,
  },
  optionItem: {
    padding: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  optionText: {
    fontSize: 16,
    fontFamily: typography.fontFamilies.poppins.medium,
  },
  selectedOption: {
    backgroundColor: '#F0F0F0',
  },
  lastOptionItem: {
    borderBottomWidth: 0,
  },
});
