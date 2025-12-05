import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
}

const MailIcon: React.FC<IconProps> = ({ size = 24, color = 'black' }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 26" fill="none">
      <Path
        d="M5.8087 6.47998L7.3921 7.95943L13.7257 13.8772C15.0064 15.0725 16.9938 15.0725 18.2745 13.8772L26.209 6.47998M4.33333 24.3333H27.6667C29.5076 24.3333 31 22.8409 31 21V4.33333C31 2.49238 29.5076 1 27.6667 1H4.33333C2.49238 1 1 2.49238 1 4.33333V21C1 22.8409 2.49238 24.3333 4.33333 24.3333Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default MailIcon;
