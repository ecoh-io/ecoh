import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
  Share,
  LayoutChangeEvent,
} from 'react-native';
import { useTheme } from '@/src/theme/ThemeContext';
import { typography } from '@/src/theme/typography';

interface LinkPreviewComponentProps {
  preview: {
    title?: string;
    description?: string;
    image?: string;
    url: string;
  };
}

const LinkPreviewComponent: React.FC<LinkPreviewComponentProps> = ({
  preview,
}) => {
  const { title, description, image, url } = preview;
  const { colors } = useTheme();
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);

  // Compute image height based on container's width (e.g., 60% of container's width)
  const imageHeight = containerWidth ? containerWidth * 0.55 : 200;

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

  const onContainerLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    setContainerWidth(width);
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          borderColor: colors.secondary,
        },
      ]}
      onLayout={onContainerLayout}
      accessible
      accessibilityRole="link"
      accessibilityLabel={`Link preview for ${title || getDomain(url)}`}
      activeOpacity={0.8}
    >
      <View style={[styles.imageContainer, { height: imageHeight }]}>
        <Image
          source={{
            uri: image || 'https://dummyimage.com/600x400/000/fff&text=John',
          }}
          style={styles.image}
          onLoadStart={() => setImageLoading(true)}
          onLoadEnd={() => setImageLoading(false)}
          onError={() => {
            setImageLoading(false);
            setImageError(true);
          }}
          resizeMode="cover"
        />
        {imageLoading && (
          <ActivityIndicator
            style={[styles.loadingIndicator, { top: imageHeight / 2 - 10 }]}
          />
        )}
        {imageError && (
          <View style={[styles.errorContainer, { top: imageHeight / 2 - 20 }]}>
            <Text style={styles.errorText}>Failed to load image</Text>
          </View>
        )}
      </View>

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

const styles = StyleSheet.create({
  container: {
    width: '100%', // Respect parent's width and padding
    flexDirection: 'column',
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
  },
  imageContainer: {
    width: '100%',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  loadingIndicator: {
    position: 'absolute',
    left: '50%',
    marginLeft: -10, // half the indicator width
  },
  errorContainer: {
    position: 'absolute',
    left: '50%',
    marginLeft: -40, // adjust based on text width
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
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  title: {
    fontSize: typography.fontSizes.body,
    fontFamily: typography.fontFamilies.poppins.semiBold,
  },
  description: {
    fontSize: typography.fontSizes.button,
    fontFamily: typography.fontFamilies.poppins.regular,
  },
  domain: {
    fontSize: typography.fontSizes.caption,
    fontFamily: typography.fontFamilies.poppins.medium,
  },
});

export default LinkPreviewComponent;
