import React from 'react';
import './BaseChip.scss';

type ActionChipProps = {
  /** Teksten som står inne i chippen */
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
        className={`eds-chip ${className}`}
        ref={ref}
        type="button"
        {...rest}
      >
        {children}
      </button>
    );
  },
);
