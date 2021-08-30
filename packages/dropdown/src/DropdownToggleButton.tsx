import React from 'react';
import classNames from 'classnames';
import { DownArrowIcon } from '@entur/icons';
import { useDownshift } from './DownshiftProvider';
import './DropdownToggleButton.scss';

export const DropdownToggleButton: () => JSX.Element = () => {
  const { getToggleButtonProps, isOpen } = useDownshift();
  return (
    <button
      {...getToggleButtonProps({
        className: classNames('eds-dropdown__toggle-button', {
          'eds-dropdown__toggle-button--open': isOpen,
        }),
      })}
      tabIndex="-1"
      type="button"
    >
      <DownArrowIcon />
    </button>
  );
};
