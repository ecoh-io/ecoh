import { Colors } from '@/src/types/color';
import { Entypo, Feather } from '@expo/vector-icons';
import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from './TouchableRow.styles';
import { Location } from '@/src/types/location';

interface ProfileInputRowProps {
  iconName: string;
  label: string;
  value: string | Record<string, string> | Location;
  onPress: () => void;
  colors: Colors;
}
/**
 * Type guard to check if the value is a Location object.
 * @param value - The value to check.
 * @returns True if value is Location, else false.
 */
const isLocation = (value: any): value is Location => {
  return (
    value &&
    typeof value === 'object' &&
    value.type === 'Point' &&
    Array.isArray(value.coordinates) &&
    value.coordinates.length === 2 &&
    value.coordinates.every((coord: any) => typeof coord === 'number')
  );
};

/**
 * Type guard to check if the value is a Record<string, string>.
 * @param value - The value to check.
 * @returns True if value is Record<string, string>, else false.
 */
const isRecord = (value: any): value is Record<string, string> => {
  return (
    value &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    !isLocation(value)
  );
};

/**
 * Helper function to format the value prop into a string for display.
 * @param value - The value to format.
 * @returns A formatted string representation of the value.
 */
const formatValue = (
  value: string | Record<string, string> | Location,
): string => {
  if (typeof value === 'string') {
    return value;
  } else if (isLocation(value)) {
    const [longitude, latitude] = value.coordinates;
    return `Lat: ${latitude}, Lon: ${longitude}`;
  } else if (isRecord(value)) {
    // Example: Display key-value pairs separated by commas
    return Object.entries(value)
      .map(([key, val]) => `${key}: ${val}`)
      .join(', ');
  }
  return '';
};

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
          {formatValue(value)}
        </Text>
      </View>
    </View>
    <Entypo name="chevron-right" size={32} color={colors.highlight} />
  </TouchableOpacity>
);

export default TouchableRow;
