import React from 'react';
import classNames from 'classnames';

export type LinkProps = {
  /** HTML-elementet eller React-komponenten som rendres */
  as?: string | React.ElementType;
  /** Ekstra klassenavn */
  className?: string;
  /** Innholdet */
  children: React.ReactNode;
  /** Hvor du vil ha marginer
   * @default "both"
   */
  margin?: 'top' | 'bottom' | 'both' | 'none';
  [key: string]: any;
};

export const Link: React.FC<LinkProps> = ({
  as: Element = 'a',
  className,
  margin = 'both',
  ...rest
}) => (
  <Element
    className={classNames(
      'eds-link',
      {
        [`eds-link--margin-top`]: margin === 'top',
        [`eds-link--margin-bottom`]: margin === 'bottom',
        [`eds-link--margin-none`]: margin === 'none',
      },
      className,
    )}
    {...rest}
  />
);
