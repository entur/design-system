import React from 'react';
import classNames from 'classnames';
import { PolymorphicComponentProps } from '@entur/utils';
import { TypographySpacing } from '../types';
import { getSpacingClasses } from '../utils/utils';

import './text.scss';

/**
 * @beta Experimental component - may have breaking changes in future releases
 */
type UnorderedListBaseProps = {
  /** Ekstra klassenavn */
  className?: string;
  /** Innholdet */
  children: React.ReactNode;
  /** Spacing around the component (same as Text and Heading components) */
  spacing?: TypographySpacing;
};

export type UnorderedListProps<C extends React.ElementType> =
  PolymorphicComponentProps<C, UnorderedListBaseProps>;

/**
 * @beta Experimental component - may have breaking changes in future releases
 */
export const UnorderedList = <C extends React.ElementType = 'ul'>({
  className,
  spacing,
  as,
  children,
  ...rest
}: UnorderedListProps<C>): JSX.Element => {
  const ListElement: React.ElementType = as || 'ul';

  return (
    <ListElement
      className={classNames(
        'eds-text--unordered-list',
        getSpacingClasses(spacing, 'eds-text--unordered-list'),
        className,
      )}
      {...rest}
    >
      {children}
    </ListElement>
  );
};
