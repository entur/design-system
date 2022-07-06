import { Tooltip } from '@entur/tooltip';
import classNames from 'classnames';
import React from 'react';
import './BaseFormControl.scss';
import { FeedbackText } from './FeedbackText';
import { InputGroupContextProvider } from './InputGroupContext';
import { InputGroupLabel } from './InputGroupLabel';
import { useVariant, VariantType } from './VariantProvider';
import { QuestionIcon } from '@entur/icons';

export type BaseFormControlProps = {
  /** Et skjemaelement med `eds-form-control`-klassen */
  children: React.ReactNode;
  /** Ekstra klassenavn */
  className?: string;
  /** Sett til true om skjema-elementet skal ha mørkt design i contrast mode */
  dark?: boolean;
  /** Sett til true om skjema-elementet er disabled */
  disabled?: boolean;
  /** Sett til true om skjema-elementet er i read-only modus */
  readOnly?: boolean;
  /** Tekst eller ikon som vises foran skjema-elementet */
  prepend?: React.ReactNode;
  /** Tekst eller ikon som vises etter skjema-elementet */
  append?: React.ReactNode;
  /** Valideringsvariant */
  variant?: VariantType;
  /**Størrelsen på skjemaelementet
   * @default "medium"
   */
  size?: 'medium' | 'large';
  /** Label til inputfeltet */
  label: React.ReactNode;
  /** En tooltip som forklarer labelen til inputfeltet */
  labelTooltip?: React.ReactNode;
  /** Illustrerer om inputfeltet er påkrevd eller ikke */
  required?: boolean;
  /** ID som settes på labelen til inputfeltet */
  labelId: string;
  /** Varselmelding, som vil komme under form-komponenten */
  feedback?: string;
  /** Om inputfeltet er fylt med data. Brukes for plassering av label */
  isFilled?: boolean;
  /**Ekstra props som sendes til label */
  labelProps?: { [key: string]: any };
  /** Ekstra styling */
  style?: React.CSSProperties;
  /** Plasserer labelen statisk på toppen av inputfeltet */
  disableLabelAnimation?: boolean;
  /** Setter feedbackText sin rolle til "alert" */
  ariaAlertOnFeedback?: boolean;
};

export const BaseFormControl = React.forwardRef<
  HTMLDivElement,
  BaseFormControlProps
>(
  (
    {
      children,
      className,
      dark = false,
      disabled = false,
      readOnly = false,
      variant,
      prepend,
      append,
      size = 'medium',
      isFilled,
      label,
      required,
      labelTooltip,
      feedback,
      labelId,
      labelProps,
      style,
      disableLabelAnimation = false,
      ariaAlertOnFeedback = false,
      ...rest
    },
    ref,
  ) => {
    const contextVariant = useVariant();
    const currentVariant = variant || contextVariant;

    return (
      <InputGroupContextProvider>
        <div
          className={classNames(
            'eds-form-control-wrapper',
            className,
            `eds-form-control-wrapper--size-${size}`,
            {
              'eds-form-control-wrapper--success': currentVariant === 'success',
              'eds-form-control-wrapper--error': currentVariant === 'error',
              'eds-form-control-wrapper--dark': dark,
              'eds-form-control-wrapper--disabled': disabled,
              'eds-form-control-wrapper--readonly': readOnly,
              'eds-form-control-wrapper--is-filled': isFilled,
            },
          )}
          ref={ref}
          style={style}
          {...rest}
        >
          {prepend && (
            <div className="eds-form-control__prepend">{prepend}</div>
          )}
          <InputGroupLabel
            label={label}
            required={required}
            labelId={labelId}
            staticAnimation={disableLabelAnimation}
            {...labelProps}
          />
          {children}
          {append && <div className="eds-form-control__append">{append}</div>}
          {labelTooltip && (
            <div className="eds-form-control__append eds-form-control__append--tooltip">
              <Tooltip content={labelTooltip} placement="right">
                <span className="eds-input-group__label-tooltip-icon">
                  <QuestionIcon />
                </span>
              </Tooltip>
            </div>
          )}
        </div>
        {feedback && currentVariant && (
          <FeedbackText
            variant={currentVariant}
            role={ariaAlertOnFeedback ? 'alert' : undefined}
          >
            {feedback}
          </FeedbackText>
        )}
      </InputGroupContextProvider>
    );
  },
);
