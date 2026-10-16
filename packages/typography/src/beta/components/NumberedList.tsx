import React from 'react';
import classNames from 'classnames';
import { PolymorphicComponentProps } from '@entur/utils';
import { TypographySpacing } from '../types';
import { getSpacingClasses } from '../utils/utils';

import './text.scss';

/**
 * @beta Experimental component - may have breaking changes in future releases
 */
export type NumberedListOwnProps = {
  /** Ekstra klassenavn */
  className?: string;
  /** Innholdet */
  children?: React.ReactNode;
  /** Spacing around the component (same as Text and Heading components) */
  spacing?: TypographySpacing;
  /** List type (1, A, a, I, i) */
  type?: '1' | 'A' | 'a' | 'I' | 'i';
};

export type NumberedListProps<
  C extends React.ElementType = typeof defaultElement,
> = PolymorphicComponentProps<C, NumberedListOwnProps>;

export type NumberedListComponent = (<
  C extends React.ElementType = typeof defaultElement,
>(
  props: NumberedListProps<C> & { ref?: React.Ref<Element> },
) => React.ReactElement | null) & { displayName?: string };

const defaultElement = 'ol';

/**
 * @beta Experimental component - may have breaking changes in future releases
 */
export const NumberedList = React.forwardRef(
  <C extends React.ElementType = typeof defaultElement>(
    {
      type = '1',
      className,
      spacing,
      children,
      as,
      ...rest
    }: NumberedListProps<C>,
    ref?: React.Ref<Element>,
  ): JSX.Element => {
    const ListElement: React.ElementType = as || defaultElement;

    return (
      <ListElement
        ref={ref}
        className={classNames(
          'eds-text--numbered-list',
          `eds-text--numbered-list--type-${type}`,
          getSpacingClasses(spacing, 'eds-text'),
          className,
        )}
        type={type}
        {...rest}
      >
        {children}
      </ListElement>
    );
  },
) as NumberedListComponent;
NumberedList.displayName = 'NumberedList';
