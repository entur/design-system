import React from 'react';
import classNames from 'classnames';

export type LabelProps = {
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

export const Label: React.FC<LabelProps> = ({
  as: Element = 'label',
  className,
  margin = 'both',
  ...rest
}) => (
  <Element
    className={classNames(
      'eds-label',
      {
        [`eds-label--margin-top`]: margin === 'top',
        [`eds-label--margin-bottom`]: margin === 'bottom',
        [`eds-label--margin-none`]: margin === 'none',
      },
      className,
    )}
    {...rest}
  />
);
