import React, { memo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Entypo, MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useTheme } from '@/src/theme/ThemeContext';
import { styles } from './styles';
import { HeaderProps } from './types';

const Header: React.FC<HeaderProps> = ({
  title,
  username,
  coverPhoto,
  onBack,
  onDeleteAlbum,
  onToggleEdit,
  editMode,
}) => {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          borderBottomColor: colors.secondary,
        },
      ]}
    >
      {/* Back */}
      <TouchableOpacity
        onPress={onBack}
        accessibilityLabel="Go back"
        style={styles.backButton}
      >
        <Entypo name="chevron-left" size={36} color={colors.text} />
      </TouchableOpacity>

      {/* Cover Photo */}
      <Image
        source={{ uri: coverPhoto }}
        style={styles.cover}
        contentFit="cover"
      />

      {/* Title and Username */}
      <View style={styles.textWrapper}>
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
          {title}
        </Text>
        <Text
          style={[styles.subtitle, { color: colors.secondary }]}
          numberOfLines={1}
        >
          {username}
        </Text>
      </View>

      {/* Actions */}
      {editMode ? (
        <TouchableOpacity onPress={onToggleEdit} style={styles.doneButton}>
          <Text style={[styles.doneText, { color: colors.text }]}>Done</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.actions}>
          <TouchableOpacity
            onPress={onToggleEdit}
            accessibilityLabel="Edit Album"
            style={[styles.iconButton, { backgroundColor: colors.highlight }]}
          >
            <MaterialCommunityIcons
              name="pencil-outline"
              size={22}
              color={colors.text}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onDeleteAlbum}
            accessibilityLabel="Delete Album"
            style={[styles.iconButton, { backgroundColor: colors.highlight }]}
          >
            <Entypo name="trash" size={22} color="red" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default memo(Header);
