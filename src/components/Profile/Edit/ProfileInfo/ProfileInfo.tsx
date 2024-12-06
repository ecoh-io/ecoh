import { Colors } from '@/src/types/color';
import { User } from '@/src/types/user';
import { Image, Text, View } from 'react-native';
import { styles } from './ProfileInfo.styles';

const PROFILE_IMAGE_URL = 'https://via.placeholder.com/100';

interface ProfileInfoProps {
  user: User;
  colors: Colors;
}
// Reusable Profile Info Component
const ProfileInfo: React.FC<ProfileInfoProps> = ({ user, colors }) => (
  <View style={styles.imageContainer}>
    <Image
      source={{ uri: PROFILE_IMAGE_URL }}
      style={styles.profileImage}
      accessibilityLabel="Profile picture"
    />
    <View style={styles.profileTextContainer}>
      <Text style={styles.name}>{user.displayName ?? 'Unnamed User'}</Text>
      <Text style={[styles.username, { color: colors.backdrop }]}>
        {user.username ?? 'username'}
      </Text>
    </View>
  </View>
);

export default ProfileInfo;
