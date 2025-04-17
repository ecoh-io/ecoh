import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '@/src/theme/ThemeContext';
import { styles } from './styles';
import { HeaderProps } from './types';

const Header = React.memo(({ title, subtitle, icon }: HeaderProps) => {
  const { colors } = useTheme();

  return (
    <View style={{ flexDirection: 'column', gap: 14 }}>
      <View style={styles.row}>
        {icon && <View style={styles.icon}>{icon}</View>}
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      </View>
      {subtitle && (
        <Text style={[styles.subtitle, { color: colors.text }]}>
          {subtitle}
        </Text>
      )}
    </View>
  );
});

export default Header;
