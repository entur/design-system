import React from 'react';
import classNames from 'classnames';
import { PolymorphicPropsWithoutRef } from '@entur/utils';

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
  E extends React.ElementType = typeof defaultElement
> = PolymorphicPropsWithoutRef<EmphasizedTextOwnProps, E>;

const defaultElement = 'em';

export const EmphasizedText = <
  E extends React.ElementType = typeof defaultElement
>({
  className,
  margin = 'both',
  as,
  ...rest
}: EmphasizedTextProps<E>) => {
  const Element: React.ElementType = as || defaultElement;
  return (
    <Element
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
};
