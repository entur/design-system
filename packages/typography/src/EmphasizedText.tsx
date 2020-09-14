import React from 'react';
import classNames from 'classnames';

export type EmphasizedTextProps = {
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

export const EmphasizedText: React.FC<EmphasizedTextProps> = ({
  as: Element = 'em',
  className,
  margin = 'both',
  ...rest
}) => (
  <Element
    className={classNames(
      'eds-emphasized-text',
      {
        [`eds-emphasized-text--margin-top`]: margin === 'top',
        [`eds-emphasized-text--margin-bottom`]: margin === 'bottom',
        [`eds-emphasized-text--margin-none`]: margin === 'none',
      },
      className,
    )}
    {...rest}
  />
);
