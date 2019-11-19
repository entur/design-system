import React, { CSSProperties } from 'react';
import classNames from 'classnames';
import './Skeleton.scss';
import './SkeletonWrapper.scss';

type SkeletonProps = {
  /** Ekstra klassenavn */
  className?: string;
  /** Bredden til komponenten. Er 100% som default. */
  width?: CSSProperties;
  /** Høyden til komponenten. 1rem som default. */
  height?: CSSProperties;
  [key: string]: any;
};

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  width,
  height,
  ...rest
}) => {
  return (
    <div
      className={classNames('eds-skeleton', 'eds-skeleton-animate', className)}
      role="alert"
      aria-busy={true}
      aria-live="polite"
      style={{ width, height, ...rest.style }}
      {...rest}
    />
  );
};
