import classNames from 'classnames';
import React from 'react';
import './LoadingDots.scss';

export type LoadingDotsProps = {
  color: 'blue' | 'white';
  size?: any;
};

export const LoadingDots = ({ color = 'blue', size = 16 }) => {
  return (
    <div
      className={classNames(
        'eds-loading-dots',
        `eds-loading-dots--color-${color}`,
      )}
      style={{ fontSize: size }}
    >
      <LoadingDot dotNumber="one" />
      <LoadingDot dotNumber="two" />
      <LoadingDot dotNumber="three" />
    </div>
  );
};

type LoadingDotProps = {
  dotNumber: string;
};

const LoadingDot: React.FC<LoadingDotProps> = ({ dotNumber }) => {
  return (
    <span
      className={classNames(
        'eds-loading-dots__dot',
        `eds-loading-dots__dot--${dotNumber}`,
      )}
    />
  );
};
