import React from 'react';
import classNames from 'classnames';
import { PolymorphicComponentProps } from '@entur/utils';
import { TypographySpacing } from '../types';
import { getSpacingClasses } from '../utils/utils';

import './text.scss';

/**
 * @beta Experimental component - may have breaking changes in future releases
 */
export type UnorderedListOwnProps = {
  /** Ekstra klassenavn */
  className?: string;
  /** Innholdet */
  children?: React.ReactNode;
  /** Spacing around the component (same as Text and Heading components) */
  spacing?: TypographySpacing;
};

export type UnorderedListProps<
  C extends React.ElementType = typeof defaultElement,
> = PolymorphicComponentProps<C, UnorderedListOwnProps>;

export type UnorderedListComponent = (<
  C extends React.ElementType = typeof defaultElement,
>(
  props: UnorderedListProps<C> & { ref?: React.Ref<Element> },
) => React.ReactElement | null) & { displayName?: string };

const defaultElement = 'ul';

/**
 * @beta Experimental component - may have breaking changes in future releases
 */
export const UnorderedList = React.forwardRef(
  <C extends React.ElementType = typeof defaultElement>(
    { className, spacing, children, as, ...rest }: UnorderedListProps<C>,
    ref?: React.Ref<Element>,
  ): JSX.Element => {
    const ListElement: React.ElementType = as || defaultElement;

    return (
      <ListElement
        ref={ref}
        className={classNames(
          'eds-text--unordered-list',
          getSpacingClasses(spacing, 'eds-text'),
          className,
        )}
        {...rest}
      >
        {children}
      </ListElement>
    );
  },
) as UnorderedListComponent;
UnorderedList.displayName = 'UnorderedList';
