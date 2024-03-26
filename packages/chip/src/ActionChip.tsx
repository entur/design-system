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
  /** Størrelsen på chip
   * @default 'medium'
   */
  size?: 'small' | 'medium';
} & React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

export const ActionChip = React.forwardRef<HTMLButtonElement, ActionChipProps>(
  (
    { children, className, loading = false, size = 'medium', ...rest },
    ref: React.Ref<HTMLButtonElement>,
  ) => {
    const childrenArray = React.Children.toArray(children);
    const isIcon = (child: any) =>
      child?.type?.toString().toLowerCase().includes('icon');
    const hasLeadingIcon =
      childrenArray.length > 1 && isIcon(childrenArray.at(0));
    const hasTrailingIcon =
      childrenArray.length > 1 && isIcon(childrenArray.at(-1));

    const ariaLabelValue = () => {
      if (rest['aria-label']) return rest['aria-label'];
      if (loading) return ariaLabelWhenLoading;
      return undefined;
    };

    const ariaLabelWhenLoading = childrenArray
      .filter(child => typeof child === 'string')
      .join(' ');

    const classList = classNames(className, 'eds-chip', 'eds-action-chip', {
      [`eds-chip--size-${size}`]: size,
      'eds-chip--leading-icon': hasLeadingIcon,
      'eds-chip--trailing-icon': hasTrailingIcon,
      'eds-action-chip--disabled': rest.disabled,
    });

    const actionChip = (
      <button
        className={classList}
        ref={ref}
        aria-busy={loading}
        aria-label={ariaLabelValue()}
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
