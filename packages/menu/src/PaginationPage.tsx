import React from 'react';
import classNames from 'classnames';

export type PaginationPageProps = {
  /** sidenummeret som er aktivt nå */
  children: React.ReactNode;
  /** Ekstra klassenavn */
  className?: string;
  /** Viser siden som aktiv */
  selected?: boolean;
  /** Callback for når man trykker på siden */
  onClick: () => void;
  /** Tekst for skjermlesere */
  'aria-label': string;
};
export const PaginationPage: React.FC<PaginationPageProps> = ({
  children,
  className,
  selected,
  onClick,
  'aria-label': ariaLabel,
}) => (
  <button
    className={classNames(
      'eds-pagination__page',
      { 'eds-pagination__page--selected': selected },
      className,
    )}
    disabled={selected}
    type="button"
    onClick={onClick}
    aria-label={ariaLabel}
    aria-current={selected ? 'page' : false}
  >
    {children}
  </button>
);
