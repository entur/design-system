import React from 'react';
import classNames from 'classnames';
import { PolymorphicComponentProps } from '@entur/utils';
import { TypographySpacingProps } from '../types';
import { getSpacingStyle } from '../utils/utils';

import './text.scss';

/**
 * @beta Experimental component - may have breaking changes in future releases
 */
export type ListItemOwnProps = TypographySpacingProps & {
  /** Ekstra klassenavn */
  className?: string;
  /** Innholdet */
  children?: React.ReactNode;
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
    {
      title,
      className,
      spacing,
      style,
      children,
      as,
      ...rest
    }: ListItemProps<C>,
    ref?: React.Ref<Element>,
  ): JSX.Element => {
    const ItemElement: React.ElementType = as || defaultElement;

    return (
      <ItemElement
        ref={ref}
        className={classNames('eds-text--list-item', className)}
        style={getSpacingStyle(spacing, style)}
        {...rest}
      >
        {title && <span className="eds-text--list-item__title">{title}</span>}
        {children}
      </ItemElement>
    );
  },
) as ListItemComponent;
ListItem.displayName = 'ListItem';
