import React from 'react';
import classNames from 'classnames';
import './TravelHeader.scss';

export type TravelHeaderProps = {
  /** HTML-elementet eller React-komponenten som lager elementet
   * @default 'div'
   */
  as?: string | React.ElementType;
  /** Destinasjonen man reiser fra */
  from: React.ReactNode;
  /** Destinasjonen man reiser til */
  to: React.ReactNode;
  /**Størrelsen på komponenten
   * @default 'large'
   */
  size?: 'large' | 'medium';
  /** Plassere til og fra på samme linje */
  noWrap?: boolean;
  /**Ekstra klassenavn */
  className?: string;
  [key: string]: any;
};

export const TravelHeader: React.FC<TravelHeaderProps> = ({
  as: Element = 'div',
  from,
  to,
  size = 'large',
  className,
  noWrap,
  ...rest
}) => {
  return (
    <Element
      className={classNames('eds-travel-header', className, {
        'eds-travel-header--large': size === 'large',
        'eds-travel-header--medium': size === 'medium',
        'eds-travel-header--no-wrap': noWrap,
      })}
      aria-label={`Fra ${from}, til ${to}`}
      {...rest}
    >
      <span className="eds-travel-header__from">{from}</span>
      <span className="eds-travel-header__to">{to}</span>
    </Element>
  );
};
