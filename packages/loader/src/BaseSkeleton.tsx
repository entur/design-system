import React from 'react';
import classNames from 'classnames';
import './BaseSkeleton.scss';

type BaseSkeletonProps = {
  /** Ekstra klassenavn */
  className?: string;
  style: React.CSSProperties;
  [key: string]: any;
};

export const BaseSkeleton: React.FC<BaseSkeletonProps> = ({
  className,
  style,
  ...rest
}) => {
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
