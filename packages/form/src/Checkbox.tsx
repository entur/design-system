import React from 'react';
import { CheckIcon } from '@entur/icons';
import { Label } from '@entur/typography';
import cx from 'classnames';
import './Checkbox.scss';

type CheckboxProps = {
  /** Klasse som sendes til komponenten. Bruk denne om du vil endre style */
  className?: string;
  /** Label for checkboxen, som vises ved høyre side. */
  label?: string;
  [key: string]: any;
};

export const Checkbox: React.RefForwardingComponent<
  HTMLInputElement,
  CheckboxProps
> = React.forwardRef(
  ({ className, width, label, ...rest }, ref: React.Ref<HTMLInputElement>) => {
    return (
      <label
        className={cx('entur-form-component--checkbox__container', className)}
      >
        <input type="checkbox" ref={ref} {...rest} />
        <span className="entur-form-component--checkbox__icon">
          <CheckIcon />
        </span>
        {label && <Label as="span">{label}</Label>}
      </label>
    );
  },
);
