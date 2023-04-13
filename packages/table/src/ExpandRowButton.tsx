import React from 'react';
import classNames from 'classnames';
import { DownArrowIcon } from '@entur/icons';
import { IconButton } from '@entur/button';
import './ExpandRowButton.scss';

export type ExpandRowButtonProps = {
  open: boolean;
  onClick: (e: React.MouseEvent) => void;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const ExpandRowButton: React.FC<ExpandRowButtonProps> = ({
  open,
  onClick,
  ...rest
}) => {
  return (
    <IconButton
      className={classNames('eds-expand-row-button', {
        'eds-expand-row-button--open': open,
      })}
      onClick={onClick}
      aria-label={open ? 'Lukk tabellrad' : 'Utvid tabellrad'}
      {...rest}
    >
      <DownArrowIcon aria-hidden className="eds-expand-row-button__icon" />
    </IconButton>
  );
};
