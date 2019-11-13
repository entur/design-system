import React from 'react';

type Props = {
  children: React.FC;
};
const InlineComponent: React.FC<Props> = ({ children }) => {
  return React.createElement(children);
};

export default InlineComponent;
