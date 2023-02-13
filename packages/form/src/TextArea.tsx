import React from 'react';
import { useVariant, VariantType } from './VariantProvider';
import { BaseFormControl } from './BaseFormControl';
import './TextArea.scss';
import { useInputGroupContext } from './InputGroupContext';
import { useRandomId, useOnMount } from '@entur/utils';
import { isFilled } from './utils';

export type TextAreaProps = {
  /** Ekstra klassenavn */
  className?: string;
  /** Valideringsvariant */
  variant?: VariantType;
  /** Deaktiverer tekstområdet */
  disabled?: boolean;
  /** Setter tekstområdet i read-only modus */
  readOnly?: boolean;
  /** Label over TextArea */
  label: string;
  /** En tooltip som forklarer labelen til inputfeltet */
  labelTooltip?: React.ReactNode;
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
      onChange,
      disableLabelAnimation,
      ...rest
    },
    ref: React.Ref<HTMLTextAreaElement>,
  ) => {
    const textAreaId = useRandomId('eds-textarea');
    return (
      <BaseFormControl
        className={className}
        disabled={disabled}
        readOnly={readOnly}
        variant={variant}
        style={style}
        label={label}
        labelId={textAreaId}
        feedback={feedback}
        labelTooltip={labelTooltip}
        labelProps={{ className: 'eds-textarea__label' }}
        disableLabelAnimation={disableLabelAnimation}
      >
        <TextAreaBase
          readOnly={readOnly}
          disabled={disabled}
          ref={ref}
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
  variant?: VariantType;
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
