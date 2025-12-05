import { ImageStyle, ViewStyle } from 'react-native';
import { Visibility } from '@/src/shared/enums/visibility.enum';

export interface AlbumCircleProps {
  uri: string;
  size?: number;
  haloSize?: number;
  visibility: Visibility;
  imageStyle?: ImageStyle;
  containerStyle?: ViewStyle;
}
