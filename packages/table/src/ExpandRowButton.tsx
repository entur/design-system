import React from 'react';
import classNames from 'classnames';
import { RightArrowIcon } from '@entur/icons';
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
    <button
      className={classNames('eds-expand-row-button', {
        'eds-expand-row-button--open': open,
      })}
      onClick={onClick}
      {...rest}
    >
      <RightArrowIcon className="eds-expand-row-button__icon" />
    </button>
  );
};
