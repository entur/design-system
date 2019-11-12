import React from 'react';
import classNames from 'classnames';

type Props = {
  /** HTML-elementet eller React-komponenten som rendres */
  as?: string | React.ElementType;
  /** Ekstra klassenavn */
  className?: string;
  /** Innholdet */
  children: React.ReactNode;
  [key: string]: any;
};

export const PreformattedText: React.FC<Props> = ({
  as: Element = 'pre',
  className,
  ...rest
}) => (
  <Element
    className={classNames('eds-preformatted-text', className)}
    {...rest}
  />
);
