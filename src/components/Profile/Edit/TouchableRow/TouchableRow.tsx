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
  <TouchableOpacity style={styles.touchableContainer} onPress={onPress}>
    <View style={styles.touchableRow}>
      <Feather name={iconName as any} size={38} color={colors.text} />
      <View style={styles.touchableRowTextContainer}>
        <Text style={[styles.touchableRowLabel, { color: colors.text }]}>
          {label}
        </Text>
        <Text
          style={[styles.touchableRowValue, { color: colors.text }]}
          numberOfLines={1}
        >
          {value}
        </Text>
      </View>
    </View>
    <Entypo name="chevron-right" size={32} color={colors.highlight} />
  </TouchableOpacity>
);

export default TouchableRow;
