import React from 'react';
import classNames from 'classnames';

import { VariantType } from '@entur/utils';
import { QuestionIcon } from '@entur/icons';
import { Placement, Tooltip } from '@entur/tooltip';
import { IconButton } from '@entur/button';

import { FeedbackText } from './FeedbackText';
import { InputGroupContextProvider } from './InputGroupContext';
import { InputGroupLabel } from './InputGroupLabel';
import { useVariant } from './VariantProvider';

import './BaseFormControl.scss';

/** @deprecated use variant="information" instead */
const info = 'info';
/** @deprecated use variant="negative" instead */
const error = 'error';

export type BaseFormControlProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Et skjemaelement med `eds-form-control`-klassen */
  children: React.ReactNode;
  /** Ekstra klassenavn */
  className?: string;
  /** Sett til true om skjema-elementet er disabled */
  disabled?: boolean;
  /** Sett til true om skjema-elementet er i read-only modus */
  readOnly?: boolean;
  /** Tekst eller ikon som vises foran skjema-elementet */
  prepend?: React.ReactNode;
  /** Tekst eller ikon som vises etter skjema-elementet */
  append?: React.ReactNode;
  /** Valideringsvariant */
  variant?: VariantType | typeof error | typeof info;
  /**Størrelsen på skjemaelementet
   * @default "medium"
   */
  size?: 'medium' | 'large';
  /** Label til inputfeltet */
  label: React.ReactNode;
  /** En tooltip som forklarer labelen til inputfeltet */
  labelTooltip?: React.ReactNode;
  /** Forklarende tekst for knappen som åpner labelTooltip */
  labelTooltipButtonAriaLabel?: string;
  labelTooltipPlacement?: Placement;
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
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  /** Setter feedback-tekstens rolle for skjermlesere.
   * true/'status' = aria-live="polite" (venter til brukeren er ferdig)
   * 'alert' = aria-live="assertive" (avbryter umiddelbart)
   * false = ingen automatisk annonsering
   * @default true
   */
  ariaAlertOnFeedback?: boolean | 'alert' | 'status';
  /** Legg til et element etter feltet */
  after?: React.ReactNode;
  /** Legg til et element før feltet */
  before?: React.ReactNode;
  /** Aria-label som brukes når inputfeltet er i read-only modus */
  ariaLabelOnReadOnly?: string;
};

export const BaseFormControl = React.forwardRef<
  HTMLDivElement,
  BaseFormControlProps
>(
  (
    {
      after,
      before,
      children,
      className,
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
      labelTooltipButtonAriaLabel = `Klikk for tilleggsinfo om ${label}-feltet`,
      labelTooltipPlacement = 'top',
      feedback,
      labelId,
      labelProps,
      style,
      disableLabelAnimation = false,
      ariaAlertOnFeedback = true,
      ariaLabelOnReadOnly = 'Dette skjemafeltet kan bare leses',
      ...rest
    },
    ref,
  ) => {
    const contextVariant = useVariant();
    const currentVariant = variant || contextVariant || undefined;

    const feedbackRole =
      ariaAlertOnFeedback === false
        ? undefined
        : ariaAlertOnFeedback === 'alert'
        ? 'alert'
        : 'status';
    const showFeedback = Boolean(feedback && currentVariant);

    return (
      <InputGroupContextProvider>
        <div
          className={classNames(
            'eds-form-control__field-and-feedback-text',
            className,
            {
              'eds-form-control__field-and-feedback-text--has-tooltip':
                labelTooltip !== undefined,
            },
          )}
          style={style}
        >
          {before}
          <div
            className={classNames(
              'eds-form-control-wrapper',
              `eds-form-control-wrapper--size-${size}`,
              {
                'eds-form-control-wrapper--success':
                  currentVariant === 'success',
                'eds-form-control-wrapper--negative':
                  currentVariant === 'negative' || currentVariant === error,
                'eds-form-control-wrapper--disabled': disabled,
                'eds-form-control-wrapper--readonly': readOnly,
                'eds-form-control-wrapper--is-filled': isFilled,
              },
            )}
            ref={ref}
            tabIndex={readOnly ? -1 : undefined}
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
              aria-label={
                readOnly ? `${label}, ${ariaLabelOnReadOnly}` : undefined
              }
              {...labelProps}
            />
            {labelTooltip && (
              <Tooltip
                content={labelTooltip}
                placement={labelTooltipPlacement}
                showCloseButton={false}
                disableFocusListener={true}
                disableHoverListener={true}
                disableClickListener={false}
                disableKeyboardListener={false}
              >
                <IconButton
                  as="span"
                  tabIndex={0}
                  role="button"
                  className="eds-form-control__append eds-form-control__append--tooltip"
                  aria-label={labelTooltipButtonAriaLabel}
                >
                  <QuestionIcon
                    className="eds-input-group__label-tooltip-icon"
                    aria-hidden="true"
                  />
                </IconButton>
              </Tooltip>
            )}
            {children}
            {append && <div className="eds-form-control__append">{append}</div>}
          </div>
          {feedbackRole !== undefined ? (
            // Live region rendres alltid, slik at den finnes i DOM
            // før feedback-teksten settes — ellers annonserer ikke
            // skjermlesere innholdet pålitelig
            <FeedbackText variant={currentVariant} role={feedbackRole}>
              {showFeedback ? feedback : undefined}
            </FeedbackText>
          ) : (
            showFeedback && (
              <FeedbackText variant={currentVariant}>{feedback}</FeedbackText>
            )
          )}
          {after}
        </div>
      </InputGroupContextProvider>
    );
  },
);
