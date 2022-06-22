import React from 'react';
import classNames from 'classnames';
import { LoadingDots } from '@entur/loader';
import './BaseChip.scss';
import './ActionChip.scss';

export type ActionChipProps = {
  /** Teksten som vises i ActionChip */
  children: React.ReactNode;
  /** Ekstra klassenavn */
  className?: string;
  /** Om chip-en er opptatt, f.eks med å oppdatere informasjon
   * @default false
   */
  loading?: boolean;
} & React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

export const ActionChip = React.forwardRef<HTMLButtonElement, ActionChipProps>(
  (
    { children, className, loading = false, ...rest },
    ref: React.Ref<HTMLButtonElement>,
  ) => {
    const childrenArray = React.Children.toArray(children);
    const hasLeadingIcon =
      childrenArray.length > 1 && typeof childrenArray[0] !== 'string';
    const hasTrailingIcon =
      childrenArray.length > 1 &&
      typeof childrenArray[childrenArray.length - 1] !== 'string';

    const actionChip = (
      <button
        className={classNames(
          'eds-chip',
          'eds-action-chip',
          {
            'eds-chip--leading-icon': hasLeadingIcon,
            'eds-chip--trailing-icon': hasTrailingIcon,
            'eds-action-chip--disabled': rest.disabled,
          },
          className,
        )}
        ref={ref}
        type="button"
        {...rest}
      >
        {loading ? (
          <LoadingDots className="eds-action-chip__loading-dots" />
        ) : (
          children
        )}
      </button>
    );

    if (rest.disabled) {
      return (
        <div className="eds-action-chip--disabled__wrapper">{actionChip}</div>
      );
    }
    return <>{actionChip}</>;
  },
);
