import React, { memo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Entypo, MaterialCommunityIcons } from '@expo/vector-icons';
import { typography } from '@/src/theme/typography';
import { Image } from 'expo-image';

interface HeaderProps {
  title: string;
  username: string;
  coverPhoto: string;
  onBack: () => void;
  onDeleteAlbum: () => void;
  onToggleEdit: () => void;
  editMode: boolean;
  colors: any;
}

const Header: React.FC<HeaderProps> = ({
  title,
  username,
  coverPhoto,
  onBack,
  onDeleteAlbum,
  onToggleEdit,
  editMode,
  colors,
}) => {
  return (
    <View
      style={[styles.headerContainer, { backgroundColor: colors.background }]}
    >
      <TouchableOpacity onPress={onBack}>
        <Entypo name="chevron-left" size={42} color={colors.text} />
      </TouchableOpacity>
      <Image
        source={{ uri: coverPhoto }}
        style={{ width: 46, height: 46, borderRadius: 46 / 2, marginRight: 14 }}
      />
      <View style={styles.titleContainer}>
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
      {editMode ? (
        <>
          <TouchableOpacity onPress={onToggleEdit} style={styles.editButton}>
            <Text style={[styles.editButtonText, { color: colors.text }]}>
              Done
            </Text>
          </TouchableOpacity>
        </>
      ) : (
        <View
          style={{ flexDirection: 'row', justifyContent: 'center', gap: 14 }}
        >
          <TouchableOpacity
            accessibilityLabel="Edit Profile"
            accessibilityHint="Navigates to profile editing screen"
            onPress={onToggleEdit}
            style={[styles.headerIcon, { backgroundColor: colors.highlight }]}
          >
            <MaterialCommunityIcons
              name="pencil-outline"
              size={24}
              color={colors.text}
            />
          </TouchableOpacity>
          <TouchableOpacity
            accessibilityLabel="Delete Album"
            accessibilityHint="Deletes the current album"
            onPress={onDeleteAlbum}
            style={[styles.headerIcon, { backgroundColor: colors.highlight }]}
          >
            <Entypo name="trash" size={24} color="red" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 8,
    paddingRight: 16,
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontFamily: typography.fontFamilies.poppins.semiBold,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: typography.fontFamilies.poppins.medium,
  },
  editButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  editButtonText: {
    fontSize: 16,
    fontFamily: typography.fontFamilies.poppins.medium,
  },
  deleteAlbumButton: {
    paddingLeft: 10,
  },
  deleteSelectedButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  headerIcon: {
    padding: 8,
    borderRadius: 20,
  },
});

export default memo(Header);
