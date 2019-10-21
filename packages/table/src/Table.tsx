import React from 'react';
import classNames from 'classnames';

interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  /** Setter kolonne-layout til å være uavhengig av innhold */
  fixed?: boolean;
  /** Innholdet i tabellen */
  children: React.ReactNode;
}
export const Table: React.FC<TableProps> = ({ className, fixed, ...rest }) => (
  <table
    className={classNames(
      'entur-table',
      { 'entur-table--fixed': fixed },
      className,
    )}
    {...rest}
  />
);
