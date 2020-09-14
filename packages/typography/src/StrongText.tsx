import React from 'react';
import classNames from 'classnames';

export type StrongTextProps = {
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

export const StrongText: React.FC<StrongTextProps> = ({
  as: Element = 'strong',
  className,
  margin = 'both',
  ...rest
}) => (
  <Element
    className={classNames(
      'eds-strong-text',
      {
        [`eds-strong-text--margin-top`]: margin === 'top',
        [`eds-strong-text--margin-bottom`]: margin === 'bottom',
        [`eds-strong-text--margin-none`]: margin === 'none',
      },
      className,
    )}
    {...rest}
  />
);
