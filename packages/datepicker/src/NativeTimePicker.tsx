import React from 'react';
import {
  BaseFormControl,
  isFilled,
  useInputGroupContext,
  useVariant,
  VariantType,
} from '@entur/form';
import { ClockIcon } from '@entur/icons';
import { useOnMount, useRandomId } from '@entur/utils';

export type NativeTimePickerProps = {
  /** Ekstra klassenavn */
  className?: string;
  /** Label over NativeTimePicker */
  label: string;
  /** Varselmelding, som vil komme under NativeTimePicker */
  feedback?: string;
  /** Valideringsvariant */
  variant?: VariantType;
  /** Plasserer labelen statisk på toppen av inputfeltet
   * @default false
   */
  disableLabelAnimation?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>;

export const NativeTimePicker = React.forwardRef<
  HTMLInputElement,
  NativeTimePickerProps
>(
  (
    {
      className,
      style,
      onChange,
      label,
      feedback,
      variant,
      disableLabelAnimation,
      ...rest
    },
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
        disableLabelAnimation={disableLabelAnimation}
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
} & React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

const NativeTimePickerBase = React.forwardRef<
  HTMLInputElement,
  NativeTimePickerBaseProps
>(({ onChange, id, value, ...rest }, ref) => {
  const contextVariant = useVariant();
  const currentVariant = rest.variant || contextVariant;
  const {
    isFilled: isTimepickerFilled,
    setFilled: setFiller,
  } = useInputGroupContext();

  useOnMount(() => {
    setFiller && !isTimepickerFilled && setFiller(true);
  });

  React.useEffect(() => {
    if (value) {
      setFiller && !isTimepickerFilled && setFiller(true);
    } else {
      setFiller && isTimepickerFilled && setFiller(false);
    }
  }, [value, setFiller, isTimepickerFilled]);

  const handleChange = (event: any) => {
    if (isFilled(event.target)) {
      setFiller && !isTimepickerFilled && setFiller(true);
    } else {
      setFiller && isTimepickerFilled && setFiller(false);
    }
    if (onChange) {
      onChange(event);
    }
  };
  return (
    <input
      ref={ref}
      aria-invalid={currentVariant === 'error'}
      type="time"
      className="eds-form-control eds-native-date-picker"
      onChange={handleChange}
      value={value}
      {...rest}
    />
  );
});
