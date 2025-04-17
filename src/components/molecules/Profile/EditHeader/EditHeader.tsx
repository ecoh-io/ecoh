import { Entypo } from '@expo/vector-icons';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { styles } from './styles';
import { EditHeaderProps } from './types';

const EditHeader: React.FC<EditHeaderProps> = ({
  title,
  colors,
  save,
  isSaving = false,
  isDisabled = true,
}) => (
  <View style={styles.headerContainer}>
    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
      <Entypo name="chevron-left" size={32} color={colors.text} />
    </TouchableOpacity>

    <View style={styles.headerTextContainer}>
      <Text style={[styles.headerText, { color: colors.text }]}>{title}</Text>
    </View>

    {save ? (
      isSaving ? (
        <ActivityIndicator color={colors.primary} />
      ) : (
        <TouchableOpacity
          style={styles.saveButton}
          onPress={save}
          disabled={isDisabled}
        >
          <Text
            style={[
              styles.saveButtonText,
              { color: colors.primary, opacity: isDisabled ? 0.5 : 1 },
            ]}
          >
            Save
          </Text>
        </TouchableOpacity>
      )
    ) : (
      <View style={styles.placeholder} />
    )}
  </View>
);

export default EditHeader;
