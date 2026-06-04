import React from 'react';
import classNames from 'classnames';
import './ButtonGroup.scss';

export type ButtonGroupProps = {
  /** To eller flere Button-komponenter */
  children: React.ReactNode;
  /** Ekstra klassenavn */
  className?: string;
  /** HTML-elementet eller React-komponenten som lages
   * @default "div"
   */
  as?: string | React.ElementType;
  [key: string]: any;
};

export const ButtonGroup = ({
  as: Element = 'div',
  className,
  ...rest
}: ButtonGroupProps) => {
  return (
    <Element className={classNames('eds-button-group', className)} {...rest} />
  );
};
