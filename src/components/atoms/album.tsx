import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  ImageStyle,
  ViewStyle,
  Text,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { Visibility } from '@/src/enums/visibility.enum';
import { typography } from '@/src/theme/typography';

interface AlbumCircleProps {
  /** Image URI for the album cover */
  uri: string;
  /** Total diameter of the component. Defaults to 80 */
  size?: number;
  /** The halo (border) thickness for non-private visibilities. Defaults to 4 */
  haloSize?: number;
  /** Visibility enum to determine which border style to use */
  visibility: Visibility;
  /** Optional style overrides for the image */
  imageStyle?: ImageStyle;
  /** Optional style overrides for the outer container */
  containerStyle?: ViewStyle;
}

// Solid colors for the visibilities
const solidColorByVisibility: Record<Visibility, string> = {
  [Visibility.PRIVATE]: '', // No border for private
  [Visibility.CONNECTIONS_ONLY]: '', // Not used because we apply gradient
  [Visibility.NETWORK_ONLY]: '#85B1FF', // Updated solid color for network only
  [Visibility.EVERYONE]: '#D4DEE4', // Darker blue/gray
};

const connectionsGradientColors: [string, string] = ['#00c6ff', '#0072ff'];

const AlbumCircle: React.FC<AlbumCircleProps> = ({
  uri,
  size = 80,
  haloSize = 4,
  visibility,
  imageStyle,
  containerStyle,
}) => {
  // For PRIVATE, no border is applied so the image takes the full size.
  // For others, the image is inset by the haloSize.
  const imageSize =
    visibility === Visibility.PRIVATE ? size : size - haloSize * 2;

  // Renders the inner circular image with an optional blur overlay & lock icon.
  const renderImageContainer = () => (
    <View
      style={{
        width: imageSize,
        height: imageSize,
        borderRadius: imageSize / 2,
        overflow: 'hidden',
        backgroundColor: '#fff',
      }}
    >
      <Image
        source={{ uri }}
        style={[
          styles.image,
          {
            width: '100%',
            height: '100%',
            borderRadius: imageSize / 2,
            padding: haloSize,
          },
          imageStyle,
        ]}
        resizeMode="cover"
      />
      {visibility === Visibility.PRIVATE && (
        <BlurView intensity={50} tint="dark" style={styles.blurOverlay}>
          <Ionicons name="lock-closed" size={24} color="#fff" />
          <Text style={styles.privateText}>Private</Text>
        </BlurView>
      )}
    </View>
  );

  if (visibility === Visibility.PRIVATE) {
    // Render without a border.
    return (
      <View
        style={[
          styles.outerContainer,
          { width: size, height: size, borderRadius: size / 2 },
          containerStyle,
        ]}
      >
        {renderImageContainer()}
      </View>
    );
  } else if (visibility === Visibility.CONNECTIONS_ONLY) {
    // Render with a gradient halo for CONNECTIONS_ONLY.
    return (
      <LinearGradient
        colors={connectionsGradientColors}
        style={[
          styles.outerContainer,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            padding: haloSize,
          },
          containerStyle,
        ]}
      >
        {renderImageContainer()}
      </LinearGradient>
    );
  } else if (visibility === Visibility.NETWORK_ONLY) {
    // Render with a solid colored halo for NETWORK_ONLY.
    return (
      <View
        style={[
          styles.outerContainer,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            padding: haloSize,
            backgroundColor: solidColorByVisibility[visibility],
          },
          containerStyle,
        ]}
      >
        {renderImageContainer()}
      </View>
    );
  } else {
    // For EVERYONE, render with a solid colored halo.
    return (
      <View
        style={[
          styles.outerContainer,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            padding: haloSize,
            backgroundColor: solidColorByVisibility[visibility],
          },
          containerStyle,
        ]}
      >
        {renderImageContainer()}
      </View>
    );
  }
};

export default AlbumCircle;

const styles = StyleSheet.create({
  outerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    // Additional image styling if needed.
  },
  privateText: {
    fontFamily: typography.fontFamilies.poppins.medium,
    fontSize: typography.fontSizes.caption,
    color: '#fff',
  },
  blurOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    gap: 5,
  },
});
