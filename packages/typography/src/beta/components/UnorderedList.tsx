import React from 'react';
import classNames from 'classnames';
import { PolymorphicComponentProps } from '@entur/utils';
import { TypographySpacingProps } from '../types';
import { getSpacingStyle } from '../utils/utils';

import './text.scss';

/**
 * @beta Experimental component - may have breaking changes in future releases
 */
export type UnorderedListOwnProps = TypographySpacingProps & {
  /** Ekstra klassenavn */
  className?: string;
  /** Innholdet */
  children?: React.ReactNode;
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
    { className, spacing, style, children, as, ...rest }: UnorderedListProps<C>,
    ref?: React.Ref<Element>,
  ): JSX.Element => {
    const ListElement: React.ElementType = as || defaultElement;

    return (
      <ListElement
        ref={ref}
        className={classNames('eds-text--unordered-list', className)}
        style={getSpacingStyle(spacing, style)}
        // Safari drops list semantics when the list has no markers
        role="list"
        {...rest}
      >
        {children}
      </ListElement>
    );
  },
) as UnorderedListComponent;
UnorderedList.displayName = 'UnorderedList';
