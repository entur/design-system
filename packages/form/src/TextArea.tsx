import React from 'react';
import { VariantType } from './VariantProvider';
import { BaseFormControl } from './BaseFormControl';
import './TextArea.scss';
import { isFilled } from './utils';
import { useInputGroupContext } from './InputGroupContext';
import { useRandomId, useOnMount } from '@entur/utils';

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
  labelTooltip: React.ReactNode;
  /** Varselmelding, som vil komme under TextArea */
  feedback?: string;
  [key: string]: any;
};

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
      >
        <TextAreaBase
          readOnly={readOnly}
          disabled={disabled}
          ref={ref}
          aria-labelledby={textAreaId}
          {...rest}
        />
      </BaseFormControl>
    );
  },
);

type TextAreaBaseProps = {
  readOnly?: boolean;
  disabled?: boolean;
  [key: string]: any;
};

const TextAreaBase = React.forwardRef<HTMLTextAreaElement, TextAreaBaseProps>(
  ({ readOnly, disabled, ...rest }, ref) => {
    const {
      isFilled: isInputFilled,
      setFilled: setFiller,
    } = useInputGroupContext();

    useOnMount(() => {
      if (rest.value) {
        setFiller && !isInputFilled && setFiller(true);
      }
    });

    const handleChange = (event: any) => {
      if (isFilled(event.target)) {
        setFiller && !isInputFilled && setFiller(true);
      } else {
        setFiller && isInputFilled && setFiller(false);
      }
      if (rest.onChange) {
        rest.onChange();
      }
    };
    return (
      <textarea
        className="eds-form-control eds-textarea"
        ref={ref}
        readOnly={readOnly}
        disabled={disabled}
        onChange={handleChange}
        {...rest}
      />
    );
  },
);
