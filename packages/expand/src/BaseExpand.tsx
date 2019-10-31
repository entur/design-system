import React from 'react';
import { Collapse } from 'react-collapse';

type BaseExpandProps = {
  children: React.ReactNode;
  open: boolean;
  [key: string]: any;
};
export const BaseExpand: React.FC<BaseExpandProps> = ({
  children,
  open,
  ...rest
}) => {
  return (
    <Collapse isOpened={open} {...rest}>
      {children}
    </Collapse>
  );
};
