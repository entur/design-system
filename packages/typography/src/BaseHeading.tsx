import React from 'react';
import classNames from 'classnames';
import { PolymorphicComponentProps, Box } from '@entur/utils';

type BaseHeadingOwnProps = {
  /** HTML-elementet eller React-komponenten som rendres */
  as: string | React.ElementType;
  /** Ekstra klassenavn */
  className?: string;
  /** Innholdet */
  children: React.ReactNode;
  /** Hvor du vil ha marginer */
  margin: 'top' | 'bottom' | 'both' | 'none';
  /** Nivået på overskriften  */
  level: 1 | 2 | 3 | 4 | 5 | 6;
};

export type BaseHeadingProps<
  E extends React.ElementType
> = PolymorphicComponentProps<E, BaseHeadingOwnProps>;

const defaultElement = 'h1';

export const BaseHeading = <
  E extends React.ElementType = typeof defaultElement
>({
  className,
  level,
  margin,
  ...rest
}: BaseHeadingProps<E>): JSX.Element => {
  const baseClass = `eds-h${level}`;

  return (
    <Box
      as={defaultElement}
      className={classNames(
        baseClass,
        {
          [`${baseClass}--margin-top`]: margin === 'top',
          [`${baseClass}--margin-bottom`]: margin === 'bottom',
          [`${baseClass}--margin-none`]: margin === 'none',
        },
        className,
      )}
      {...rest}
    />
  );
};
