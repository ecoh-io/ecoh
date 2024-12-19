import { Colors } from '@/src/types/color';
import { memo } from 'react';
import { Text, View } from 'react-native';
import { styles } from './ProfileDescription.styles';
import { User } from '@/src/interfaces/user';

interface ProfileDescriptionProps {
  user: User;
  colors: Colors;
}

const ProfileDescription: React.FC<ProfileDescriptionProps> = memo(
  ({ user, colors }) => (
    <View style={styles.profileDescription}>
      <Text style={[styles.profileName, { color: colors.text }]}>
        {user?.name || ''}
      </Text>
      {user.profile.bio ? (
        <Text style={[styles.profileBio, { color: colors.text }]}>
          {user.profile.bio}
        </Text>
      ) : null}
    </View>
  ),
);

export default ProfileDescription;
