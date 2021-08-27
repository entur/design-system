import React from 'react';
import classNames from 'classnames';
import { PolymorphicPropsWithoutRef } from '@entur/utils';

export type SubParagraphOwnProps = {
  /** HTML-elementet eller React-komponenten som rendres
   * @default "p"
   */
  as?: string | React.ElementType;
  /** Ekstra klassenavn */
  className?: string;
  /** Innholdet */
  children: React.ReactNode;
  /** Hvor du vil ha marginer
   * @default "both"
   */
  margin?: 'top' | 'bottom' | 'both' | 'none';
};

export type SubParagraphProps<
  E extends React.ElementType = typeof defaultElement,
> = PolymorphicPropsWithoutRef<SubParagraphOwnProps, E>;

const defaultElement = 'p';

export const SubParagraph = <
  E extends React.ElementType = typeof defaultElement,
>({
  className,
  margin,
  as,
  ...rest
}: SubParagraphProps<E>): JSX.Element => {
  const Element: React.ElementType = as || defaultElement;
  return (
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
};
