import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
}

const UserNameIcon: React.FC<IconProps> = ({ size = 34, color = '#000' }) => (
  <Svg width={size} height={size} viewBox="0 0 34 34" fill="none">
    <Path
      d="M32.8334 17C32.8334 8.25545 25.7446 1.16663 17.0001 1.16663C8.25557 1.16663 1.16675 8.25545 1.16675 17C1.16675 25.7445 8.25557 32.8333 17.0001 32.8333C19.3817 32.8333 21.6405 32.3074 23.6667 31.3655M32.8334 17.4166C32.8334 19.4877 31.1545 21.1666 29.0834 21.1666C27.0123 21.1666 25.3334 19.4877 25.3334 17.4166V8.66662M25.3334 17C25.3334 21.6023 21.6024 25.3333 17.0001 25.3333C12.3977 25.3333 8.66675 21.6023 8.66675 17C8.66675 12.3976 12.3977 8.66662 17.0001 8.66662C21.6024 8.66662 25.3334 12.3976 25.3334 17Z"
      stroke={color}
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default UserNameIcon;
