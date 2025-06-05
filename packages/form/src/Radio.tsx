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
  /** Om radiobutton er disabled eller ikke
   * @default false
   */
  disabled?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>;

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  (
    { className, children, value, disabled, ...rest },
    ref: React.Ref<HTMLInputElement>,
  ) => {
    const {
      name,
      value: selectedValue,
      onChange,
      readOnly,
    } = useRadioGroupContext();

    const classList = cx(className, 'eds-form-component--radio__radio', {
      'eds-form-component--radio__radio--disabled': disabled,
      'eds-form-component--radio__radio--readonly': readOnly,
    });

    return (
      <label className="eds-form-component--radio__container">
        <input
          type="radio"
          name={rest.name ?? name}
          ref={ref}
          value={value}
          checked={
            readOnly
              ? selectedValue === value
              : rest.checked ?? selectedValue === value
          }
          onChange={e => {
            if (readOnly) {
              e.preventDefault();
              return;
            }
            (rest.onChange ?? onChange)?.(e);
          }}
          onClick={e => {
            if (readOnly) {
              e.preventDefault();
            }
          }}
          tabIndex={rest.tabIndex}
          role="radio"
          disabled={disabled}
          aria-label={
            readOnly ? ` ${children?.toString()}. Kan ikke endres` : undefined
          }
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
