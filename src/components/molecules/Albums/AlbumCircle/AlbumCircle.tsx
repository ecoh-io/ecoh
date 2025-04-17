import React from 'react';
import { View, Image, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { AlbumCircleProps } from './types';
import { getHaloColor, getGradientColors, hasHalo } from './utils';
import { styles } from './styles';
import { Visibility } from '@/src/enums/visibility.enum';

const AlbumCircle: React.FC<AlbumCircleProps> = ({
  uri,
  size = 80,
  haloSize = 4,
  visibility,
  imageStyle,
  containerStyle,
}) => {
  const shouldRenderHalo = hasHalo(visibility);
  const imageSize = shouldRenderHalo ? size - haloSize * 2 : size;

  const renderImage = () => (
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
          },
          imageStyle,
        ]}
        resizeMode="cover"
      />
      {visibility === Visibility.PRIVATE && (
        <BlurView intensity={50} tint="dark" style={styles.blurOverlay}>
          <Ionicons name="lock-closed" size={20} color="#fff" />
          <View style={styles.privateLabelWrapper}>
            <Ionicons name="lock-closed" size={14} color="#fff" />
            <Text style={styles.privateText}>Private</Text>
          </View>
        </BlurView>
      )}
    </View>
  );

  const wrapperStyle = [
    styles.outerContainer,
    {
      width: size,
      height: size,
      borderRadius: size / 2,
      padding: shouldRenderHalo ? haloSize : 0,
    },
    containerStyle,
  ];

  if (visibility === Visibility.CONNECTIONS_ONLY) {
    return (
      <LinearGradient colors={getGradientColors()} style={wrapperStyle}>
        {renderImage()}
      </LinearGradient>
    );
  }

  const backgroundColor = getHaloColor(visibility);

  return (
    <View
      style={[
        ...wrapperStyle,
        shouldRenderHalo && {
          backgroundColor,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          elevation: 3,
        },
      ]}
    >
      {renderImage()}
    </View>
  );
};

export default AlbumCircle;
