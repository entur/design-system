import React from 'react';
import classNames from 'classnames';
import { BaseSkeleton } from './BaseSkeleton';

export type SkeletonCircleProps = {
  /** Ekstra klassenavn */
  className?: string;
  /** Høyde og bredde av sirkelen. 1rem som default
   * @default '1rem'
   */
  size: string | number;
  [key: string]: any;
};

export const SkeletonCircle: React.FC<SkeletonCircleProps> = ({
  className,
  size,
  ...rest
}) => {
  return (
    <BaseSkeleton
      className={classNames(className, 'eds-skeleton-circle')}
      style={{ width: size, height: size, ...rest.style }}
      {...rest}
    />
  );
};
