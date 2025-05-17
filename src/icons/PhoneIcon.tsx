import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
}

const PhoneIcon: React.FC<IconProps> = ({ size = 32, color = '#000' }) => (
  <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10.1777 21.8229C22.2374 33.8824 25.7711 30.9964 27.3494 29.8691C27.6044 29.7242 33.4459 25.9602 29.813 22.3281C21.3871 13.9016 23.0968 24.8544 15.1199 16.879C7.14466 8.90189 18.0983 10.6128 9.67251 2.18713C6.0393 -1.44603 2.27492 4.39576 2.13175 4.64921C1.00277 6.22751 -1.88192 9.76336 10.1777 21.8229Z"
      stroke={color}
      strokeWidth="3"
      stroke-inecap="round"
      stroke-linejoin="round"
    />
  </Svg>
);

export default PhoneIcon;
