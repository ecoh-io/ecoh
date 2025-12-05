import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
}

const FingerPrintIcon: React.FC<IconProps> = ({
  size = 24,
  color = 'black',
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 28" fill="none">
      <Path
        d="M1.18501 20.6666C1.06733 16.5204 1.50594 12.3488 2.86588 8.9016C4.89268 3.7641 9.77867 0.401118 15.1133 1.83054C20.448 3.25995 23.6138 8.74332 22.1844 14.078C21.3823 17.0714 20.5944 19.6635 20.891 22.8077M12.5244 11.4899C10.0244 17.3232 10.8577 22.3232 11.6914 26.4898M16.3104 24.8333C15.1782 19.3855 15.9845 16.9398 17.3432 12.8178L17.3544 12.7839C18.0691 10.1166 16.4862 7.37491 13.8188 6.6602C11.1515 5.94549 8.40982 7.5284 7.69511 10.1957C6.35476 15.5105 5.32926 18.8517 6.17125 24"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default FingerPrintIcon;
