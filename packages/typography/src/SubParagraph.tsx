import React from 'react';
import classNames from 'classnames';
import { PolymorphicComponentProps, Box } from '@entur/utils';

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
  E extends React.ElementType
> = PolymorphicComponentProps<E, SubParagraphOwnProps>;

const defaultElement = 'p';

export const SubParagraph = <
  E extends React.ElementType = typeof defaultElement
>({
  className,
  margin,
  ...rest
}: SubParagraphProps<E>): JSX.Element => (
  <Box
    as={defaultElement}
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
