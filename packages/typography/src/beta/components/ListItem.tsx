import React from 'react';
import classNames from 'classnames';
import { PolymorphicComponentProps } from '@entur/utils';
import { TypographySpacing } from '../types';
import { getSpacingClasses } from '../utils/utils';

import './text.scss';

/**
 * @beta Experimental component - may have breaking changes in future releases
 */
export type ListItemOwnProps = {
  /** Ekstra klassenavn */
  className?: string;
  /** Innholdet */
  children?: React.ReactNode;
  /** Spacing around the component (same as Text and Heading components) */
  spacing?: TypographySpacing;
  /** Tittel */
  title?: React.ReactNode;
};

export type ListItemProps<C extends React.ElementType = typeof defaultElement> =
  PolymorphicComponentProps<C, ListItemOwnProps>;

export type ListItemComponent = (<
  C extends React.ElementType = typeof defaultElement,
>(
  props: ListItemProps<C> & { ref?: React.Ref<Element> },
) => React.ReactElement | null) & { displayName?: string };

const defaultElement = 'li';

/**
 * @beta Experimental component - may have breaking changes in future releases
 */
export const ListItem = React.forwardRef(
  <C extends React.ElementType = typeof defaultElement>(
    { title, className, spacing, children, as, ...rest }: ListItemProps<C>,
    ref?: React.Ref<Element>,
  ): JSX.Element => {
    const ItemElement: React.ElementType = as || defaultElement;

    return (
      <ItemElement
        ref={ref}
        className={classNames(
          'eds-text--list-item',
          getSpacingClasses(spacing, 'eds-text'),
          className,
        )}
        {...rest}
      >
        {title && (
          <span className="eds-text--list-item__title eds-text--weight-bold">
            {title}
          </span>
        )}
        {children}
      </ItemElement>
    );
  },
) as ListItemComponent;
ListItem.displayName = 'ListItem';
