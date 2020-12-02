import React from 'react';
import classNames from 'classnames';
import { PolymorphicComponentProps, Box } from '@entur/utils';

export type LabelOwnProps = {
  /** HTML-elementet eller React-komponenten som rendres
   * @default "label"
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

export type LabelProps<E extends React.ElementType> = PolymorphicComponentProps<
  E,
  LabelOwnProps
>;

const defaultElement = 'label';

export const Label = <E extends React.ElementType = typeof defaultElement>({
  className,
  margin = 'both',
  ...rest
}: LabelProps<E>): JSX.Element => (
  <Box
    as={defaultElement}
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
