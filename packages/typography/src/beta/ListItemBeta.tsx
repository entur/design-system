import React from 'react';
import classNames from 'classnames';
import { PolymorphicComponentProps } from '@entur/utils';
import { TypographySpacing } from './types';
import { getSpacingClasses } from './utils';

type ListItemBaseProps = {
  /** Ekstra klassenavn */
  className?: string;
  /** Innholdet */
  children: React.ReactNode;
  /** Tittel */
  title?: React.ReactNode;
  /** Spacing around the component (same as Text and Heading components) */
  spacing?: TypographySpacing;
};

export type ListItemBetaProps<C extends React.ElementType> =
  PolymorphicComponentProps<C, ListItemBaseProps>;

export const ListItemBeta = <C extends React.ElementType = 'li'>({
  children,
  className,
  title,
  spacing,
  as,
  ...rest
}: ListItemBetaProps<C>): JSX.Element => {
  const ItemElement: React.ElementType = as || 'li';

  return (
    <ItemElement
      className={classNames(
        'eds-text--list-item',
        getSpacingClasses(spacing, 'eds-text--list-item'),
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
};
