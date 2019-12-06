import React from 'react';
import { CheckIcon } from '@entur/icons';
import { Label } from '@entur/typography';
import cx from 'classnames';
import './Checkbox.scss';

export type CheckboxProps = {
  /** Ekstra klassenavn */
  className?: string;
  /** Label for checkboxen, som vises ved høyre side. */
  children?: React.ReactNode;
  [key: string]: any;
};

export const Checkbox: React.RefForwardingComponent<
  HTMLInputElement,
  CheckboxProps
> = React.forwardRef(
  (
    { className, width, children, ...rest },
    ref: React.Ref<HTMLInputElement>,
  ) => {
    return (
      <label
        className={cx('eds-form-component--checkbox__container', className)}
      >
        <input type="checkbox" ref={ref} {...rest} />
        <span className="eds-form-component--checkbox__icon">
          <CheckIcon />
        </span>
        {children && <Label as="span">{children}</Label>}
      </label>
    );
  },
);
