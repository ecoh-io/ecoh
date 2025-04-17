import React, { memo } from 'react';
import { Text, TouchableOpacity, SafeAreaView, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ProfileHeaderProps } from './types';
import { styles } from './styles';

const Header: React.FC<ProfileHeaderProps> = ({
  username,
  onEditPress,
  colors,
}) => {
  return (
    <View
      style={[styles.headerContainer, { backgroundColor: colors.background }]}
    >
      <SafeAreaView>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>{username}</Text>
          <TouchableOpacity
            accessibilityLabel="Edit Profile"
            accessibilityHint="Navigates to profile editing screen"
            onPress={onEditPress}
            style={[styles.headerIcon, { backgroundColor: colors.highlight }]}
          >
            <MaterialCommunityIcons
              name="pencil-outline"
              size={24}
              color={colors.text}
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default memo(Header);
