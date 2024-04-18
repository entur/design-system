import React from 'react';

interface IconProps {
  color: string;
}

const TextIcon: React.FC<IconProps> = ({ color }) => (
  <svg
    width="23"
    height="29"
    viewBox="0 0 23 29"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M14.2 5.32V29H8.84V5.32H0.32V0.68H22.76V5.32H14.2Z" fill={color} />
  </svg>
);

export default TextIcon;
