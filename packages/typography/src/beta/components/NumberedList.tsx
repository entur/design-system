import React from 'react';
import classNames from 'classnames';
import { PolymorphicComponentProps } from '@entur/utils';
import { TypographySpacing } from '../types';
import { getSpacingClasses } from '../utils/utils';

import './text.scss';

/**
 * @beta Experimental component - may have breaking changes in future releases
 */
type NumberedListBaseProps = {
  /** Ekstra klassenavn */
  className?: string;
  /** Innholdet */
  children: React.ReactNode;
  /** List type (1, A, a, I, i) */
  type?: '1' | 'A' | 'a' | 'I' | 'i';
  /** Spacing around the component (same as Text and Heading components) */
  spacing?: TypographySpacing;
};

export type NumberedListProps<C extends React.ElementType> =
  PolymorphicComponentProps<C, NumberedListBaseProps>;

/**
 * @beta Experimental component - may have breaking changes in future releases
 */
export const NumberedList = <C extends React.ElementType = 'ol'>({
  className,
  type = '1',
  spacing,
  as,
  children,
  ...rest
}: NumberedListProps<C>): JSX.Element => {
  const ListElement: React.ElementType = as || 'ol';

  return (
    <ListElement
      className={classNames(
        'eds-text--numbered-list',
        { [`eds-text--numbered-list--type-${type}`]: type },
        getSpacingClasses(spacing, 'eds-text--numbered-list'),
        className,
      )}
      type={type}
      {...rest}
    >
      {children}
    </ListElement>
  );
};
