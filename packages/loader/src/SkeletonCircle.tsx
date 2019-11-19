import React, { CSSProperties } from 'react';
import classNames from 'classnames';
import './Skeleton.scss';
import './SkeletonWrapper.scss';

type SkeletonCircleProps = {
  /** Ekstra klassenavn */
  className?: string;
  /** Høyde og bredde av sirkelen. 1rem som default */
  size: CSSProperties;
  [key: string]: any;
};

export const SkeletonCircle: React.FC<SkeletonCircleProps> = ({
  className,
  size,
  ...rest
}) => {
  return (
    <div
      className={classNames(
        'eds-skeleton',
        'eds-skeleton-animate',
        className,
        'eds-skeleton-circle',
      )}
      role="alert"
      aria-busy={true}
      aria-live="polite"
      style={{ width: size, height: size, ...rest.style }}
      {...rest}
    />
  );
};
