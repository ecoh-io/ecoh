import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
  Share,
  LayoutChangeEvent,
} from 'react-native';
import { useTheme } from '@/src/theme/ThemeContext';
import { styles } from './styles';
import { LinkPreviewProps } from './types';

const LinkPreview: React.FC<LinkPreviewProps> = ({ preview }) => {
  const { title, description, image, url } = preview;
  const { colors } = useTheme();

  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);

  const imageHeight = containerWidth ? containerWidth * 0.55 : 200;

  const handlePress = () => {
    Linking.openURL(url).catch((err) =>
      console.error("Couldn't open URL", err),
    );
  };

  const handleShare = () => {
    Share.share({
      message: `${title ? title + '\n' : ''}${url}`,
      url,
      title: title || 'Check out this link!',
    }).catch((error) => console.error('Error sharing link:', error));
  };

  const getDomain = (link: string) => {
    try {
      return new URL(link).hostname.replace('www.', '');
    } catch {
      return '';
    }
  };

  const onContainerLayout = (event: LayoutChangeEvent) => {
    setContainerWidth(event.nativeEvent.layout.width);
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[
        styles.container,
        { backgroundColor: colors.background, borderColor: colors.secondary },
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

export default LinkPreview;
