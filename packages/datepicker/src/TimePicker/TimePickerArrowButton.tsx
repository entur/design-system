import React from 'react';
import classNames from 'classnames';

import { IconButton } from '@entur/button';
import { LeftArrowIcon, RightArrowIcon } from '@entur/icons';

type TimePickerArrowButtonProps = {
  direction: 'left' | 'right';
} & React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

export const TimePickerArrowButton: React.FC<TimePickerArrowButtonProps> = ({
  direction,
  onClick,
  disabled,
  'aria-label': ariaLabel,
}) => {
  return (
    <IconButton
      className={classNames(
        'eds-timepicker__arrowbutton',
        `eds-timepicker__arrowbutton--${direction}`,
      )}
      type="button"
      tabIndex={-1}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {direction === 'left' ? <LeftArrowIcon /> : <RightArrowIcon />}
    </IconButton>
  );
};
