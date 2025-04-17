import { StyleSheet, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const styles = StyleSheet.create({
  postContainer: {
    width: SCREEN_WIDTH,
    alignSelf: 'center',
    overflow: 'hidden',
    paddingHorizontal: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
    flexDirection: 'column',
    gap: 14,
    paddingVertical: 10,
  },
  content: {
    marginLeft: 0,
  },
  footer: {
    paddingLeft: 0,
  },
});
