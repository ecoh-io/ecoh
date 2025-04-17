import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  header: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  horizontal: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  vertical: {
    flexDirection: 'column',
    gap: 20,
  },
  errorText: {
    color: 'red',
    marginTop: 4,
    fontSize: 14,
  },
});
