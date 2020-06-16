import React from 'react';
import { BaseFormControl } from '@entur/form';
import { ClockIcon } from '@entur/icons';

export type NativeTimePickerProps = {
  /** Ekstra klassenavn */
  className?: string;
  [key: string]: any;
};

export const NativeTimePicker = React.forwardRef<
  HTMLInputElement,
  NativeTimePickerProps
>(({ className, style, ...rest }, ref: React.Ref<HTMLInputElement>) => {
  return (
    <BaseFormControl
      style={style}
      className={className}
      prepend={<ClockIcon inline />}
    >
      <input
        ref={ref}
        type="time"
        className="eds-form-control eds-native-date-picker"
        {...rest}
      />
    </BaseFormControl>
  );
});
