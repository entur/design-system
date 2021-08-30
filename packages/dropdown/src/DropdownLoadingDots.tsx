import React from 'react';
import classNames from 'classnames';
import { VisuallyHidden } from '@entur/a11y';
import { LoadingDots } from '@entur/loader';
import './InlineSpinner.scss';

export type InlineSpinnerType = {
  /** Ekstra klassenavn */
  className?: string;
  /** Tekst for skjermlesere */
  children: string;
  [key: string]: any;
};
export const DropdownLoadingDots: React.FC<InlineSpinnerType> = ({
  className,
  children,
  ...rest
}) => (
  <div className={classNames('eds-inline-spinner', className)} {...rest}>
    <LoadingDots />
    <VisuallyHidden>{children}</VisuallyHidden>
  </div>
);
