import React from 'react';

export const useRandomId = (prefix?: string) => {
  const ref = React.useRef(String(Math.random()).substring(2));
  return `${prefix}-${ref.current}`;
};
