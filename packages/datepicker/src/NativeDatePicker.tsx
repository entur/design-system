import React from 'react';
import { BaseFormControl } from '@entur/form';
import { DateIcon } from '@entur/icons';

export type NativeDatePickerProps = {
  /** Ekstra klassenavn */
  className?: string;
  [key: string]: any;
};

export const NativeDatePicker = React.forwardRef<
  HTMLInputElement,
  NativeDatePickerProps
>(({ className, style, ...rest }, ref: React.Ref<HTMLInputElement>) => {
  return (
    <BaseFormControl
      style={style}
      className={className}
      prepend={<DateIcon inline />}
    >
      <input
        ref={ref}
        type="date"
        className="eds-form-control eds-native-date-picker"
        {...rest}
      />
    </BaseFormControl>
  );
});
