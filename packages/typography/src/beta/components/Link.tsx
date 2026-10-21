import React from 'react';
import classNames from 'classnames';
import { PolymorphicComponentProps } from '@entur/utils';
import { ExternalIcon } from '@entur/icons';
import { TypographySpacingProps } from '../types';
import { getSpacingStyle } from '../utils/utils';

import './text.scss';

/**
 * @beta Experimental component - may have breaking changes in future releases
 */
export type LinkOwnProps = TypographySpacingProps & {
  /** Viser et ikon som markerer at lenken går til en ekstern side */
  external?: boolean;
  /** Ekstra klassenavn */
  className?: string;
  /** Innholdet */
  children?: React.ReactNode;
  /** Skjermleserteksten til ikonet for eksterne lenker */
  ariaLabelExternalIcon?: string;
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
export const Link = React.forwardRef(
  <C extends React.ElementType = typeof defaultElement>(
    {
      external = false,
      ariaLabelExternalIcon = '(ekstern lenke)',
      className,
      spacing,
      style,
      children,
      as,
      ...rest
    }: LinkProps<C>,
    ref?: React.Ref<Element>,
  ): JSX.Element => {
    const LinkElement: React.ElementType = as || defaultElement;

    return (
      <LinkElement
        ref={ref}
        className={classNames('eds-text--link', className)}
        style={getSpacingStyle(spacing, style)}
        {...rest}
      >
        {children}
        {external ? (
          <ExternalIcon
            className="eds-text--link--ext-icon"
            aria-label={ariaLabelExternalIcon}
          />
        ) : null}
      </LinkElement>
    );
  },
) as LinkComponent;
Link.displayName = 'Link';
