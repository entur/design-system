import React from 'react';
import classNames from 'classnames';
import { VisuallyHidden } from '@entur/a11y';
import './InlineSpinner.scss';

export type InlineSpinnerType = {
  /** Ekstra klassenavn */
  className?: string;
  /** Tekst for skjermlesere */
  children: string;
};
export const InlineSpinner: React.FC<InlineSpinnerType> = ({
  className,
  children,
  ...rest
}) => (
  <div className={classNames('eds-inline-spinner', classNames)} {...rest}>
    <span className="eds-inline-spinner__twirly-part" />
    <VisuallyHidden>{children}</VisuallyHidden>
  </div>
);
