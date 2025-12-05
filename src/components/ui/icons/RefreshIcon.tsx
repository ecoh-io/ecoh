import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
}

const RefreshArrowIcon: React.FC<IconProps> = ({
  size = 34,
  color = 'black',
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 34 34" fill="none">
      <Path
        d="M28.5471 6.16667C25.6587 3.08911 21.5539 1.16667 17.0001 1.16667C8.25557 1.16667 1.16675 8.25549 1.16675 17C1.16675 25.7445 8.25557 32.8333 17.0001 32.8333C21.5539 32.8333 25.6587 30.9109 28.5471 27.8333M26.4283 10.8562L32.523 10.8562L32.523 4.76145"
        stroke={color}
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default RefreshArrowIcon;
