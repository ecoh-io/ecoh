export interface HeaderWithBackProps {
  title: string;
  onBackPress?: () => void;
  right?: React.ReactNode; // like a progress ring or icon
}
