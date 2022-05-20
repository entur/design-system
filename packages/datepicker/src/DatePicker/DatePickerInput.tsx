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
  calendarButtonId: string;
  forwardRef: React.ForwardedRef<HTMLInputElement>;
  toggleCalendarGUI: () => void;
  setFocusToCalendarGUI: () => void;
  setShouldFocusOnCalendarButtonAfterSelect: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  onKeyDownInput: (event: KeyboardEvent) => any;
  onBlurInput: (event: FocusEvent) => any;
  calendarGUIIsOpen: () => boolean | undefined;
  onClick?: React.MouseEventHandler<HTMLInputElement>; // react-datepicker's onClick prop
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
      calendarButtonId,
      forwardRef,
      toggleCalendarGUI,
      onKeyDownInput,
      onBlurInput,
      selectedDate,
      setFocusToCalendarGUI,
      setShouldFocusOnCalendarButtonAfterSelect,
      calendarGUIIsOpen,
      placeholder, // eslint-disable-line
      onClick,
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
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inputRef, selectedDate]);

    function handleOnKeyDown(this: HTMLElement, event: KeyboardEvent) {
      onKeyDownInput(event);
    }
    function handleOnBlur(this: HTMLElement, event: FocusEvent) {
      onBlurInput(event);
    }
    const handleOnFocus = () =>
      requestAnimationFrame(() => inputRef.current?.select());

    const handleOnClickInputField = (
      event: React.MouseEvent<HTMLInputElement, MouseEvent>,
    ) => {
      setShouldFocusOnCalendarButtonAfterSelect(false);
      onClick && onClick(event);
    };

    const handleOnClickCalendarButton = () => {
      toggleCalendarGUI();
      setFocusToCalendarGUI();
      setShouldFocusOnCalendarButtonAfterSelect(true);
    };

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
        onClick={handleOnClickInputField}
        append={
          !hideCalendarButton && (
            <Tooltip
              placement="top"
              content={calendarButtonTooltip}
              disableHoverListener={disabled}
              disableFocusListener={disabled}
            >
              <IconButton
                id={calendarButtonId}
                type="button"
                onClick={handleOnClickCalendarButton}
                tabIndex={calendarGUIIsOpen() ? -1 : 0}
              >
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
