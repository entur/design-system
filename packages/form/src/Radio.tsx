import React from 'react';
import cx from 'classnames';
import { Label } from '@entur/typography';
import { useRadioGroupContext } from './RadioGroupContext';
import './Radio.scss';

type RadioProps = {
  /** Klasse som sendes til komponenten. Bruk denne om du vil endre styling */
  className?: string;
  /** Label til radio-button. Vises ved høyre side. */
  children?: React.ReactNode;
  /** Verdien til radioknappen */
  value: string;
  [key: string]: any;
};

export const Radio: React.RefForwardingComponent<
  HTMLInputElement,
  RadioProps
> = React.forwardRef(
  (
    { className, children, value, ...rest },
    ref: React.Ref<HTMLInputElement>,
  ) => {
    const classList = cx(className, 'entur-form-component--radio__radio');
    const { name, value: selectedValue, onChange } = useRadioGroupContext();
    return (
      <label className="entur-form-component--radio__container">
        <input
          type="radio"
          name={name}
          ref={ref}
          value={value}
          checked={selectedValue === value}
          onChange={onChange}
          {...rest}
        />
        <span className={classList}>
          <span className="entur-form-component--radio__circle"></span>
        </span>
        {children && <Label as="span">{children}</Label>}
      </label>
    );
  },
);
