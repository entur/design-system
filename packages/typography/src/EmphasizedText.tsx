import React from 'react';
import classNames from 'classnames';
import { Box, PolymorphicComponentProps } from '@entur/utils';

export type EmphasizedTextOwnProps = {
  /** HTML-elementet eller React-komponenten som rendres
   * @default "em"
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

export type EmphasizedTextProps<
  E extends React.ElementType
> = PolymorphicComponentProps<E, EmphasizedTextOwnProps>;

const defaultElement = 'em';

export const EmphasizedText = <
  E extends React.ElementType = typeof defaultElement
>({
  className,
  margin = 'both',
  ...rest
}: EmphasizedTextProps<E>): JSX.Element => (
  <Box
    as={defaultElement}
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
