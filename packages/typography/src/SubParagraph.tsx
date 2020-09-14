import React from 'react';
import classNames from 'classnames';

export type SubParagraphProps = {
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

export const SubParagraph: React.FC<SubParagraphProps> = ({
  as: Element = 'p',
  className,
  margin,
  ...rest
}) => (
  <Element
    className={classNames(
      'eds-sub-paragraph',
      {
        [`eds-sub-paragraph--margin-top`]: margin === 'top',
        [`eds-sub-paragraph--margin-bottom`]: margin === 'bottom',
        [`eds-sub-paragraph--margin-none`]: margin === 'none',
      },
      className,
    )}
    {...rest}
  />
);
