import React from 'react';

interface IconProps {
  color: string;
}

const FillIcon: React.FC<IconProps> = ({ color }) => (
  <svg
    width="32"
    height="48"
    viewBox="0 0 32 48"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="32" height="48" rx="4" ry="4" style={{ fill: color }} />
  </svg>
);

export default FillIcon;
