import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface IconProps {
  width?: number;
  height?: number;
  color?: string;
}

const DropDownArrow: React.FC<IconProps> = ({
  width = 16,
  height = 10,
  color = 'black',
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 16 10" fill="none">
      <Path
        d="M14.6667 1.66667L8.00008 8.33334L1.33342 1.66667"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default DropDownArrow;
