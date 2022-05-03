import React from 'react';
import classNames from 'classnames';

export type PaginationPageProps = {
  /** Sidenummeret som er aktivt nå */
  children: React.ReactNode;
  /** Ekstra klassenavn */
  className?: string;
  /** Viser siden som aktiv */
  selected?: boolean;
  /** Viser knappen som inaktiv */
  disabled?: boolean;
  /** Callback for når man trykker på siden */
  onClick: () => void;
  /** Tekst for skjermlesere */
  'aria-label': string;
};
export const PaginationPage: React.FC<PaginationPageProps> = ({
  children,
  className,
  selected,
  disabled,
  onClick,
  'aria-label': ariaLabel,
}) => (
  <button
    className={classNames(
      'eds-pagination__page',
      { 'eds-pagination__page--selected': selected },
      { 'eds-pagination__page--disabled': disabled },
      className,
    )}
    disabled={selected || disabled}
    type="button"
    onClick={onClick}
    aria-label={ariaLabel}
    aria-current={selected ? 'page' : false}
  >
    {children}
  </button>
);
