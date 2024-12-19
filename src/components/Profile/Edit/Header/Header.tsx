import { Colors } from '@/src/types/color';
import { Entypo } from '@expo/vector-icons';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { styles } from './Header.styles';
import { router } from 'expo-router';

interface HeaderProps {
  title: string;
  colors: Colors;
  save?: () => void;
  isSaving?: boolean;
  isDisabled?: boolean;
}
// Reusable Header Component
const Header: React.FC<HeaderProps> = ({
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

export default Header;
