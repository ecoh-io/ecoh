import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
  FlatList,
  Dimensions,
  Share,
} from 'react-native';
import { useTheme } from '@/src/theme/ThemeContext';
import { typography } from '@/src/theme/typography';
import { Ionicons } from '@expo/vector-icons'; // Ensure you have expo/vector-icons installed

interface LinkPreviewComponentProps {
  preview: {
    title?: string;
    description?: string;
    images?: string[];
    url: string;
  };
}

const LinkPreviewComponent: React.FC<LinkPreviewComponentProps> = ({
  preview,
}) => {
  const { title, description, images, url } = preview;
  const { colors } = useTheme();
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const handlePress = () => {
    Linking.openURL(url).catch((err) =>
      console.error("Couldn't open URL", err),
    );
  };

  const handleShare = () => {
    Share.share({
      message: `${title ? title + '\n' : ''}${url}`,
      url: url,
      title: title || 'Check out this link!',
    }).catch((error) => console.error('Error sharing link:', error));
  };

  const getDomain = (link: string) => {
    try {
      const domain = new URL(link).hostname.replace('www.', '');
      return domain;
    } catch (error) {
      return '';
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[
        styles.container,
        { backgroundColor: colors.background, borderColor: colors.secondary },
      ]}
      accessible
      accessibilityRole="link"
      accessibilityLabel={`Link preview for ${title || getDomain(url)}`}
      activeOpacity={0.8}
    >
      {images && images.length > 0 ? (
        <View style={styles.imageContainer}>
          <FlatList
            data={images}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => `${item}-${index}`}
            renderItem={({ item }) => (
              <Image
                source={{ uri: item }}
                style={styles.image}
                onLoadStart={() => setImageLoading(true)}
                onLoadEnd={() => setImageLoading(false)}
                onError={() => {
                  setImageLoading(false);
                  setImageError(true);
                }}
                resizeMode="cover"
              />
            )}
          />
          {imageLoading && (
            <ActivityIndicator
              style={styles.loadingIndicator}
              size="small"
              color={colors.primary}
            />
          )}
        </View>
      ) : (
        <View style={[styles.image, styles.placeholderImage]}>
          <Ionicons name="link" size={24} color={colors.text} />
        </View>
      )}
      <View style={styles.textContainer}>
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
          {title || getDomain(url)}
        </Text>
        {description && (
          <Text
            style={[styles.description, { color: colors.placeholder }]}
            numberOfLines={3}
          >
            {description}
          </Text>
        )}
        <Text style={[styles.domain, { color: colors.secondary }]}>
          {getDomain(url)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const IMAGE_WIDTH = 125;
const IMAGE_HEIGHT = 140;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginTop: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  imageContainer: {
    width: IMAGE_WIDTH,
    height: IMAGE_HEIGHT,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: IMAGE_WIDTH,
    height: IMAGE_HEIGHT,
    resizeMode: 'contain',
  },
  placeholderImage: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
  },
  loadingIndicator: {
    position: 'absolute',
    top: IMAGE_HEIGHT / 2 - 10,
    left: IMAGE_WIDTH / 2 - 10,
  },
  errorContainer: {
    position: 'absolute',
    top: IMAGE_HEIGHT / 2 - 20,
    left: IMAGE_WIDTH / 2 - 40,
    width: 80,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
  textContainer: {
    flex: 1,
    flexDirection: 'column',
    paddingTop: 8,
    paddingHorizontal: 12,
  },
  title: {
    fontSize: 16,
    fontFamily: typography.Poppins.medium,
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    fontFamily: typography.Poppins.regular,
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  domain: {
    fontSize: 12,
    fontFamily: typography.Poppins.medium,
  },
  shareButton: {
    padding: 4,
  },
});

export default LinkPreviewComponent;
