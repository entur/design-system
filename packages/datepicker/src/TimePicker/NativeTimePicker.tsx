import React from 'react';
import classNames from 'classnames';
import {
  BaseFormControl,
  isFilled,
  useInputGroupContext,
  useVariant,
  VariantType,
} from '@entur/form';
import { useOnMount, useRandomId } from '@entur/utils';

import './NativeTimePicker.scss';

export type NativeTimePickerProps = {
  /** Ekstra klassenavn */
  className?: string;
  /** Label over NativeTimePicker */
  label: string;
  /** Varselmelding, som vil komme under NativeTimePicker */
  feedback?: string;
  /** Valideringsvariant */
  variant?: VariantType;
  /** Tekst eller ikon som kommer før inputfelter */
  prepend?: React.ReactNode;
} & React.InputHTMLAttributes<HTMLInputElement>;

export const NativeTimePicker = React.forwardRef<
  HTMLInputElement,
  NativeTimePickerProps
>(
  (
    { className, style, onChange, label, feedback, variant, prepend, ...rest },
    ref: React.Ref<HTMLInputElement>,
  ) => {
    const nativetimepickerId = useRandomId('eds-native-timepicker');
    return (
      <BaseFormControl
        style={style}
        className={classNames(className, 'eds-native-timepicker')}
        prepend={prepend}
        label={label}
        feedback={feedback}
        variant={variant}
        labelId={nativetimepickerId}
        disableLabelAnimation
      >
        <NativeTimePickerBase
          onChange={onChange}
          aria-labelledby={nativetimepickerId}
          ref={ref}
          {...rest}
        />
      </BaseFormControl>
    );
  },
);

type NativeTimePickerBaseProps = {
  variant?: VariantType;
} & React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

const NativeTimePickerBase = React.forwardRef<
  HTMLInputElement,
  NativeTimePickerBaseProps
>(({ onChange, value, ...rest }, ref) => {
  const contextVariant = useVariant();
  const currentVariant = rest.variant || contextVariant;
  const { isFilled: isTimepickerFilled, setFilled: setFiller } =
    useInputGroupContext();

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
      className="eds-form-control"
      onChange={handleChange}
      value={value}
      {...rest}
    />
  );
});
