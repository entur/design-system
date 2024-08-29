import React from 'react';
import classNames from 'classnames';

import { CloseSmallIcon } from '@entur/icons';
import { useRandomId, useOnMount, mergeRefs, VariantType } from '@entur/utils';

import { BaseFormControl } from './BaseFormControl';
import { useInputGroupContext } from './InputGroupContext';
import { isFilled } from './utils';
import { useVariant } from './VariantProvider';
import './TextField.scss';
import { Placement } from '@entur/tooltip';

/** @deprecated use variant="information" instead */
const info = 'info';
/** @deprecated use variant="negative" instead */
const error = 'error';

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
  /** Forklarende tekst for knappen som åpner labelTooltip */
  labelTooltipButtonAriaLabel?: string;
  /** Plasseringen til tooltip-en relativt til spørsmålstegn-knappen */
  labelTooltipPlacement?: Placement;
  /** Varselmelding, som vil komme under TextField */
  feedback?: string;
  /** Hvilken valideringsfarge som vises*/
  variant?: VariantType | typeof error | typeof info;
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
  /** Om man skal ha muliget for å nullstille TextField. Viser lukkekryss hvis feltet er fylt.
   * @default false
   */
  clearable?: boolean;
  /** Callback for clearable */
  onClear?: () => void;
  ariaAlertOnFeedback?: boolean;
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
      labelTooltipButtonAriaLabel,
      labelTooltipPlacement,
      feedback,
      onChange,
      disableLabelAnimation,
      labelProps,
      clearable = false,
      onClear,
      value,
      ariaAlertOnFeedback = false,
      ...rest
    },
    ref: React.Ref<HTMLInputElement>,
  ) => {
    const randomId = useRandomId('eds-textfield');
    const textFieldId = labelProps && labelProps.id ? labelProps.id : randomId;
    const textFieldRef = React.useRef<HTMLInputElement>(null);
    return (
      <BaseFormControl
        disabled={disabled}
        readOnly={readOnly}
        variant={variant}
        prepend={prepend}
        append={
          clearable && onClear ? <ClearButton onClear={onClear} /> : append
        }
        className={classNames(className, 'eds-textfield__wrapper')}
        style={style}
        size={size}
        label={label}
        required={required}
        labelTooltip={labelTooltip}
        labelTooltipButtonAriaLabel={labelTooltipButtonAriaLabel}
        labelTooltipPlacement={labelTooltipPlacement}
        labelId={textFieldId}
        feedback={feedback}
        disableLabelAnimation={disableLabelAnimation}
        labelProps={labelProps}
        ariaAlertOnFeedback={ariaAlertOnFeedback}
        onClick={e => {
          if (e.target === e.currentTarget) textFieldRef?.current?.focus();
        }}
      >
        <TextFieldBase
          disabled={disabled}
          readOnly={readOnly}
          ref={mergeRefs(ref, textFieldRef)}
          aria-labelledby={textFieldId}
          onChange={onChange}
          value={value}
          variant={variant}
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
  variant?: VariantType | typeof error | typeof info;
} & React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

const TextFieldBase = React.forwardRef<HTMLInputElement, TextFieldBaseProps>(
  (
    { disabled, readOnly, placeholder, onChange, value, variant, ...rest },
    forwardRef,
  ) => {
    const contextVariant = useVariant();
    const currentVariant = variant || contextVariant;
    const { isFilled: isInputFilled, setFilled: setFiller } =
      useInputGroupContext();

    useOnMount(() => {
      if (value?.toString() || rest.defaultValue) {
        setFiller && !isInputFilled && setFiller(true);
      }
    });
    React.useEffect(() => {
      if (value?.toString() && setFiller && !isInputFilled) {
        setFiller(true);
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
        ref={forwardRef}
        placeholder={placeholder}
        onChange={handleChange}
        value={value}
        {...rest}
      />
    );
  },
);

const ClearButton: React.FC<{
  onClear: () => void;
  [key: string]: any;
}> = ({ onClear, ...props }) => {
  const { isFilled: hasValue, setFilled } = useInputGroupContext();
  return (
    <div className="eds-textfield__clear-button-wrapper">
      {hasValue && <div className="eds-textfield__divider"></div>}
      {hasValue && (
        <button
          className="eds-textfield__clear-button"
          type="button"
          tabIndex={-1}
          onClick={() => {
            setFilled(false);
            onClear();
          }}
          {...props}
        >
          <CloseSmallIcon />
        </button>
      )}
    </div>
  );
};
