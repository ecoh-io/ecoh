import React, { memo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { Image } from 'expo-image';
import Animated, { LinearTransition } from 'react-native-reanimated';
import { styles } from './styles';
import { itemWidth, itemHeight } from '@/app/(app)/album/[albumId]';
import { GridItemProps } from './types';
import AnimatedWrapper from '@/src/animation/AnimatedWrapper';
import { CircularProgressIndicator } from '@/src/components/atoms';

const GridItem: React.FC<GridItemProps> = ({
  item,
  onAddPhotos,
  onImagePress,
  editMode,
  selected = false,
  toggleSelect,
  colors,
  uploadProgress = 0,
  isUploading = false,
}) => {
  const commonStyle = {
    width: itemWidth,
    height: itemHeight,
    margin: 8,
    marginLeft: 0,
  };

  if (item === 'Add Photos') {
    return (
      <TouchableOpacity
        onPress={onAddPhotos}
        style={[
          styles.addPhotosButton,
          commonStyle,
          {
            backgroundColor: colors.card,
            borderColor: colors.secondary,
          },
        ]}
      >
        <Entypo name="plus" size={32} color={colors.secondary} />
        <Text style={[styles.addPhotosText, { color: colors.secondary }]}>
          Add Photos
        </Text>
      </TouchableOpacity>
    );
  }

  if ('placeholder' in item && item.placeholder) {
    return (
      <View
        style={[
          styles.placeholderCell,
          commonStyle,
          { borderColor: colors.secondary },
        ]}
      >
        <Entypo name="plus" size={24} color={colors.secondary} />
      </View>
    );
  }

  const handlePress = () => {
    if (editMode && toggleSelect) {
      toggleSelect(item.uri);
    } else {
      onImagePress?.();
    }
  };

  return (
    <Animated.View style={commonStyle} layout={LinearTransition.springify()}>
      <AnimatedWrapper animation="scale-in">
        <TouchableOpacity onPress={handlePress} activeOpacity={0.85}>
          <Image
            source={{ uri: item.url }}
            style={[styles.image, commonStyle]}
            contentFit="cover"
          />

          {isUploading && (
            <View style={styles.progressOverlay}>
              <CircularProgressIndicator
                size={60}
                strokeWidth={4}
                progress={uploadProgress}
                gradientColors={[colors.gradient[0], colors.gradient[1]]}
              />
            </View>
          )}

          {editMode && (
            <View
              style={[styles.editOverlay, selected && styles.selectedOverlay]}
            >
              {selected && <Entypo name="check" size={30} color="white" />}
            </View>
          )}
        </TouchableOpacity>
      </AnimatedWrapper>
    </Animated.View>
  );
};

export default memo(GridItem);
