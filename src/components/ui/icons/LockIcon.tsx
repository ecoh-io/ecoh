import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
}

const LockIcon: React.FC<IconProps> = ({ size = 32, color = 'black' }) => {
  return (
    <Svg width={(size / 30) * 20} height={size} viewBox="0 0 20 30" fill="none">
      <Path
        d="M3.33341 15V8.33329C3.33341 4.65139 6.31818 1.66663 10.0001 1.66663C13.682 1.66663 16.6667 4.65139 16.6667 8.33329V15M18.3334 20C18.3334 24.6023 14.6024 28.3333 10.0001 28.3333C5.39771 28.3333 1.66675 24.6023 1.66675 20C1.66675 15.3976 5.39771 11.6666 10.0001 11.6666C14.6024 11.6666 18.3334 15.3976 18.3334 20ZM13.3334 20C13.3334 21.8409 11.841 23.3333 10.0001 23.3333C8.15913 23.3333 6.66675 21.8409 6.66675 20C6.66675 18.159 8.15913 16.6666 10.0001 16.6666C11.841 16.6666 13.3334 18.159 13.3334 20Z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default LockIcon;
