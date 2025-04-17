import { Colors } from '@/src/types/color';
import { ILocation } from '@/src/interfaces/location';

export interface LocationSearchProps {
  onSelect: (item: ILocation) => void;
  colors: Colors;
  selectedLocation?: ILocation | null;
  onSearchStart: () => void;
}
