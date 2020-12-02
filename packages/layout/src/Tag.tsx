import React from 'react';
import classNames from 'classnames';
import './Tag.scss';
import { Box, PolymorphicComponentProps } from '@entur/utils';

export type TagOwnProps = {
  /** HTML-elementet eller React-komponenten som rendres
   * @default 'div'
   */
  as?: string | React.ElementType;
  /** Ekstra klassenavn */
  className?: string;
  /**Mindre og mer kompakt Tag, til f.eks. tabellbruk
   * @default false
   */
  compact?: boolean;
  children: React.ReactNode;
};

export type TagProps<E extends React.ElementType> = PolymorphicComponentProps<
  E,
  TagOwnProps
>;

const defaultElement = 'div';

export const Tag = <E extends React.ElementType = typeof defaultElement>({
  className,
  children,
  compact,
  ...rest
}: TagProps<E>): JSX.Element => {
  const childrenArray = React.Children.toArray(children);
  const hasLeadingIcon =
    childrenArray.length > 1 && typeof childrenArray[0] !== 'string';
  const hasTrailingIcon =
    childrenArray.length > 1 &&
    typeof childrenArray[childrenArray.length - 1] !== 'string';

  return (
    <Box
      as={defaultElement}
      className={classNames('eds-tag', className, {
        'eds-tag--leading-icon': hasLeadingIcon,
        'eds-tag--trailing-icon': hasTrailingIcon,
        'eds-tag--compact': compact,
      })}
      {...rest}
    >
      {children}
    </Box>
  );
};
