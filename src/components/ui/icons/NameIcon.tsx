import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
}

const NameIcon: React.FC<IconProps> = ({ size = 32, color = '#000' }) => (
  <Svg width={size * 0.875} height={size} viewBox="0 0 28 32" fill="none">
    <Path
      d="M13.9995 18.5C8.23646 18.5 3.38431 22.4 1.93841 27.7048C1.45429 29.481 2.99191 31 4.83286 31H23.1662C25.0071 31 26.5448 29.481 26.0606 27.7048C24.6147 22.4 19.7626 18.5 13.9995 18.5Z"
      stroke={color}
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M19.8329 7.66664C19.8329 10.8883 17.2212 13.5 13.9995 13.5C10.7779 13.5 8.16619 10.8883 8.16619 7.66664C8.16619 4.44498 10.7779 1.83331 13.9995 1.83331C17.2212 1.83331 19.8329 4.44498 19.8329 7.66664Z"
      stroke={color}
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default NameIcon;
