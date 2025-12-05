import { Colors } from '@/src/shared/types/color';
import { ILocation } from '@/src/shared/interfaces/location';

export interface LocationSearchProps {
  onSelect: (item: ILocation) => void;
  colors: Colors;
  selectedLocation?: ILocation | null;
  onSearchStart: () => void;
}
