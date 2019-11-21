import React, { CSSProperties } from 'react';
import classNames from 'classnames';
import { BaseSkeleton } from './BaseSkeleton';
type SkeletonRectangleProps = {
  /** Ekstra klassenavn */
  className?: string;
  /** Bredden til komponenten. Er 100% som default. */
  width?: CSSProperties;
  /** Høyden til komponenten. 1rem som default. */
  height?: CSSProperties;
  [key: string]: any;
};

export const SkeletonRectangle: React.FC<SkeletonRectangleProps> = ({
  className,
  width,
  height,
  ...rest
}) => {
  return (
    <BaseSkeleton
      className={classNames('eds-skeleton-rectangle', className)}
      style={{ width, height, ...rest.style }}
      {...rest}
    />
  );
};
