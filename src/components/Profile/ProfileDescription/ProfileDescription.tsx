import { Colors } from '@/src/types/color';
import { User } from '@/src/types/user';
import { memo } from 'react';
import { Text, View } from 'react-native';
import { styles } from './ProfileDescription.styles';

interface ProfileDescriptionProps {
  user: User;
  colors: Colors;
}

const ProfileDescription: React.FC<ProfileDescriptionProps> = memo(
  ({ user, colors }) => (
    <View style={styles.profileDescription}>
      <Text style={[styles.profileName, { color: colors.text }]}>
        {user?.displayName || ''}
      </Text>
      {user.bio ? (
        <Text style={[styles.profileBio, { color: colors.text }]}>
          {user.bio}
        </Text>
      ) : null}
    </View>
  ),
);

export default ProfileDescription;
