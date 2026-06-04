import React from 'react';
import classNames from 'classnames';
import { DownArrowIcon } from '@entur/icons';
import { IconButton } from '@entur/button';
import './ExpandRowButton.scss';

export type ExpandRowButtonProps = {
  open: boolean;
  onClick: (e: React.MouseEvent) => void;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const ExpandRowButton = ({
  open,
  onClick,
  ...rest
}: ExpandRowButtonProps) => {
  return (
    <IconButton
      className={classNames('eds-expand-row-button', {
        'eds-expand-row-button--open': open,
      })}
      onClick={onClick}
      aria-label={open ? 'Lukk tabellrad' : 'Utvid tabellrad'}
      type="button"
      {...rest}
    >
      <DownArrowIcon aria-hidden className="eds-expand-row-button__icon" />
    </IconButton>
  );
};
