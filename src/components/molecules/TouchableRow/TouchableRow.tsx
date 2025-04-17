import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Entypo, Feather } from '@expo/vector-icons';
import { styles } from './styles';
import { formatValue } from './utils';
import { TouchableRowProps } from './types';

const TouchableRow: React.FC<TouchableRowProps> = ({
  iconName,
  label,
  value,
  onPress,
  colors,
  isLastItem = false,
}) => (
  <TouchableOpacity
    style={[
      styles.touchableContainer,
      isLastItem && { borderBottomWidth: 0 },
      { borderColor: colors.highlight },
    ]}
    onPress={onPress}
  >
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
