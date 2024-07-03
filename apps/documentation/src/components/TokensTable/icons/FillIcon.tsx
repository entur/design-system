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
    <defs>
      <filter id="inset-shadow" x="-50%" y="-50%" width="200%" height="200%">
        <feComponentTransfer in="SourceAlpha">
          <feFuncA type="table" tableValues="1 0" />
        </feComponentTransfer>
        <feGaussianBlur stdDeviation="2" />
        <feOffset dx="0" dy="2" result="offsetblur" />
        <feFlood floodColor="rgba(0,0,0,0.2)" />
        <feComposite in2="offsetblur" operator="in" />
        <feComposite in2="SourceAlpha" operator="in" />
        <feMerge>
          <feMergeNode in="SourceGraphic" />
          <feMergeNode />
        </feMerge>
      </filter>
    </defs>
    <g filter="url(#inset-shadow)">
      <rect width="32" height="48" rx="4" ry="4" fill={color} />
    </g>
  </svg>
);

export default FillIcon;
