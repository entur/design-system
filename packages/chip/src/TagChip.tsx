import React from 'react';
import classNames from 'classnames';
import { CloseIcon } from '@entur/icons';
import './BaseChip.scss';
import './TagChip.scss';

export type TagChipProps = {
  /** Teksten som vises i TagChip */
  children: React.ReactNode;
  /** Ekstra klassenavn */
  className?: string;
  /** Callback for når man klikker på krysset */
  onClose: () => void;
};

export const TagChip = React.forwardRef<HTMLButtonElement, TagChipProps>(
  (
    { children, className, onClose, ...rest },
    ref: React.Ref<HTMLButtonElement>,
  ) => {
    return (
      <div
        className={classNames('eds-chip', 'eds-tag-chip', className)}
        {...rest}
      >
        {children}
        <button
          className="eds-tag-chip__close-button"
          type="button"
          onClick={onClose}
          ref={ref}
        >
          <CloseIcon />
        </button>
      </div>
    );
  },
);
