import { LayoutChangeEvent } from 'react-native';

export interface LinkPreviewProps {
  preview: {
    title?: string;
    description?: string;
    image?: string;
    url: string;
  };
}
