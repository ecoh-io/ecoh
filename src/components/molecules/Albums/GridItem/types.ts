interface PlaceholderItem {
  placeholder: true;
}

export type GridDataItem =
  | 'Add Photos'
  | PlaceholderItem
  | { uri: string; url: string };

export interface GridItemProps {
  item: GridDataItem;
  onAddPhotos?: () => void;
  onImagePress?: () => void;
  editMode: boolean;
  selected?: boolean;
  toggleSelect?: (uri: string) => void;
  colors: any;
  uploadProgress?: number;
  isUploading?: boolean;
}
