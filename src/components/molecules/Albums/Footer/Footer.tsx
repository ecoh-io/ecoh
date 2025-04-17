import React, { memo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { useTheme } from '@/src/theme/ThemeContext';
import { styles } from './styles';
import { FooterProps } from './types';

const Footer: React.FC<FooterProps> = ({ selectedCount, onDelete }) => {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          borderColor: colors.secondary,
        },
      ]}
    >
      <Text style={[styles.label, { color: colors.text }]}>
        {selectedCount} {selectedCount === 1 ? 'photo' : 'photos'} selected
      </Text>

      <TouchableOpacity
        style={[styles.deleteButton, { backgroundColor: colors.secondary }]}
        onPress={onDelete}
        accessibilityRole="button"
        accessibilityLabel="Delete selected photos"
      >
        <Entypo name="trash" size={22} color={colors.text} />
      </TouchableOpacity>
    </View>
  );
};

export default memo(Footer);
