import React from 'react';
import classNames from 'classnames';
import { RightArrowIcon } from '@entur/icons';
import './ExpandRowButton.scss';

export const ExpandRowButton: React.FC<{
  open: boolean;
  onClick: (e: React.MouseEvent) => void;
}> = ({ open, onClick }) => {
  return (
    <button
      className={classNames('eds-expand-row-button', {
        'eds-expand-row-button--open': open,
      })}
      onClick={onClick}
    >
      <RightArrowIcon className="eds-expand-row-button__icon" />
    </button>
  );
};
