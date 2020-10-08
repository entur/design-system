import { useRandomId } from '@entur/utils';
import React from 'react';
import { BaseFormControl } from './BaseFormControl';
import { useInputGroupContext } from './InputGroupContext';
import { isFilled } from './utils';
import { useVariant, VariantType } from './VariantProvider';

export type TextFieldProps = {
  /** Tekst eller ikon som kommer før inputfeltet */
  prepend?: React.ReactNode;
  /** Tekst eller ikon som kommer etter inputfeltet */
  append?: React.ReactNode;
  /** Ekstra klassenavn */
  className?: string;
  /** Label over TextField */
  label: React.ReactNode;
  /** En tooltip som forklarer labelen til inputfeltet */
  labelTooltip: React.ReactNode;
  /** Varselmelding, som vil komme under TextField */
  feedback?: string;
  /** Hvilken valideringsfarge som vises */
  variant?: VariantType;
  /** Deaktiver inputfeltet */
  disabled?: boolean;
  /** Setter inputfeltet i read-only modus */
  readOnly?: boolean;
  /** Størrelsen på TextField
   * @default "medium"
   */
  size?: 'medium' | 'large';
  [key: string]: any;
};

export const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      prepend,
      append,
      variant,
      disabled = false,
      readOnly = false,
      className,
      style,
      size = 'medium',
      label,
      required,
      labelTooltip,
      feedback,
      ...rest
    },
    ref: React.Ref<HTMLInputElement>,
  ) => {
    const textFieldId = useRandomId('eds-textfield');
    return (
      <BaseFormControl
        disabled={disabled}
        readOnly={readOnly}
        variant={variant}
        prepend={prepend}
        append={append}
        className={className}
        style={style}
        size={size}
        label={label}
        required={required}
        labelTooltip={labelTooltip}
        labelId={textFieldId}
        feedback={feedback}
      >
        <TextFieldBase
          disabled={disabled}
          readOnly={readOnly}
          ref={ref}
          aria-labelledby={textFieldId}
          {...rest}
        />
      </BaseFormControl>
    );
  },
);

type TextFieldBaseProps = {
  /** Deaktiver inputfeltet */
  disabled?: boolean;
  /** Setter inputfeltet i read-only modus */
  readOnly?: boolean;
  [key: string]: any;
};

const TextFieldBase = React.forwardRef<HTMLInputElement, TextFieldBaseProps>(
  ({ disabled, readOnly, placeholder, onChange, ...rest }, ref) => {
    const contextVariant = useVariant();
    const currentVariant = rest.variant || contextVariant;
    const {
      isFilled: isInputFilled,
      setFilled: setFiller,
    } = useInputGroupContext();

    React.useEffect(() => {
      // Check if filled on first render
      if (rest.value) {
        setFiller && !isInputFilled && setFiller(true);
      }
    }, []);

    const handleChange = (event: any) => {
      if (isFilled(event.target)) {
        setFiller && !isInputFilled && setFiller(true);
      } else {
        setFiller && isInputFilled && setFiller(false);
      }
      if (rest.onChange) {
        rest.onChange(event);
      }
    };

    return (
      <input
        aria-invalid={currentVariant === 'error'}
        className="eds-form-control"
        disabled={disabled}
        readOnly={readOnly}
        ref={ref}
        placeholder={placeholder}
        onChange={handleChange}
        {...rest}
      />
    );
  },
);
