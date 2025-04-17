import { memo } from 'react';
import {
  Dimensions,
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Entypo } from '@expo/vector-icons';
import { typography } from '@/src/theme/typography';
import { SOCIAL_PLATFORMS } from '@/src/constants/SocialPlatforms';
import { useAlbums } from '@/src/api/album/useAlbumQuries';
import { Album } from '@/src/types/Album';
import { DescriptionProps } from './types';
import { styles } from './styles';
import SocialChip from '@/src/components/molecules/SocialChip';
import { AlbumCircle } from '@/src/components/molecules/Albums';

const DEFAULT_PROFILE_IMAGE_URL = 'https://via.placeholder.com/100';

const Description: React.FC<DescriptionProps> = memo(({ user, colors }) => {
  const router = useRouter();
  const { data: albums, isLoading } = useAlbums();
  const { width: screenWidth } = Dimensions.get('window');
  const albumWidth = screenWidth * 0.16;

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
    router.push('/album/create-album'); // Navigate to the create album screen
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
          {Object.entries(user.profile.links).map(([platform, url], index) => {
            const pl = SOCIAL_PLATFORMS.find((p) => p.key === platform);

            if (!pl) return null;
            return (
              <TouchableOpacity onPress={() => handleChipPress(url)}>
                <SocialChip key={index} platform={pl} />
              </TouchableOpacity>
            );
          })}
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
            marginRight: 14,
          }}
        >
          <View
            style={{
              borderWidth: 1,
              borderStyle: 'dashed',
              borderColor: colors.secondary,
              borderRadius: albumWidth / 2, // Make it circular
              width: albumWidth,
              height: albumWidth,
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
              fontSize: typography.fontSizes.caption,
            }}
          >
            Create Album
          </Text>
        </TouchableOpacity>
        {!isLoading &&
          albums &&
          albums?.length > 0 &&
          albums?.map((album: Album) => (
            <TouchableOpacity
              key={album.id}
              style={{
                flexDirection: 'column',
                gap: 10,
                marginRight: 14,
                width: albumWidth,
                alignItems: 'center',
              }}
              onPress={() => router.push(`/album/${album.id}`)}
            >
              <AlbumCircle
                uri={album.coverPhoto.url}
                visibility={album.visibility}
                size={albumWidth}
                haloSize={3}
              />
              <Text
                style={[styles.albumName, { color: colors.text }]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {album.name}
              </Text>
            </TouchableOpacity>
          ))}
      </ScrollView>
    </View>
  );
});

export default Description;
