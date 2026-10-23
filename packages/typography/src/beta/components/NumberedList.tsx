import React from 'react';
import classNames from 'classnames';
import { PolymorphicComponentProps } from '@entur/utils';
import { TypographySpacingProps } from '../types';
import { getSpacingStyle } from '../utils/utils';

import './text.scss';

/**
 * @beta Experimental component - may have breaking changes in future releases
 */
export type NumberedListOwnProps = TypographySpacingProps & {
  /** Ekstra klassenavn */
  className?: string;
  /** Innholdet */
  children?: React.ReactNode;
  /** List type (1, A, a, I, i) */
  type?: '1' | 'A' | 'a' | 'I' | 'i';
  /** `steps` viser numrene i merker, for steg-for-steg-instruksjoner
   * @default 'default'
   */
  variant?: 'default' | 'steps';
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
      variant = 'default',
      className,
      spacing,
      style,
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
          { 'eds-text--steps': variant === 'steps' },
          className,
        )}
        type={type}
        // Safari drops list semantics when the list has no markers
        role={variant === 'steps' ? 'list' : undefined}
        style={getSpacingStyle(spacing, style)}
        {...rest}
      >
        {children}
      </ListElement>
    );
  },
) as NumberedListComponent;
NumberedList.displayName = 'NumberedList';
