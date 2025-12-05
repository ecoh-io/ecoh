import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
}

const IdentityIcon: React.FC<IconProps> = ({ size = 32, color = 'black' }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 30" fill="none">
      <Path
        d="M1 5.83341V25.0001C1 26.841 2.49238 28.3334 4.33333 28.3334H27.6667C29.5076 28.3334 31 26.841 31 25.0001V5.83341M1 5.83341V5.00008C1 3.15913 2.49238 1.66675 4.33333 1.66675H27.6667C29.5076 1.66675 31 3.15913 31 5.00008V5.83341M1 5.83341H31M20.1667 17.5001H25.1667M20.1667 12.5001H26.8333M5.14824 20.9702C6.28022 18.9023 8.47635 17.5001 11 17.5001C13.5236 17.5001 15.7198 18.9023 16.8518 20.9702C17.7357 22.585 16.1743 24.1667 14.3333 24.1667H7.66666C5.82572 24.1667 4.26425 22.585 5.14824 20.9702ZM13.5 12.5001C13.5 13.8808 12.3807 15.0001 11 15.0001C9.61928 15.0001 8.5 13.8808 8.5 12.5001C8.5 11.1194 9.61928 10.0001 11 10.0001C12.3807 10.0001 13.5 11.1194 13.5 12.5001Z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default IdentityIcon;
