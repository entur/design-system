import React from 'react';
import { Collapse } from 'react-collapse';

type BaseExpandProps = {
  /** Innholdet som skal være expandable */
  children: React.ReactNode;
  /** Boolean for om innholdet vises eller ikke */
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
