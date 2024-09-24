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
  'aria-describedby'?: string;
};
export const PaginationPage: React.FC<PaginationPageProps> = ({
  children,
  className,
  selected,
  disabled,
  onClick,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedby,
}) => (
  <button
    className={classNames(
      'eds-pagination__controls__page',
      { 'eds-pagination__controls__page--selected': selected },
      { 'eds-pagination__controls__page--disabled': disabled },
      className,
    )}
    disabled={selected || disabled}
    type="button"
    onClick={onClick}
    aria-label={ariaLabel}
    aria-describedby={ariaDescribedby}
    aria-current={selected ? 'page' : false}
  >
    {children}
  </button>
);
