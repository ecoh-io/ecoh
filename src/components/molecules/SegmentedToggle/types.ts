export interface SegmentedToggleProps {
  options: Array<{
    label: string;
    icon?: React.ReactNode;
  }>;
  activeIndex: number;
  onChange: (index: number) => void;
}
