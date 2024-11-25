import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { User } from '@/src/types/post';
import AnimatedOptionsButton from './AnimatedOptionsButton';
import VerifiedBadge from './VerifiedBadge';
import { useTheme } from '@/src/theme/ThemeContext';
import { typography } from '@/src/theme/typography';
import { getShortTimeAgo } from '@/src/lib/timeHelpers';

interface PostHeaderProps {
  user: User;
  timestamp: Date;
  onOptionsPress: () => void;
}

const PostHeader: React.FC<PostHeaderProps> = ({
  user,
  timestamp,
  onOptionsPress,
}) => {
  const { colors } = useTheme();
  const timeAgo = getShortTimeAgo(timestamp);

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: user.avatarUri }}
        style={styles.avatar}
        accessible
        accessibilityLabel={`${user.name}'s avatar`}
      />

      <View style={styles.userInfo}>
        <View style={styles.nameRow}>
          <Text
            style={[styles.username, { color: colors.text }]}
            accessible
            accessibilityLabel={user.name}
          >
            {user.name}
          </Text>
          {user.isVerified && <VerifiedBadge />}
        </View>
        <Text
          style={[styles.userHandle, { color: colors.highlight }]}
          accessible
          accessibilityLabel={`@${user.username}`}
        >
          @{user.username}
        </Text>
      </View>

      <Text style={[styles.timestamp, { color: colors.highlight }]}>
        {timeAgo}
      </Text>

      <AnimatedOptionsButton onPress={onOptionsPress} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    position: 'relative',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  username: {
    fontSize: 16,
    fontFamily: typography.Poppins.medium,
  },
  userHandle: {
    fontSize: 14,
    fontFamily: typography.Poppins.medium,
    marginTop: 2,
  },
  timestamp: {
    fontSize: 14,
    fontFamily: typography.Poppins.regular,
    marginLeft: 8,
  },
});

export default React.memo(
  PostHeader,
  (prevProps, nextProps) =>
    prevProps.user.id === nextProps.user.id &&
    prevProps.timestamp === nextProps.timestamp,
);
