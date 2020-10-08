import React from 'react';
import {
  BaseFormControl,
  isFilled,
  useInputGroupContext,
  useVariant,
  VariantType,
} from '@entur/form';
import { ClockIcon } from '@entur/icons';
import { useRandomId } from '@entur/utils';

export type NativeTimePickerProps = {
  /** Ekstra klassenavn */
  className?: string;
  /** Label over NativeTimePicker */
  label: string;
  /** Varselmelding, som vil komme under NativeTimePicker */
  feedback?: string;
  /** Valideringsvariant */
  variant?: VariantType;
  [key: string]: any;
};

export const NativeTimePicker = React.forwardRef<
  HTMLInputElement,
  NativeTimePickerProps
>(
  (
    { className, style, onChange, label, feedback, variant, ...rest },
    ref: React.Ref<HTMLInputElement>,
  ) => {
    const nativetimepickerId = useRandomId('eds-nativetimepicker');
    return (
      <BaseFormControl
        style={style}
        className={className}
        prepend={<ClockIcon inline />}
        label={label}
        feedback={feedback}
        variant={variant}
        labelId={nativetimepickerId}
      >
        <NativeTimePickerBase
          onChange={onChange}
          id={nativetimepickerId}
          ref={ref}
          {...rest}
        />
      </BaseFormControl>
    );
  },
);

type NativeTimePickerBaseProps = {
  [key: string]: any;
};

const NativeTimePickerBase = React.forwardRef<
  HTMLInputElement,
  NativeTimePickerBaseProps
>(({ onChange, id, ...rest }, ref) => {
  const contextVariant = useVariant();
  const currentVariant = rest.variant || contextVariant;
  const {
    isFilled: isTimepickerFilled,
    setFilled: setFiller,
  } = useInputGroupContext();

  React.useEffect(() => {
    // Check if filled on first render
    setFiller && !isTimepickerFilled && setFiller(true);
  }, []);

  const handleChange = (event: any) => {
    if (isFilled(event.target)) {
      setFiller && !isTimepickerFilled && setFiller(true);
    } else {
      setFiller && isTimepickerFilled && setFiller(false);
    }
    if (onChange) {
      rest.onChange(event);
    }
  };
  return (
    <input
      ref={ref}
      aria-invalid={currentVariant === 'error'}
      type="time"
      className="eds-form-control eds-native-date-picker"
      onChange={handleChange}
      {...rest}
    />
  );
});
