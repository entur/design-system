import React from 'react';
import classNames from 'classnames';
import { PolymorphicComponentProps } from '@entur/utils';
import { TypographySpacing } from './types';
import { getSpacingClasses } from './utils';

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

export type NumberedListBetaProps<C extends React.ElementType> =
  PolymorphicComponentProps<C, NumberedListBaseProps>;

export const NumberedListBeta = <C extends React.ElementType = 'ol'>({
  className,
  type = '1',
  spacing,
  as,
  children,
  ...rest
}: NumberedListBetaProps<C>): JSX.Element => {
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
