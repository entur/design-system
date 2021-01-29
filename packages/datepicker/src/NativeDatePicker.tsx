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
  /** Plasserer labelen statisk på toppen av inputfeltet
   * @default false
   */
  disableLabelAnimation?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>;

export const NativeDatePicker = React.forwardRef<
  HTMLInputElement,
  NativeDatePickerProps
>(
  (
    {
      className,
      style,
      label,
      onChange,
      feedback,
      variant,
      disableLabelAnimation,
      ...rest
    },
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
        disableLabelAnimation={disableLabelAnimation}
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
} & React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

const NativeDatePickerBase = React.forwardRef<
  HTMLInputElement,
  NativeDatePickerBaseProps
>(({ onChange, id, variant, value, ...rest }, ref) => {
  const contextVariant = useVariant();
  const currentVariant = variant || contextVariant;
  const {
    isFilled: isDatepickerFilled,
    setFilled: setFiller,
  } = useInputGroupContext();

  useOnMount(() => {
    setFiller && !isDatepickerFilled && setFiller(true);
  });

  React.useEffect(() => {
    if (value) {
      setFiller && !isDatepickerFilled && setFiller(true);
    } else {
      setFiller && isDatepickerFilled && setFiller(false);
    }
  }, [value]);

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
      value={value}
      {...rest}
    />
  );
});
