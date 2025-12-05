import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
}

const SwitchArrowsIcon: React.FC<IconProps> = ({
  size = 26,
  color = 'black',
}) => {
  return (
    <Svg width={size * (22 / 26)} height={size} viewBox="0 0 22 26" fill="none">
      <Path
        d="M1 6.33334L21 6.33334M21 6.33334L16 1.33334M21 6.33334L16 11.3333M21 19.6667H1M1 19.6667L6 14.6667M1 19.6667L6 24.6667"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default SwitchArrowsIcon;
