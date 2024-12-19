import { Colors } from '@/src/types/color';
import { FontAwesome6, FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';

interface SocialChipProps {
  label: string;
  iconName: keyof typeof FontAwesome6.glyphMap;
  onDelete?: () => void;
  colors: Colors;
}

const SocialChip: React.FC<SocialChipProps> = ({
  label,
  iconName,
  onDelete,
  colors,
}) => {
  return (
    <View style={[styles.chipContainer, { backgroundColor: colors.highlight }]}>
      <FontAwesome6 name={iconName} size={18} color={colors.text} />
      <Text>{label}</Text>
      {onDelete ? (
        <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
          <FontAwesome name="close" size={18} color={colors.text} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

export default SocialChip;

const styles = StyleSheet.create({
  chipContainer: {
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 16,
  },

  deleteButton: {
    borderRadius: 8,
    padding: 2,
  },
});
