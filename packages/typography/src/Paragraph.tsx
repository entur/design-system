import React from 'react';
import classNames from 'classnames';

export type ParagraphProps = {
  /** HTML-elementet eller React-komponenten som rendres */
  as?: string | React.ElementType;
  /** Ekstra klassenavn */
  className?: string;
  /** Innholdet */
  children: React.ReactNode;
  /** Hvor du vil ha marginer */
  margin?: 'bottom' | 'none';
  [key: string]: any;
};

export const Paragraph: React.FC<ParagraphProps> = ({
  as: Element = 'p',
  margin = 'bottom',
  className,
  ...rest
}) => (
  <Element
    className={classNames(
      'eds-paragraph',
      {
        [`eds-paragraph--margin-bottom`]: margin === 'bottom',
        [`eds-paragraph--margin-none`]: margin === 'none',
      },
      className,
    )}
    {...rest}
  />
);
