import React from 'react';
import classNames from 'classnames';
import './BaseChip.scss';
import './ActionChip.scss';

export type ActionChipProps = {
  /** Teksten som vises i ActionChip */
  children: React.ReactNode;
  /** Ekstra klassenavn */
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const ActionChip = React.forwardRef<HTMLButtonElement, ActionChipProps>(
  ({ children, className, ...rest }, ref: React.Ref<HTMLButtonElement>) => {
    const childrenArray = React.Children.toArray(children);
    const hasLeadingIcon =
      childrenArray.length > 1 && typeof childrenArray[0] !== 'string';
    const hasTrailingIcon =
      childrenArray.length > 1 &&
      typeof childrenArray[childrenArray.length - 1] !== 'string';

    return (
      <button
        className={classNames(
          'eds-chip',
          'eds-action-chip',
          {
            'eds-chip--leading-icon': hasLeadingIcon,
            'eds-chip--trailing-icon': hasTrailingIcon,
          },
          className,
        )}
        ref={ref}
        type="button"
        {...rest}
      >
        {children}
      </button>
    );
  },
);
