import React from 'react';
import classNames from 'classnames';

import { useRandomId, useOnMount, mergeRefs, VariantType } from '@entur/utils';

import { useVariant } from './VariantProvider';
import { BaseFormControl } from './BaseFormControl';
import { useInputGroupContext } from './InputGroupContext';
import { isFilled } from './utils';

import './TextArea.scss';
import { Placement } from '@entur/tooltip';

/** @deprecated use variant="information" instead */
const info = 'info';
/** @deprecated use variant="negative" instead */
const error = 'error';

export type TextAreaProps = {
  /** Ekstra klassenavn */
  className?: string;
  /** Valideringsvariant */
  variant?: VariantType | typeof error | typeof info;
  /** Deaktiverer tekstområdet */
  disabled?: boolean;
  /** Setter tekstområdet i read-only modus */
  readOnly?: boolean;
  /** Label over TextArea */
  label: string;
  /** En tooltip som forklarer labelen til inputfeltet */
  labelTooltip?: React.ReactNode;
  /** Forklarende tekst for knappen som åpner labelTooltip */
  labelTooltipButtonAriaLabel?: string;
  /** Plasseringen til tooltip-en relativt til spørsmålstegn-knappen */
  labelTooltipPlacement?: Placement;
  /** Varselmelding, som vil komme under TextArea */
  feedback?: string;
  /** Plasserer labelen statisk på toppen av inputfeltet
   * @default false
   */
  disableLabelAnimation?: boolean;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      variant,
      disabled = false,
      readOnly = false,
      className,
      style,
      label,
      feedback,
      labelTooltip,
      labelTooltipButtonAriaLabel,
      labelTooltipPlacement,
      onChange,
      disableLabelAnimation,
      ...rest
    },
    ref: React.Ref<HTMLTextAreaElement>,
  ) => {
    const textAreaId = useRandomId('eds-textarea');
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);
    return (
      <BaseFormControl
        className={classNames(className, 'eds-textarea__wrapper')}
        disabled={disabled}
        readOnly={readOnly}
        variant={variant}
        style={style}
        label={label}
        labelId={textAreaId}
        feedback={feedback}
        labelTooltip={labelTooltip}
        labelTooltipButtonAriaLabel={labelTooltipButtonAriaLabel}
        labelTooltipPlacement={labelTooltipPlacement}
        labelProps={{ className: 'eds-textarea__label' }}
        disableLabelAnimation={disableLabelAnimation}
        onClick={e => {
          if (e.target === e.currentTarget) textareaRef?.current?.focus();
        }}
      >
        <TextAreaBase
          readOnly={readOnly}
          disabled={disabled}
          ref={mergeRefs(ref, textareaRef)}
          aria-labelledby={textAreaId}
          onChange={onChange}
          variant={variant}
          {...rest}
        />
      </BaseFormControl>
    );
  },
);

type TextAreaBaseProps = {
  readOnly?: boolean;
  disabled?: boolean;
  variant?: VariantType | typeof error | typeof info;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const TextAreaBase = React.forwardRef<HTMLTextAreaElement, TextAreaBaseProps>(
  ({ readOnly, disabled, onChange, value, variant, ...rest }, ref) => {
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

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
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
      <textarea
        className="eds-form-control eds-textarea"
        ref={ref}
        readOnly={readOnly}
        disabled={disabled}
        onChange={handleChange}
        value={value}
        aria-invalid={currentVariant === 'error'}
        {...rest}
      />
    );
  },
);
