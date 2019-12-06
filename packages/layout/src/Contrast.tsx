import React from 'react';
import classNames from 'classnames';

export type ContrastProps = {
  /** HTML-elementet eller React-komponenten som rendres
   * @default 'div'
   */
  as?: string | React.ElementType;
  /** Ekstra klassenavn */
  className?: string;
  [key: string]: any;
};

export const Contrast: React.FC<ContrastProps> = ({
  as: Element = 'div',
  className,
  ...rest
}) => {
  return (
    <Element className={classNames('eds-contrast', className)} {...rest} />
  );
};
