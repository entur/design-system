import React from 'react';
import cx from 'classnames';
import { Label } from '@entur/typography';
import './Radio.scss';
type RadioProps = {
  /** Klasse som sendes til komponenten. Bruk denne om du vil endre style */
  className?: string;

  /** For å deaktivere inputfeltet */
  disabled?: boolean;
  [key: string]: any;
};

export const Radio: React.RefForwardingComponent<
  HTMLInputElement,
  RadioProps
> = React.forwardRef(
  (
    { className, disabled = false, ...rest },
    ref: React.Ref<HTMLInputElement>,
  ) => {
    const classList = cx(className, 'entur-form-component--radio__radio', {
      [`entur-form-component--disabled`]: disabled,
    });
    return (
      <label className="entur-form-component--radio__container">
        <input type="radio" disabled={disabled} ref={ref} {...rest} />
        <span className={classList}>
          <span className="entur-form-component--radio__circle"></span>
        </span>
      </label>
    );
  },
);

type RadioLabelProps = {
  /** Children blir labelteksten */
  children: React.ReactNode;
  [key: string]: any;
};

export const RadioLabel: React.FC<RadioLabelProps> = ({
  children,
  ...rest
}) => {
  return (
    <Label {...rest} className="entur-form-component--radio--label">
      {children}
    </Label>
  );
};
