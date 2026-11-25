import React from 'react';
import classNames from 'classnames';
import { PolymorphicComponentProps, forwardRefPolymorphic } from '@entur/utils';
import { TypographySpacingProps } from '../types';
import { getSpacingStyle } from '../utils/utils';

import './text.scss';

/**
 * @beta Experimental component - may have breaking changes in future releases
 */
export type LinkOwnProps = TypographySpacingProps & {
  /** Ekstra klassenavn */
  className?: string;
  /** Innholdet */
  children?: React.ReactNode;
};

export type LinkProps<C extends React.ElementType = typeof defaultElement> =
  PolymorphicComponentProps<C, LinkOwnProps>;

export type LinkComponent = (<
  C extends React.ElementType = typeof defaultElement,
>(
  props: LinkProps<C> & { ref?: React.Ref<Element> },
) => React.ReactElement | null) & { displayName?: string };

const defaultElement = 'a';

/**
 * @beta Experimental component - may have breaking changes in future releases
 */
export const Link = forwardRefPolymorphic<LinkComponent>(
  <C extends React.ElementType = typeof defaultElement>(
    { className, spacing, style, children, as, ...rest }: LinkProps<C>,
    ref?: React.Ref<Element>,
  ): React.JSX.Element => {
    const LinkElement: React.ElementType = as || defaultElement;

    return (
      <LinkElement
        ref={ref}
        className={classNames('eds-text--link', className)}
        style={getSpacingStyle(spacing, style)}
        {...rest}
      >
        {children}
      </LinkElement>
    );
  },
);
Link.displayName = 'Link';
