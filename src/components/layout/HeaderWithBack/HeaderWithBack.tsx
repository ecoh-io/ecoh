import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { useTheme } from '@/src/theme/ThemeContext';
import { styles } from './styles';
import { HeaderWithBackProps } from './types';

const HeaderWithBack = ({ title, onBackPress, right }: HeaderWithBackProps) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
        <Entypo name="chevron-left" size={32} color={colors.text} />
      </TouchableOpacity>

      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>

      <View style={{ flex: 1 }} />

      {right}
    </View>
  );
};

export default HeaderWithBack;
