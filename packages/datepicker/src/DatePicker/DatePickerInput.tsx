import React from 'react';

import { TextField, VariantType } from '@entur/form';
import { Tooltip } from '@entur/tooltip';
import { IconButton } from '@entur/button';
import { CalendarIcon } from '@entur/icons';
import { mergeRefs } from '@entur/utils';

type DatePickerInputProps = {
  style?: React.CSSProperties;
  label: string;
  inputPlaceholder: string;
  prepend?: React.ReactNode;
  feedback?: string;
  variant?: VariantType;
  disabled?: boolean;
  disableLabelAnimation?: boolean;
  calendarButtonTooltipOpen: string;
  calendarButtonTooltipClose: string;
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
  'aria-labelledby'?: string;
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
      calendarButtonTooltipOpen,
      calendarButtonTooltipClose,
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
      'aria-labelledby': ariaLabelledBy, // eslint-disable-line @typescript-eslint/no-unused-vars
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

    const calendarButtonAriaLabel = () => {
      const buttonStateText = calendarGUIIsOpen()
        ? calendarButtonTooltipClose
        : calendarButtonTooltipOpen;
      const currentSelectionText = selectedDate
        ? `${inputRef.current?.value} valgt`
        : 'Ingen dato valgt';
      return `${buttonStateText}, ${currentSelectionText}`;
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
        ariaAlertOnFeedback
        append={
          !hideCalendarButton && (
            <Tooltip
              placement="top"
              content={
                calendarGUIIsOpen()
                  ? calendarButtonTooltipClose
                  : calendarButtonTooltipOpen
              }
              disableHoverListener={disabled}
              disableFocusListener={disabled}
            >
              <IconButton
                id={calendarButtonId}
                type="button"
                onClick={handleOnClickCalendarButton}
                tabIndex={calendarGUIIsOpen() ? -1 : 0}
                aria-label={calendarButtonAriaLabel()}
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
