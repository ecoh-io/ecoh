import React, { memo } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { typography } from '@/src/theme/typography';
import { itemHeight, itemWidth } from '@/app/(app)/album/[albumId]';
import { AnimatedWrapper } from '../Animations/Animations';
import Animated, { Easing, LinearTransition } from 'react-native-reanimated';

interface PlaceholderItem {
  placeholder: true;
}

export type GridDataItem = 'Add Photos' | PlaceholderItem | { uri: string };

interface GridItemProps {
  item: GridDataItem;
  onAddPhotos?: () => void;
  onImagePress?: () => void;
  editMode: boolean;
  selected?: boolean;
  toggleSelect?: (uri: string) => void;
  colors: any;
}

const GridItem: React.FC<GridItemProps> = ({
  item,
  onAddPhotos,
  onImagePress,
  editMode,
  selected = false,
  toggleSelect,
  colors,
}) => {
  const animatedStyle = {
    width: itemWidth,
    height: itemHeight,
    margin: 8,
    marginLeft: 0,
  };
  // "Add Photos" cell
  if (item === 'Add Photos') {
    return (
      <TouchableOpacity
        onPress={onAddPhotos}
        style={[
          styles.addPhotosButton,
          {
            width: itemWidth,
            height: itemHeight,
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

  // Placeholder cell
  if ('placeholder' in item && item.placeholder) {
    return (
      <View
        style={[
          styles.placeholderCell,
          {
            width: itemWidth,
            height: itemHeight,
            borderColor: colors.secondary,
          },
        ]}
      >
        <Entypo name="plus" size={24} color={colors.secondary} />
      </View>
    );
  }

  // Actual media item cell
  const handlePress = () => {
    if (editMode && toggleSelect) {
      toggleSelect(item.uri);
    } else if (onImagePress) {
      onImagePress();
    }
  };

  return (
    <Animated.View style={animatedStyle} layout={LinearTransition.springify()}>
      <AnimatedWrapper animation="scale-in">
        <TouchableOpacity
          onPress={handlePress}
          style={{
            width: itemWidth,
            height: itemHeight,
            marginRight: 8,
          }}
        >
          <Image
            source={{ uri: item.uri }}
            style={[styles.image, { width: itemWidth, height: itemHeight }]}
            resizeMode="cover"
          />
          {editMode && (
            <View style={[styles.overlay, selected && styles.selectedOverlay]}>
              {selected && <Entypo name="check" size={30} color="white" />}
            </View>
          )}
        </TouchableOpacity>
      </AnimatedWrapper>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  addPhotosButton: {
    margin: 8,
    marginLeft: 0,
    borderRadius: 16,
    borderWidth: 1,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addPhotosText: {
    marginTop: 8,
    fontSize: 16,
    fontFamily: typography.fontFamilies.poppins.regular,
  },
  placeholderCell: {
    margin: 8,
    marginLeft: 0,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    borderRadius: 16,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
  },
  selectedOverlay: {
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
});

export default memo(GridItem);
