import React from 'react';

import { TextField, VariantType } from '@entur/form';
import { Tooltip } from '@entur/tooltip';
import { IconButton } from '@entur/button';
import { CalendarIcon } from '@entur/icons';

type DatePickerInputProps = {
  style?: React.CSSProperties;
  label: string;
  inputPlaceholder: string;
  prepend?: React.ReactNode;
  feedback?: string;
  variant?: VariantType;
  disabled?: boolean;
  disableLabelAnimation?: boolean;
  calendarButtonTooltip: string;
  hideCalendarButton?: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  forwardRef: React.ForwardedRef<HTMLInputElement>;
  toggleCalendarGUI: () => void;
  onClick?: React.MouseEventHandler<HTMLButtonElement | HTMLInputElement>;
  onKeyDownInput: (event: KeyboardEvent) => any;
  onBlurInput: (event: FocusEvent) => any;
  onFocus: undefined; // To prevent open on focus
  selectedDate: Date | null; // Necessary to update component on state change
  placeholder?: null; // override react-datepickers placeholder prop
};

export const DatePickerInput = React.forwardRef<
  HTMLInputElement,
  DatePickerInputProps
>(
  (
    {
      style,
      label,
      inputPlaceholder,
      prepend,
      feedback,
      variant,
      disabled,
      calendarButtonTooltip,
      hideCalendarButton,
      disableLabelAnimation,
      inputRef,
      forwardRef,
      toggleCalendarGUI,
      onKeyDownInput,
      onBlurInput,
      selectedDate,
      placeholder, // eslint-disable-line
      ...rest // forwarded props from react-datepicker
    },
    ref,
  ) => {
    React.useEffect(() => {
      inputRef.current?.addEventListener('keydown', handleOnKeyDown);
      inputRef.current?.addEventListener('blur', handleOnBlur);
      inputRef.current?.addEventListener('focus', handleOnFocus);
      return () => {
        inputRef.current?.removeEventListener('keydown', handleOnKeyDown);
        inputRef.current?.removeEventListener('blur', handleOnBlur);
        inputRef.current?.removeEventListener('focus', handleOnFocus);
      };
    }, [inputRef, selectedDate]);

    function handleOnKeyDown(this: HTMLElement, event: KeyboardEvent) {
      onKeyDownInput(event);
    }
    function handleOnBlur(this: HTMLElement, event: FocusEvent) {
      onBlurInput(event);
    }
    function handleOnFocus() {
      setTimeout(() => inputRef.current?.select(), 5);
    }

    return (
      <TextField
        style={style}
        label={label}
        placeholder={inputPlaceholder}
        prepend={prepend}
        feedback={feedback}
        variant={variant}
        disableLabelAnimation={disableLabelAnimation}
        ref={mergeRefs(ref, inputRef, forwardRef)}
        append={
          !hideCalendarButton && (
            <Tooltip
              placement="top"
              content={calendarButtonTooltip}
              disableHoverListener={disabled}
              disableFocusListener={disabled}
            >
              <IconButton type="button" onClick={toggleCalendarGUI}>
                <CalendarIcon />
              </IconButton>
            </Tooltip>
          )
        }
        {...rest}
      />
    );
  },
);

const mergeRefs = <T extends HTMLElement>(
  ...refs: React.MutableRefObject<T>[] | React.ForwardedRef<T>[]
) => {
  return (node: T) => {
    for (const ref of refs) {
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) ref.current = node;
    }
  };
};
