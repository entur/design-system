import React from 'react';
import classNames from 'classnames';

export type SkeletonWrapperProps = {
  /** Meldig som leses opp for skjemleser */
  loadingAriaLabel?: string;
  /** Ekstra klassenavn */
  className?: string;
  /** Skeletonkomponentene som skal vises */
  children: React.ReactNode;
  [key: string]: any;
};

export const SkeletonWrapper: React.FC<SkeletonWrapperProps> = ({
  className,
  children,
  loadingAriaLabel = 'Laster inn innhold …',
  ...rest
}) => {
  return (
    <div
      className={classNames('eds-skeleton-wrapper', className)}
      role="alert"
      aria-busy={true}
      aria-live="polite"
      aria-label={loadingAriaLabel}
      {...rest}
    >
      {children}
    </div>
  );
};
