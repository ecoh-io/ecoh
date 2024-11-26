import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { User } from '@/src/types/post';
import AnimatedOptionsButton from './Animated/AnimatedOptionsButton';
import VerifiedBadge from './VerifiedBadge';
import Badge from './Badge';
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

  // Determine which badge to show
  let badgeType: 'connection' | 'following' | null = null;
  if (user.isConnection) {
    badgeType = 'connection';
  } else if (user.isFollowing) {
    badgeType = 'following';
  }

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
            numberOfLines={1}
            ellipsizeMode="tail"
            accessible
            accessibilityLabel={user.name}
          >
            {user.name}
          </Text>
          {user.isVerified && <VerifiedBadge />}
        </View>

        <Text
          style={[styles.userHandle, { color: colors.highlight }]}
          numberOfLines={1}
          ellipsizeMode="tail"
          accessible
          accessibilityLabel={`@${user.username}`}
        >
          @{user.username}
        </Text>
      </View>

      <View style={styles.rightSection}>
        {badgeType && <Badge type={badgeType} />}
        <View style={styles.timestampRow}>
          <Text style={[styles.timestamp, { color: colors.secondary }]}>
            {timeAgo}
          </Text>
          <AnimatedOptionsButton onPress={onOptionsPress} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24, // Perfect circle
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  username: {
    fontSize: 16,
    fontFamily: typography.Poppins.medium,
    maxWidth: '80%',
  },
  userHandle: {
    fontSize: 14,
    fontFamily: typography.Poppins.regular,
    marginTop: 2,
    color: '#6b6b6b',
    maxWidth: '50%',
  },
  timestampRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
  },
  timestamp: {
    fontSize: 14,
    fontFamily: typography.Poppins.light,
    marginRight: 8,
  },
  rightSection: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
});

export default React.memo(
  PostHeader,
  (prevProps, nextProps) =>
    prevProps.user.id === nextProps.user.id &&
    prevProps.timestamp.getTime() === nextProps.timestamp.getTime(),
);
