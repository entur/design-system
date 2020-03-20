import React from 'react';
import classNames from 'classnames';

export type TableHeadProps = {
  /** Kolonneoverskrifter */
  children: React.ReactNode;
  /** Esktra klassenavn */
  className?: string;
  [key: string]: any;
};

export const TableHead: React.FC<TableHeadProps> = props => (
  <thead
    className={classNames('eds-table__head', props.className)}
    {...props}
  />
);
