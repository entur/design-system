import React from 'react';

interface IconProps {
  color: string;
}

const StrokeIcon: React.FC<IconProps> = ({ color }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="8"
    height="40"
    viewBox="0 0 8 40"
    fill="none"
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
      <path
        d="M0 36C0 38.2091 1.79086 40 4 40C6.20914 40 8 38.2091 8 36C8 33.7909 6.20914 32 4 32C1.79086 32 0 33.7909 0 36ZM0.000976562 4C0.000976562 6.20914 1.79184 8 4.00098 8C6.21012 8 8.00098 6.20914 8.00098 4C8.00098 1.79086 6.21012 0 4.00098 0C1.79184 0 0.000976562 1.79086 0.000976562 4ZM4.75 36L4.75098 4.00002L3.25098 3.99998L3.25 36L4.75 36Z"
        fill={color}
      />
    </g>
  </svg>
);

export default StrokeIcon;
