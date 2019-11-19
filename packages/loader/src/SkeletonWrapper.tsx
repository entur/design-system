import React, { CSSProperties } from 'react';
import classNames from 'classnames';
import './Skeleton.scss';

type SkeletonWrapperProps = {
  /** Ekstra klassenavn */
  className?: string;
  /** Skeletonkomponentene som skal vises */
  children: React.ReactNode;
  /** Høyden til SkeletonWrapper */
  height?: CSSProperties;
  /** Bredden til SkeletonWrapper */
  width?: CSSProperties;
  [key: string]: any;
};

export const SkeletonWrapper: React.FC<SkeletonWrapperProps> = ({
  className,
  width,
  height,
  children,
  ...rest
}) => {
  return (
    <div
      className={classNames('eds-skeleton-wrapper')}
      role="alert"
      aria-busy={true}
      aria-live="polite"
      {...rest}
    >
      {children}
    </div>
  );
};
