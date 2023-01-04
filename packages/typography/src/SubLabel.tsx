import React from 'react';
import classNames from 'classnames';
import { PolymorphicComponentProps } from '@entur/utils';

export type SubLabelOwnProps = {
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

export type SubLabelProps<T extends React.ElementType = typeof defaultElement> =
  PolymorphicComponentProps<T, SubLabelOwnProps>;

const defaultElement = 'span';

export const SubLabel = <E extends React.ElementType = typeof defaultElement>({
  className,
  margin = 'both',
  as,
  ...rest
}: SubLabelProps<E>): JSX.Element => {
  const Element: React.ElementType = as || defaultElement;
  return (
    <Element
      className={classNames(
        'eds-sub-label',
        {
          [`eds-sub-label--margin-top`]: margin === 'top',
          [`eds-sub-label--margin-bottom`]: margin === 'bottom',
          [`eds-sub-label--margin-none`]: margin === 'none',
        },
        className,
      )}
      {...rest}
    />
  );
};
