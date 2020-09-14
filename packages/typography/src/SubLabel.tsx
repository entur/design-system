import React from 'react';
import classNames from 'classnames';

export type SubLabelProps = {
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

export const SubLabel: React.FC<SubLabelProps> = ({
  as: Element = 'span',
  className,
  margin = 'both',
  ...rest
}) => (
  <Element
    className={classNames(
      'eds-sub-label',
      {
        [`eds-sub-label--margin-top`]: margin === 'top',
        [`eds-sub-label--margin-bottom`]: margin === 'bottom',
        [`eds-sub-label--margin-none`]: margin === 'none',
      },
      className,
    )}
    {...rest}
  />
);
