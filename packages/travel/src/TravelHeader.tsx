import React from 'react';
import classNames from 'classnames';
import './TravelHeader.scss';

export type TravelHeaderProps = {
  from: string;
  to: string;
  size?: 'large' | 'medium';
  className?: string;
  [key: string]: any;
};

export const TravelHeader: React.FC<TravelHeaderProps> = ({
  from,
  to,
  size = 'large',
  className,
  ...rest
}) => {
  return (
    <div
      className={classNames('eds-travel-header', className, {
        'eds-travel-header--large': size === 'large',
        'eds-travel-header--medium': size === 'medium',
      })}
      {...rest}
    >
      <span className="eds-travel-header__from">{from}</span>
      <span className="eds-travel-header__bottom">
        <span className="eds-travel-header__line"></span>
        <span className="eds-travel-header__to">{to}</span>
      </span>
    </div>
  );
};
