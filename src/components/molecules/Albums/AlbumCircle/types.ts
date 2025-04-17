import { ImageStyle, ViewStyle } from 'react-native';
import { Visibility } from '@/src/enums/visibility.enum';

export interface AlbumCircleProps {
  uri: string;
  size?: number;
  haloSize?: number;
  visibility: Visibility;
  imageStyle?: ImageStyle;
  containerStyle?: ViewStyle;
}
