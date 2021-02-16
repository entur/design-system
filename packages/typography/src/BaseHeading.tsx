import React from 'react';
import classNames from 'classnames';
import { PolymorphicPropsWithoutRef } from '@entur/utils';

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
const defaultElement = 'h1';

export type BaseHeadingProps<
  T extends React.ElementType = typeof defaultElement
> = PolymorphicPropsWithoutRef<BaseHeadingOwnProps, T>;

export const BaseHeading = <
  E extends React.ElementType = typeof defaultElement
>({
  className,
  level,
  margin,
  as,
  ...rest
}: BaseHeadingProps<E>) => {
  const Element: React.ElementType = as || defaultElement;
  const baseClass = `eds-h${level}`;
  return (
    <Element
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
