import React from 'react';
import cx from 'classnames';
import { Label, Heading4 } from '@entur/typography';
import './Radio.scss';
type RadioProps = {
  /** Klasse som sendes til komponenten. Bruk denne om du vil endre styling */
  className?: string;
  /** Label til radio-button. Vises ved høyre side. */
  label?: string;
  /** Verdien til radioknappen */
  value: string;
  [key: string]: any;
};

export const Radio: React.RefForwardingComponent<
  HTMLInputElement,
  RadioProps
> = React.forwardRef(
  ({ className, label, value, ...rest }, ref: React.Ref<HTMLInputElement>) => {
    const classList = cx(className, 'entur-form-component--radio__radio');
    const { name, value: selectedValue } = useRadioGroupContext();
    return (
      <label className="entur-form-component--radio__container">
        <input
          type="radio"
          name={name}
          ref={ref}
          value={value}
          checked={selectedValue === value}
          {...rest}
        />
        <span className={classList}>
          <span className="entur-form-component--radio__circle"></span>
        </span>
        {label && <Label as="span">{label}</Label>}
      </label>
    );
  },
);

type RadioGroupContextProps = {
  name: string;
  value: string;
  [key: string]: any;
};

const RadioGroupContext = React.createContext<RadioGroupContextProps | null>(
  null,
);

function useRadioGroupContext() {
  const context = React.useContext(RadioGroupContext);
  if (!context) {
    throw new Error(
      'You need to wrap your RadioButtons in a RadioGroup component',
    );
  }
  return context;
}

type RadioGroupProps = {
  /**  */
  name: string;
  /** Overskrift over radiogruppen */
  label?: string;
  /** Verdien til den valgte radioknappen */
  value: string;
  /** Innholdet av Radiogruppen (Radioknapper) */
  children: React.ReactNode;
  /** En callback som blir kalles hver gang en radioknapp klikkes på  */
  onChange: (e: React.ChangeEvent<any>) => void;
  [key: string]: any;
};

export const RadioGroup: React.FC<RadioGroupProps> = ({
  name,
  value,
  label,
  children,
  ...rest
}) => {
  return (
    <RadioGroupContext.Provider value={{ name, value }}>
      <fieldset className="entur-radio-group" {...rest}>
        {label && (
          <Heading4 as="legend" className="entur-radio-group__label">
            {label}
          </Heading4>
        )}
        {children}
      </fieldset>
    </RadioGroupContext.Provider>
  );
};
