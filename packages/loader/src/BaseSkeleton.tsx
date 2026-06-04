import React from 'react';
import classNames from 'classnames';
import './BaseSkeleton.scss';

type BaseSkeletonProps = {
  /** Ekstra klassenavn */
  className?: string;
  style: React.CSSProperties;
  [key: string]: any;
};

export const BaseSkeleton = ({
  className,
  style,
  ...rest
}: BaseSkeletonProps) => {
  return (
    <div
      className={classNames('eds-skeleton', 'eds-skeleton--animate', className)}
      role="alert"
      aria-busy={true}
      aria-live="polite"
      style={style}
      {...rest}
    />
  );
};
