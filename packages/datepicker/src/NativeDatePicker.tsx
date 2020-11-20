import React from 'react';
import {
  BaseFormControl,
  isFilled,
  useInputGroupContext,
  useVariant,
  VariantType,
} from '@entur/form';
import { DateIcon } from '@entur/icons';
import { useOnMount, useRandomId } from '@entur/utils';

export type NativeDatePickerProps = {
  /** Ekstra klassenavn */
  className?: string;
  /** Label over NativeDatePicker */
  label: string;
  /** Varselmelding, som vil komme under NativeDatePicker */
  feedback?: string;
  /** Valideringsvariant */
  variant?: VariantType;
} & React.InputHTMLAttributes<HTMLInputElement>;

export const NativeDatePicker = React.forwardRef<
  HTMLInputElement,
  NativeDatePickerProps
>(
  (
    { className, style, label, onChange, feedback, variant, ...rest },
    ref: React.Ref<HTMLInputElement>,
  ) => {
    const nativedatepickerId = useRandomId('eds-nativetimepicker');
    return (
      <BaseFormControl
        style={style}
        className={className}
        prepend={<DateIcon inline />}
        label={label}
        feedback={feedback}
        variant={variant}
        labelId={nativedatepickerId}
      >
        <NativeDatePickerBase
          onChange={onChange}
          id={nativedatepickerId}
          ref={ref}
          variant={variant}
          {...rest}
        />
      </BaseFormControl>
    );
  },
);

type NativeDatePickerBaseProps = {
  onChange?: any;
  variant?: VariantType;
  id: string;
};

const NativeDatePickerBase = React.forwardRef<
  HTMLInputElement,
  NativeDatePickerBaseProps
>(({ onChange, id, variant, ...rest }, ref) => {
  const contextVariant = useVariant();
  const currentVariant = variant || contextVariant;
  const {
    isFilled: isDatepickerFilled,
    setFilled: setFiller,
  } = useInputGroupContext();

  useOnMount(() => {
    setFiller && !isDatepickerFilled && setFiller(true);
  });

  const handleChange = (event: any) => {
    if (isFilled(event.target)) {
      setFiller && !isDatepickerFilled && setFiller(true);
    } else {
      setFiller && isDatepickerFilled && setFiller(false);
    }
    if (onChange) {
      onChange(event);
    }
  };
  return (
    <input
      ref={ref}
      aria-invalid={currentVariant === 'error'}
      type="date"
      className="eds-form-control eds-native-date-picker"
      onChange={handleChange}
      id={id}
      {...rest}
    />
  );
});
