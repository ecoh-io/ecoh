import Button from '@/src/UI/Button';

interface FooterProps {
  onPress: () => void;
  isDisabled: boolean;
}

export default function Footer({ onPress, isDisabled }: FooterProps) {
  return (
    <Button
      variant="primary"
      gradientColors={['#00c6ff', '#0072ff']}
      onPress={onPress}
      disabled={isDisabled}
      title="Continue"
      size="large"
      style={{ marginBottom: 16 }}
    />
  );
}
