import { typography } from '@/src/theme/typography';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    alignItems: 'flex-start',
  },
  barContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  segment: {
    flex: 1,
    height: 6,
    marginHorizontal: 2,
    borderRadius: 3,
    backgroundColor: 'gray',
  },

  label: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
});
