export interface SegmentedToggleProps {
  options: string[];
  activeIndex: number;
  onChange: (index: number) => void;
}
