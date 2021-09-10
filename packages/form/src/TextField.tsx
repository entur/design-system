import { useRandomId, useOnMount } from '@entur/utils';
import React from 'react';
import { BaseFormControl } from './BaseFormControl';
import { useInputGroupContext } from './InputGroupContext';
import { useVariant, VariantType } from './VariantProvider';
import { isFilled } from './utils';

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
  labelTooltip?: React.ReactNode;
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
  /** Plasserer labelen statisk på toppen av inputfeltet
   * @default false
   */
  disableLabelAnimation?: boolean;
  /** Ekstra props som sendes til label-elementet */
  labelProps?: React.DetailedHTMLProps<
    React.LabelHTMLAttributes<HTMLLabelElement>,
    HTMLLabelElement
  >;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'label'>;

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
      onChange,
      disableLabelAnimation,
      labelProps,
      ...rest
    },
    ref: React.Ref<HTMLInputElement>,
  ) => {
    const textFieldId =
      labelProps && labelProps.id
        ? labelProps.id
        : useRandomId('eds-textfield');
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
        disableLabelAnimation={disableLabelAnimation}
        labelProps={labelProps}
      >
        <TextFieldBase
          disabled={disabled}
          readOnly={readOnly}
          ref={ref}
          aria-labelledby={textFieldId}
          onChange={onChange}
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
  variant?: VariantType;
} & React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

const TextFieldBase = React.forwardRef<HTMLInputElement, TextFieldBaseProps>(
  (
    { disabled, readOnly, placeholder, onChange, value, variant, ...rest },
    ref,
  ) => {
    const contextVariant = useVariant();
    const currentVariant = variant || contextVariant;
    const { isFilled: isInputFilled, setFilled: setFiller } =
      useInputGroupContext();

    useOnMount(() => {
      if (value || rest.defaultValue) {
        setFiller && !isInputFilled && setFiller(true);
      }
    });

    React.useEffect(() => {
      if (value) {
        setFiller && !isInputFilled && setFiller(true);
      } else {
        setFiller && isInputFilled && setFiller(false);
      }
    }, [value, setFiller, isInputFilled]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (isFilled(event.target)) {
        setFiller && !isInputFilled && setFiller(true);
      } else {
        setFiller && isInputFilled && setFiller(false);
      }
      if (onChange) {
        onChange(event);
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
        value={value}
        {...rest}
      />
    );
  },
);
