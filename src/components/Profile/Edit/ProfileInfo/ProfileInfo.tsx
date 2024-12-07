import { Colors } from '@/src/types/color';
import { User } from '@/src/types/user';
import { Image, Text, View } from 'react-native';
import { styles } from './ProfileInfo.styles';
import { memo } from 'react';

const PROFILE_IMAGE_URL = 'https://via.placeholder.com/100';

interface ProfileInfoProps {
  user: User;
  colors: Colors;
}
// Reusable Profile Info Component
const ProfileInfo: React.FC<ProfileInfoProps> = memo(({ user, colors }) => (
  <View style={styles.imageContainer}>
    <Image
      source={{ uri: PROFILE_IMAGE_URL }}
      style={styles.profileImage}
      accessibilityLabel="Profile picture"
    />
    <View style={styles.profileTextContainer}>
      <Text style={[styles.name, { color: colors.text }]}>
        {user.displayName ?? 'Unnamed User'}
      </Text>
      <Text style={[styles.username, { color: colors.text }]}>
        {user.username ?? 'username'}
      </Text>
    </View>
  </View>
));

export default ProfileInfo;
