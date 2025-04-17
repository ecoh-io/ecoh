import React from 'react';
import { View, Text, Image } from 'react-native';
import { useTheme } from '@/src/theme/ThemeContext';
import { getShortTimeAgo } from '@/src/lib/timeHelpers';
import { styles } from './styles';
import { PostHeaderProps } from './types';
import { RelationshipBadge, VerifiedBadge } from '@/src/components/atoms';

const PostHeader: React.FC<PostHeaderProps> = ({
  user,
  timestamp,
  onOptionsPress,
}) => {
  const { colors } = useTheme();
  const timeAgo = getShortTimeAgo(timestamp);

  let badgeType: 'connection' | 'following' | null = null;
  if (user.isConnection) badgeType = 'connection';
  else if (user.isFollowing) badgeType = 'following';

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
          style={[styles.userHandle, { color: colors.secondary }]}
          numberOfLines={1}
          ellipsizeMode="tail"
          accessible
          accessibilityLabel={`@${user.username}`}
        >
          @{user.username}
        </Text>
      </View>

      <View style={styles.rightSection}>
        {badgeType && <RelationshipBadge type={badgeType} />}
        <View style={styles.timestampRow}>
          <Text style={[styles.timestamp, { color: colors.secondary }]}>
            {timeAgo}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default React.memo(
  PostHeader,
  (prev, next) =>
    prev.user.id === next.user.id &&
    prev.timestamp.getTime() === next.timestamp.getTime(),
);
