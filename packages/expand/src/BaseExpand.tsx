import React from 'react';

import { UnmountClosed } from 'react-collapse';

import './BaseExpand.scss';

type BaseExpandProps = {
  /** Innholdet som skal være expandable */
  children: React.ReactNode;
  /** Boolean for om innholdet vises eller ikke */
  open: boolean;
  [key: string]: any;
};
export const BaseExpand: React.FC<BaseExpandProps> = ({ open, ...rest }) => {
  return (
    <UnmountClosed isOpened={open}>
      <div {...rest} />
    </UnmountClosed>
  );
};
