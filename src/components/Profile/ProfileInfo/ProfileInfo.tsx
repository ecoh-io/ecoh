import { Colors } from '@/src/types/color';
import { memo } from 'react';
import { Text, View } from 'react-native';
import { styles } from './ProfileInfo.styles';
import { Image } from 'expo-image';
import { User } from '@/src/interfaces/user';

interface ProfileInfoProps {
  user: User;
  colors: Colors;
}

const ProfileInfo: React.FC<ProfileInfoProps> = memo(({ user, colors }) => (
  <View style={styles.profileInfo}>
    <View style={styles.userInfo}>
      <Image
        source={{
          uri:
            user?.profile.profilePictureUrl ||
            'https://via.placeholder.com/100',
        }}
        style={styles.profileImage}
        accessibilityLabel="Profile picture"
      />
      <View style={styles.followInfo}>
        <View style={styles.followCount}>
          <Text style={[styles.followNumber, { color: colors.text }]}>
            {'0'}
          </Text>
          <Text style={[styles.followLabel, { color: colors.text }]}>
            Connections
          </Text>
        </View>
        <View style={styles.followCount}>
          <Text style={[styles.followNumber, { color: colors.text }]}>
            {'0'}
          </Text>
          <Text style={[styles.followLabel, { color: colors.text }]}>
            Followers
          </Text>
        </View>
        <View style={styles.followCount}>
          <Text style={[styles.followNumber, { color: colors.text }]}>
            {'0'}
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
