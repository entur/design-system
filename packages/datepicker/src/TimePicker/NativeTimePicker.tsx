import React, { useId } from 'react';
import classNames from 'classnames';
import {
  BaseFormControl,
  FeedbackAnnouncementProps,
  isFilled,
  useInputGroupContext,
  useVariant,
} from '@entur/form';
import { VariantType, useOnMount } from '@entur/utils';

import './NativeTimePicker.scss';

/** @deprecated use variant="information" instead */
const info = 'info';
/** @deprecated use variant="negative" instead */
const error = 'error';

export type NativeTimePickerProps = {
  /** Ekstra klassenavn */
  className?: string;
  /** Label over NativeTimePicker */
  label: string;
  /** Varselmelding, som vil komme under NativeTimePicker */
  feedback?: string;
  /** Valideringsvariant*/
  variant?: VariantType | typeof error | typeof info;
  /** Tekst eller ikon som kommer før inputfelter */
  prepend?: React.ReactNode;
} & FeedbackAnnouncementProps &
  React.InputHTMLAttributes<HTMLInputElement>;

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
      prepend,
      ariaAlertOnFeedback,
      feedbackProps,
      ...rest
    },
    ref: React.Ref<HTMLInputElement>,
  ) => {
    const nativetimepickerId = `eds-native-timepicker${useId()}`;
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
        ariaAlertOnFeedback={ariaAlertOnFeedback}
        feedbackProps={feedbackProps}
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
  variant?: VariantType | typeof error | typeof info;
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
      aria-invalid={currentVariant === 'negative' || currentVariant === error}
      type="time"
      className="eds-form-control"
      onChange={handleChange}
      value={value}
      {...rest}
    />
  );
});
