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
  [key: string]: any;
};

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  (
    { className, children, value, ...rest },
    ref: React.Ref<HTMLInputElement>,
  ) => {
    const classList = cx(className, 'eds-form-component--radio__radio');
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
          {...rest}
        />
        <span className={classList}>
          <span className="eds-form-component--radio__circle"></span>
        </span>
        {children && (
          <Paragraph margin="none" as="span">
            {children}
          </Paragraph>
        )}
      </label>
    );
  },
);
