import React from 'react';
import classNames from 'classnames';
import { PolymorphicPropsWithoutRef } from '@entur/utils';

export type ParagraphOwnProps = {
  /** HTML-elementet eller React-komponenten som rendres
   * @default "p"
   */
  as?: string | React.ElementType;
  /** Ekstra klassenavn */
  className?: string;
  /** Innholdet */
  children: React.ReactNode;
  /** Hvor du vil ha marginer
   * @default "bottom"
   */
  margin?: 'bottom' | 'none';
};

export type ParagraphProps<
  E extends React.ElementType = typeof defaultElement
> = PolymorphicPropsWithoutRef<ParagraphOwnProps, E>;

const defaultElement = 'p';

export const Paragraph = <E extends React.ElementType = typeof defaultElement>({
  margin = 'bottom',
  className,
  as,
  ...rest
}: ParagraphProps<E>) => {
  const Element: React.ElementType = as || defaultElement;
  return (
    <Element
      className={classNames(
        'eds-paragraph',
        {
          'eds-paragraph--margin-bottom': margin === 'bottom',
          'eds-paragraph--margin-none': margin === 'none',
        },
        className,
      )}
      {...rest}
    />
  );
};
