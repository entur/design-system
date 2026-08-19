import React, { useId } from 'react';
import classNames from 'classnames';

import { IconButton } from '@entur/button';
import { CloseSmallIcon } from '@entur/icons';
import { Placement } from '@entur/tooltip';
import { VariantType, mergeRefs } from '@entur/utils';

import { BaseFormControl, FeedbackAnnouncementProps } from './BaseFormControl';
import { useInputGroupContext } from './InputGroupContext';
import { isFilled } from './utils';
import { useVariant } from './VariantProvider';
import './TextField.scss';

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
  /** Aria-label for clear button
   * @default "Tøm felt"
   */
  clearButtonAriaLabel?: string;
} & FeedbackAnnouncementProps &
  Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'label'>;

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
      clearButtonAriaLabel = 'Tøm felt',
      value,
      ariaAlertOnFeedback,
      feedbackProps,
      ...rest
    },
    ref: React.Ref<HTMLInputElement>,
  ) => {
    const randomId = `eds-textfield${useId()}`;
    const textFieldId = labelProps && labelProps.id ? labelProps.id : randomId;
    const textFieldRef = React.useRef<HTMLInputElement>(null);
    const { setFilled } = useInputGroupContext();

    const handleClear = () => {
      const inputElement = textFieldRef.current;
      // Trigger an input event with target value "" to
      // both reset uncontrolled value and send an onChange event
      // for controlled value
      if (inputElement) {
        const setNativeInputValue = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype,
          'value',
        )?.set;
        setNativeInputValue?.call(inputElement, '');

        const inputEvent = new Event('input', { bubbles: true });
        inputElement.dispatchEvent(inputEvent);
        inputElement.focus();
        setFilled(false);
      }
      onClear?.();
    };

    const _append = React.useMemo((): React.ReactElement | null => {
      if (!clearable || disabled || readOnly)
        return (append as React.ReactElement) ?? null;

      return (
        <div className="eds-textfield__append">
          {append}
          <ClearButton onClear={handleClear} ariaLabel={clearButtonAriaLabel} />
        </div>
      );
    }, [append, clearable, disabled, readOnly]);

    return (
      <BaseFormControl
        disabled={disabled}
        readOnly={readOnly}
        variant={variant}
        prepend={prepend}
        append={_append}
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
        feedbackProps={feedbackProps}
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
    const inputRef = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
      if (setFiller) {
        const filled = isFilled({ value }) || isFilled(inputRef.current, true);
        if (filled !== isInputFilled) {
          setFiller(filled);
        }
      }
    }, [value, setFiller, isInputFilled]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (setFiller && value === undefined) {
        const filled = isFilled(event.target);
        if (filled !== isInputFilled) {
          setFiller(filled);
        }
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
        ref={mergeRefs(forwardRef, inputRef)}
        placeholder={placeholder}
        onChange={handleChange}
        value={value}
        {...rest}
      />
    );
  },
);

const ClearButton = ({
  onClear,
  ariaLabel,
}: {
  onClear: () => void;
  ariaLabel: string;
}) => {
  const { isFilled } = useInputGroupContext();
  if (isFilled) {
    return (
      <>
        <div className="eds-textfield__divider" />
        <IconButton
          className="eds-textfield__clear-button"
          type="button"
          aria-label={ariaLabel}
          onClick={onClear}
        >
          <CloseSmallIcon aria-hidden />
        </IconButton>
      </>
    );
  }
  return null;
};
