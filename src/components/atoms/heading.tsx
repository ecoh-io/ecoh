import { useTheme } from '@/src/theme/ThemeContext';
import { typography } from '@/src/theme/typography';
import { View, Text, StyleSheet } from 'react-native';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  const { colors } = useTheme();
  return (
    <View style={{ flexDirection: 'column', gap: 10 }}>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      <Text style={[styles.subtitle, { color: colors.text }]}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontFamily: typography.Poppins.medium,
    fontSize: 18,
  },
  subtitle: { fontFamily: typography.Poppins.medium, fontSize: 16 },
});
