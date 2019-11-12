import React from 'react';
import { SubParagraph } from '@entur/typography';
import './BaseChips.scss';

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
        className={`entur-chip ${className}`}
        ref={ref}
        type="button"
        {...rest}
      >
        <SubParagraph as="div">{children}</SubParagraph>
      </button>
    );
  },
);
