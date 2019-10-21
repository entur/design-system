import React from 'react';
import classNames from 'classnames';

interface HeaderCellProps
  extends React.ThHTMLAttributes<HTMLTableDataCellElement> {
  /** Kolonneoverskrift */
  children: React.ReactNode;
}

export const HeaderCell: React.FC<HeaderCellProps> = ({
  className,
  ...rest
}) => (
  <th className={classNames('entur-table__header-cell', className)} {...rest} />
);
