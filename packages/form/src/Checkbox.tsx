import React from 'react';
import { CheckIcon } from '@entur/icons';
import cx from 'classnames';
import './Checkbox.scss';

type CheckboxProps = {
  /** Klasse som sendes til komponenten. Bruk denne om du vil endre style */
  className?: string;
  /** Settes til 'fluid' for flytende textarea */
  width?: 'fluid';

  /** For å deaktivere inputfeltet */
  disabled?: boolean;
  [key: string]: any;
};

export const Checkbox: React.RefForwardingComponent<
  HTMLInputElement,
  CheckboxProps
> = React.forwardRef(
  (
    { className, width, disabled = false, ...rest },
    ref: React.Ref<HTMLInputElement>,
  ) => {
    return (
      <label className={cx('entur-form-component--checkbox__container')}>
        <input type="checkbox" ref={ref} {...rest} />
        <span className="entur-form-component--checkbox__icon">
          <CheckIcon />
        </span>
      </label>
    );
  },
);
