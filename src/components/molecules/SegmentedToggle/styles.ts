import { StyleSheet } from 'react-native';
import { typography } from '@/src/theme/typography';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    borderRadius: 16,
    padding: 4,
    overflow: 'hidden',
    backgroundColor: '#ECF2F5',
  },
  activeSegment: {
    position: 'absolute',
    top: 4,
    bottom: 4,
    left: 4,
    backgroundColor: '#fff',
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    // Shadow for Android
    elevation: 5,
    zIndex: 0,
  },
  segment: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  activeText: {
    fontFamily: typography.fontFamilies.poppins.medium,
    fontSize: 14,
  },
  inactiveText: {
    fontFamily: typography.fontFamilies.poppins.medium,
    fontSize: 14,
  },

  iconLabelWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  iconWrapper: {
    marginRight: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
