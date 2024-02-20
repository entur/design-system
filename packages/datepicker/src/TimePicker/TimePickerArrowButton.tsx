import React from 'react';
import classNames from 'classnames';

import { IconButton } from '@entur/button';
import { LeftArrowIcon, RightArrowIcon } from '@entur/icons';

type TimePickerArrowButtonProps = {
  direction: 'left' | 'right';
  disabled?: boolean;
  'aria-label': string;
  onClick?: () => void;
  onFocus?: () => void;
};

export const TimePickerArrowButton = ({
  direction,
  onClick,
  disabled,
  'aria-label': ariaLabel,
  ...rest
}: TimePickerArrowButtonProps) => {
  return (
    <IconButton
      className={classNames(
        'eds-timepicker__arrowbutton',
        `eds-timepicker__arrowbutton--${direction}`,
        { 'eds-timepicker__arrowbutton--disabled': disabled },
      )}
      type="button"
      tabIndex={-1}
      onClick={onClick}
      aria-label={ariaLabel}
      disabled={disabled}
      {...rest}
    >
      {direction === 'left' ? <LeftArrowIcon /> : <RightArrowIcon />}
    </IconButton>
  );
};
