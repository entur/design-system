import React from 'react';
import classNames from 'classnames';
import { TypographySpacingProps } from '../types';
import { getSpacingStyle } from '../utils/utils';

import './text.scss';

/**
 * @beta Experimental component - may have breaking changes in future releases
 */
export type LabelOwnProps = TypographySpacingProps & {
  /** Ekstra klassenavn */
  className?: string;
  /** Innholdet */
  children?: React.ReactNode;
};

export type LabelProps = LabelOwnProps &
  Omit<React.LabelHTMLAttributes<HTMLLabelElement>, keyof LabelOwnProps>;

/**
 * Ledetekst for et skjemafelt, koblet til feltet med `htmlFor` eller ved å ligge rundt det
 * @beta Experimental component - may have breaking changes in future releases
 */
export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, spacing, style, children, ...rest }, ref) => (
    <label
      ref={ref}
      className={classNames('eds-text', 'eds-text--label', className)}
      style={getSpacingStyle(spacing, style)}
      {...rest}
    >
      {children}
    </label>
  ),
);
Label.displayName = 'Label';
