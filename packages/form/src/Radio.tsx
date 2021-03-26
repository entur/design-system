import React from 'react';
import cx from 'classnames';
import { Paragraph } from '@entur/typography';
import { useRadioGroupContext } from './RadioGroupContext';
import './Radio.scss';

export type RadioProps = {
  /** Ekstra klassenavn */
  className?: string;
  /** Label til radio-button. Vises ved høyre side. */
  children?: React.ReactNode;
  /** Verdien til radioknappen */
  value: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  (
    { className, children, value, disabled, ...rest },
    ref: React.Ref<HTMLInputElement>,
  ) => {
    const classList = cx(className, 'eds-form-component--radio__radio', {
      'eds-form-component--radio__radio--disabled': disabled,
    });
    const { name, value: selectedValue, onChange } = useRadioGroupContext();
    return (
      <label className="eds-form-component--radio__container">
        <input
          type="radio"
          name={name}
          ref={ref}
          value={value}
          checked={selectedValue === value}
          onChange={onChange}
          disabled={disabled}
          {...rest}
        />
        <span className={classList}>
          <span className="eds-form-component--radio__circle"></span>
        </span>
        {children && (
          <Paragraph
            margin="none"
            as="span"
            className="eds-form-component--radio__label"
          >
            {children}
          </Paragraph>
        )}
      </label>
    );
  },
);
