import React from 'react';
import classNames from 'classnames';
import './BaseChip.scss';
import './ActionChip.scss';

export type ActionChipProps = {
  /** Teksten som vises i ActionChip */
  children: React.ReactNode;
  /** Ekstra klassenavn */
  className?: string;
  [key: string]: any;
};

export const ActionChip: React.RefForwardingComponent<
  HTMLButtonElement,
  ActionChipProps
> = React.forwardRef(
  ({ children, className, ...rest }, ref: React.Ref<HTMLButtonElement>) => {
    return (
      <button
        className={classNames('eds-chip', 'eds-action-chip', className)}
        ref={ref}
        type="button"
        {...rest}
      >
        {children}
      </button>
    );
  },
);
