import React from 'react';
import classNames from 'classnames';
import { PolymorphicComponentProps, Box } from '@entur/utils';

export type LinkOwnProps = {
  /** HTML-elementet eller React-komponenten som rendres
   * @default "a"
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

export type LinkProps<E extends React.ElementType> = PolymorphicComponentProps<
  E,
  LinkOwnProps
>;

const defaultElement = 'a';

export const Link = <E extends React.ElementType = typeof defaultElement>({
  className,
  margin = 'both',
  ...rest
}: LinkProps<E>): JSX.Element => (
  <Box
    as={defaultElement}
    className={classNames(
      'eds-link',
      {
        [`eds-link--margin-top`]: margin === 'top',
        [`eds-link--margin-bottom`]: margin === 'bottom',
        [`eds-link--margin-none`]: margin === 'none',
      },
      className,
    )}
    {...rest}
  />
);
