import { typography } from '@/src/theme/typography';
import { Colors } from '@/src/types/color';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { memo } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  Platform,
  SafeAreaView,
  View,
} from 'react-native';

const HEADER_HEIGHT = 60;

interface HeaderProps {
  username: string;
  onEditPress: () => void;
  colors: Colors;
}

const ProfileHeader: React.FC<HeaderProps> = memo(
  ({ username, onEditPress, colors }) => {
    return (
      <View
        style={[
          styles.headerContainer,
          {
            backgroundColor: colors.background,
          },
        ]}
      >
        <SafeAreaView>
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>
              {username}
            </Text>
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
  },
);

const styles = StyleSheet.create({
  headerContainer: {
    zIndex: 100,
  },
  header: {
    height: HEADER_HEIGHT,
    flexDirection: 'row',
    paddingHorizontal: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontFamily: typography.fontFamilies.poppins.bold,
    fontSize: typography.fontSizes.title,
  },
  headerIcon: {
    padding: 8,
    borderRadius: 20,
  },
});

export default memo(ProfileHeader);
