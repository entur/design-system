import React from 'react';
import classNames from 'classnames';

export type HeaderCellProps = {
  /** Kolonneoverskrift */
  children: React.ReactNode;
  /** Ekstra klassenavn */
  className?: string;
};

export const HeaderCell: React.FC<HeaderCellProps> = ({
  className,
  ...rest
}) => (
  <th className={classNames('eds-table__header-cell', className)} {...rest} />
);
