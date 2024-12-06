import { Colors } from '@/src/types/color';
import { User } from '@/src/types/user';
import { memo } from 'react';
import { Image, Text, View } from 'react-native';
import { styles } from './ProfileInfo.styles';

interface ProfileInfoProps {
  user: User;
  colors: Colors;
}

const ProfileInfo: React.FC<ProfileInfoProps> = memo(({ user, colors }) => (
  <View style={styles.profileInfo}>
    <View style={styles.userInfo}>
      <Image
        source={{
          uri: user?.profileImage || 'https://via.placeholder.com/100',
        }}
        style={styles.profileImage}
        accessibilityLabel="Profile picture"
      />
      <View style={styles.followInfo}>
        <View style={styles.followCount}>
          <Text style={[styles.followNumber, { color: colors.text }]}>
            {user?.connectionsCount || '0'}
          </Text>
          <Text style={[styles.followLabel, { color: colors.text }]}>
            Connections
          </Text>
        </View>
        <View style={styles.followCount}>
          <Text style={[styles.followNumber, { color: colors.text }]}>
            {user?.followersCount || '0'}
          </Text>
          <Text style={[styles.followLabel, { color: colors.text }]}>
            Followers
          </Text>
        </View>
        <View style={styles.followCount}>
          <Text style={[styles.followNumber, { color: colors.text }]}>
            {user?.followingCount || '0'}
          </Text>
          <Text style={[styles.followLabel, { color: colors.text }]}>
            Following
          </Text>
        </View>
      </View>
    </View>
  </View>
));

export default ProfileInfo;
