import { StyleProp, ViewStyle } from 'react-native';

// types.ts
export interface DropdownOption {
  id: string | number;
  label: string;
  [key: string]: any;
}

export interface DropdownProps {
  options: DropdownOption[];
  selected: string | number | Array<string | number> | null;
  onSelect: (value: string | number | Array<string | number>) => void;
  multiSelect?: boolean;
  renderOption?: (
    option: DropdownOption,
    isSelected: boolean,
  ) => React.ReactNode;
  placeholder?: string;
  leftIcon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}
