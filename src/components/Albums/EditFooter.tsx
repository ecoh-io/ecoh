import { typography } from '@/src/theme/typography';
import { Entypo } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface EditFooterProps {
  selectedCount: number;
  onDelete: () => void;
}

const EditFooter: React.FC<EditFooterProps> = ({ selectedCount, onDelete }) => {
  return (
    <View style={styles.footerContainer}>
      <Text style={styles.saveText}>
        {selectedCount} {selectedCount === 1 ? 'photo' : 'photos'} selected
      </Text>
      <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
        <Entypo name="trash" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  footerContainer: {
    position: 'absolute',
    bottom: 70,
    left: 0,
    right: 0,
    height: 70,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: '#ccc',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    zIndex: 100,
  },
  saveText: {
    fontSize: 18,
    fontFamily: typography.fontFamilies.poppins.medium,
    flex: 1,
    textAlign: 'center',
  },
  deleteButton: {
    position: 'absolute',
    right: 30,
  },
});

export default EditFooter;
