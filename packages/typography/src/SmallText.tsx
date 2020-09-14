import React from 'react';
import classNames from 'classnames';

export type SmallTextProps = {
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

export const SmallText: React.FC<SmallTextProps> = ({
  as: Element = 'span',
  className,
  margin = 'both',
  ...rest
}) => (
  <Element
    className={classNames(
      'eds-small-text',
      {
        [`eds-small-text--margin-top`]: margin === 'top',
        [`eds-small-text--margin-bottom`]: margin === 'bottom',
        [`eds-small-text--margin-none`]: margin === 'none',
      },
      className,
    )}
    {...rest}
  />
);
