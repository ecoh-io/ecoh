import { Colors } from '@/src/types/color';
import { Entypo, Feather } from '@expo/vector-icons';
import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from './TouchableRow.styles';

interface ProfileInputRowProps {
  iconName: string;
  label: string;
  value: string;
  onPress: () => void;
  colors: Colors;
}
// Reusable Input Row Component
const TouchableRow: React.FC<ProfileInputRowProps> = ({
  iconName,
  label,
  value,
  onPress,
  colors,
}) => (
  <TouchableOpacity style={styles.inputContainer} onPress={onPress}>
    <View style={styles.inputRow}>
      <Feather name={iconName as any} size={44} color={colors.text} />
      <View style={styles.inputTextContainer}>
        <Text style={styles.inputLabel}>{label}</Text>
        <Text
          style={[styles.inputValue, { color: colors.backdrop }]}
          numberOfLines={1}
        >
          {value}
        </Text>
      </View>
    </View>
    <Entypo name="chevron-right" size={28} color={colors.highlight} />
  </TouchableOpacity>
);

export default TouchableRow;
