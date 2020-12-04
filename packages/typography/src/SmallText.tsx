import React from 'react';
import classNames from 'classnames';
import { PolymorphicComponentProps, Box } from '@entur/utils';

export type SmallTextOwnProps = {
  /** HTML-elementet eller React-komponenten som rendres
   * @default "span"
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

export type SmallTextProps<
  E extends React.ElementType
> = PolymorphicComponentProps<E, SmallTextOwnProps>;

const defaultElement = 'span';

export const SmallText = <E extends React.ElementType = typeof defaultElement>({
  className,
  margin = 'both',
  ...rest
}: SmallTextProps<E>): JSX.Element => (
  <Box
    as={defaultElement}
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
