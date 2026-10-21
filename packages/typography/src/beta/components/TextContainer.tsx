import React from 'react';
import classNames from 'classnames';
import { PolymorphicComponentProps } from '@entur/utils';
import { TypographySpacingProps } from '../types';
import { getSpacingStyle } from '../utils/utils';

import './text-container.scss';

/**
 * @beta Experimental component - may have breaking changes in future releases
 */
export type TextContainerOwnProps = TypographySpacingProps & {
  /** Ekstra klassenavn */
  className?: string;
  /** Overskrifter, avsnitt, lister og annen løpende tekst */
  children?: React.ReactNode;
};

export type TextContainerProps<
  C extends React.ElementType = typeof defaultElement,
> = PolymorphicComponentProps<C, TextContainerOwnProps>;

export type TextContainerComponent = (<
  C extends React.ElementType = typeof defaultElement,
>(
  props: TextContainerProps<C> & { ref?: React.Ref<Element> },
) => React.ReactElement | null) & { displayName?: string };

const defaultElement = 'div';

/**
 * Gir løpende tekst riktig avstand mellom overskrifter, avsnitt og lister
 * @beta Experimental component - may have breaking changes in future releases
 */
export const TextContainer = React.forwardRef(
  <C extends React.ElementType = typeof defaultElement>(
    { className, spacing, style, children, as, ...rest }: TextContainerProps<C>,
    ref?: React.Ref<Element>,
  ): JSX.Element => {
    const ContainerElement: React.ElementType = as || defaultElement;

    return (
      <ContainerElement
        ref={ref}
        className={classNames('eds-text-container', className)}
        style={getSpacingStyle(spacing, style)}
        {...rest}
      >
        {children}
      </ContainerElement>
    );
  },
) as TextContainerComponent;
TextContainer.displayName = 'TextContainer';
