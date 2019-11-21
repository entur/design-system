import React from 'react';
import classNames from 'classnames';

type SkeletonWrapperProps = {
  /** Ekstra klassenavn */
  className?: string;
  /** Skeletonkomponentene som skal vises */
  children: React.ReactNode;
  [key: string]: any;
};

export const SkeletonWrapper: React.FC<SkeletonWrapperProps> = ({
  className,
  children,
  ...rest
}) => {
  return (
    <div
      className={classNames('eds-skeleton-wrapper', className)}
      role="alert"
      aria-busy={true}
      aria-live="polite"
      {...rest}
    >
      {children}
    </div>
  );
};
