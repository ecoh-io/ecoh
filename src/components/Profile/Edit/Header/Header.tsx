import { Colors } from '@/src/types/color';
import { Entypo } from '@expo/vector-icons';
import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from './Header.styles';
import { router } from 'expo-router';
import Button from '@/src/UI/Button';

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
  isDisabled = false,
}) => (
  <View style={styles.headerContainer}>
    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
      <Entypo name="chevron-left" size={32} color={colors.text} />
    </TouchableOpacity>
    <Text style={[styles.headerText, { color: colors.text }]}>{title}</Text>
    {save ? (
      <View style={styles.headerSpacer}>
        <Button
          onPress={save}
          title="save"
          variant="primary"
          size="small"
          loading={isSaving}
          disabled={isDisabled}
          gradientColors={['#00c6ff', '#0072ff']}
          style={{ paddingLeft: 75 }}
        />
      </View>
    ) : (
      <View style={styles.headerSpacer} />
    )}
  </View>
);

export default Header;
