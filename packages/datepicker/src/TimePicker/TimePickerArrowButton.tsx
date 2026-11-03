import classNames from 'classnames';

import { IconButton } from '@entur/button';
import { LeftArrowIcon, RightArrowIcon } from '@entur/icons';

type TimePickerArrowButtonProps = {
  direction: 'left' | 'right';
  disabled?: boolean;
  readonly?: boolean;
  'aria-label': string;
  onClick?: () => void;
};

export const TimePickerArrowButton = ({
  direction,
  onClick,
  disabled,
  readonly,
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
      // Keeps focus where it is on a mouse click. Moving focus away when the
      // button got it stopped screen readers from pressing it
      onMouseDown={e => e.preventDefault()}
      onClick={onClick}
      aria-label={ariaLabel}
      disabled={disabled}
      {...rest}
    >
      {direction === 'left' ? <LeftArrowIcon /> : <RightArrowIcon />}
    </IconButton>
  );
};
