import React from 'react';

interface IconProps {
  color: string;
}

const ShapeIcon: React.FC<IconProps> = ({ color }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="28"
    height="28"
    viewBox="0 0 28 28"
    fill="none"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M9.68597 9.21729L3.03213 9.21748L2.84951 9.22968C1.84508 9.36603 1.37177 10.6146 2.10868 11.3828L7.09938 16.5877L5.05876 24.6511L5.02566 24.8317C4.91118 25.8418 6.01207 26.6071 6.93762 26.0742L13.9982 22.0077L21.0624 26.0742L21.2272 26.155C22.1686 26.5388 23.2035 25.6864 22.9412 24.6511L20.8988 16.5877L25.8913 11.3828L26.0089 11.2426C26.6058 10.4233 26.0324 9.21748 24.9679 9.21748L18.3122 9.21729L15.1586 2.48649C14.6983 1.5045 13.3017 1.5045 12.8414 2.48649L9.68597 9.21729Z"
      fill={color}
    />
  </svg>
);

export default ShapeIcon;
