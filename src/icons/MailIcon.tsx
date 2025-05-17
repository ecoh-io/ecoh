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
        d="M2.12848 2.16665L11.5768 11.9789M30.1667 2.4618L20.5333 11.9789M2.12848 23.8333C2.71609 24.3519 3.48796 24.6666 4.33333 24.6666H27.6667C28.6622 24.6666 29.5559 24.2302 30.1667 23.5382M2.12848 23.8333C1.43646 23.2225 1 22.3289 1 21.3333V4.66665C1 2.8257 2.49238 1.33332 4.33333 1.33332H27.6667C29.5076 1.33332 31 2.8257 31 4.66665V21.3333C31 22.1787 30.6853 22.9506 30.1667 23.5382M2.12848 23.8333L11.5768 11.9789M11.5768 11.9789L13.7257 14.2105C15.0064 15.4058 16.9938 15.4058 18.2745 14.2105L20.5333 11.9789M20.5333 11.9789L30.1667 23.5382"
        stroke={color}
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default MailIcon;
