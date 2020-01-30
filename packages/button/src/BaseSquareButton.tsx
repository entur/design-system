import React from 'react';
import classNames from 'classnames';
import './BaseSquareButton.scss';

export type BaseSquareButtonProps = {
  /** Tekst og ikon */
  children: React.ReactNode;
  /** Ekstra klassenavn */
  className?: string;
  /** En type knapp */
  variant: 'success' | 'secondary';
  [key: string]: any;
};

export const BaseSquareButton: React.FC<BaseSquareButtonProps> = ({
  children,
  className,
  variant,
  disabled = false,
  as = 'button',
  ...rest
}) => {
  const Element = disabled ? 'button' : as;

  return (
    <Element
      className={classNames(
        'eds-square-button',
        { 'eds-square-button--success': variant === 'success' },
        { 'eds-square-button--secondary': variant === 'secondary' },
        className,
      )}
      {...rest}
    >
      {React.Children.map(children, child => {
        if (typeof child === 'string') {
          return <span className="eds-square-button__label">{child}</span>;
        }
        return <span className="eds-square-button__icon">{child}</span>;
      })}
    </Element>
  );
};
