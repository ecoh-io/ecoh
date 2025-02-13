import { Colors } from '@/src/types/color';
import { memo } from 'react';
import {
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { styles } from './ProfileDescription.styles';
import { User } from '@/src/interfaces/user';
import SocialChip from '../../atoms/socialChip';
import { useRouter } from 'expo-router';
import { Entypo } from '@expo/vector-icons';
import { typography } from '@/src/theme/typography';
import { SOCIAL_PLATFORMS } from '@/src/constants/SocialPlatforms';

interface ProfileDescriptionProps {
  user: User;
  colors: Colors;
}

const ProfileDescription: React.FC<ProfileDescriptionProps> = memo(
  ({ user, colors }) => {
    const router = useRouter();

    const extractUsernameFromUrl = (url: string) => {
      try {
        const urlObj = new URL(url);
        const pathSegments = urlObj.pathname.split('/');
        return pathSegments[pathSegments.length - 1] || urlObj.hostname;
      } catch (error) {
        console.error('Invalid URL:', url);
        return url; // Fallback to the full URL if parsing fails
      }
    };

    const handleChipPress = (url: string) => {
      Linking.openURL(url).catch((err) =>
        console.error('Failed to open URL:', err),
      );
    };

    const handleAddAlbumPress = () => {
      router.push('/create-album'); // Navigate to the create album screen
    };

    return (
      <View style={styles.profileDescription}>
        <Text style={[styles.profileName, { color: colors.text }]}>
          {user?.name || ''}
        </Text>
        {user.profile.bio ? (
          <Text style={[styles.profileBio, { color: colors.text }]}>
            {user.profile.bio}
          </Text>
        ) : null}
        {user.profile.links ? (
          <View style={styles.socialLinks}>
            {Object.entries(user.profile.links).map(
              ([platform, url], index) => {
                const pl = SOCIAL_PLATFORMS.find((p) => p.key === platform);

                if (!pl) return null;
                return (
                  <TouchableOpacity onPress={() => handleChipPress(url)}>
                    <SocialChip key={index} platform={pl} />
                  </TouchableOpacity>
                );
              },
            )}
          </View>
        ) : null}
        <ScrollView
          style={styles.albumsContainer}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        >
          <TouchableOpacity
            onPress={handleAddAlbumPress}
            style={{
              flexDirection: 'column',
              gap: 10,
              marginRight: 10,
            }}
          >
            <View
              style={{
                borderWidth: 1,
                borderStyle: 'dashed',
                borderColor: colors.secondary,
                borderRadius: 8,
                paddingHorizontal: 8,
                paddingVertical: 32,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Entypo name="plus" size={32} color={colors.secondary} />
            </View>
            <Text
              style={{
                color: colors.secondary,
                fontFamily: typography.fontFamilies.poppins.medium,
              }}
            >
              Create Album
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  },
);

export default ProfileDescription;
