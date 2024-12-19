import { typography } from '@/src/theme/typography';
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
    <View style={[styles.chipContainer, { backgroundColor: colors.testGray }]}>
      <FontAwesome6 name={iconName} size={18} color={colors.text} />
      <Text style={styles.label}>{label}</Text>
      {onDelete ? (
        <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
          <FontAwesome name="close" size={12} color={colors.text} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

export default SocialChip;

const styles = StyleSheet.create({
  chipContainer: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 16,
  },
  deleteButton: {
    width: 21,
    height: 21,
    borderRadius: 32,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontFamily: typography.fontFamilies.poppins.medium,
  },
});
