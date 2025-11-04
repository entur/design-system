import React from 'react';
import classNames from 'classnames';
import { PolymorphicComponentProps } from '@entur/utils';
import { ExternalIcon } from '@entur/icons';
import { TypographySpacing } from '../types';
import { getSpacingClasses } from '../utils/utils';

import './text.scss';

/**
 * @beta Experimental component - may have breaking changes in future releases
 */
type LinkBaseProps = {
  external?: boolean;

  /** Ekstra klassenavn */
  className?: string;
  /** Innholdet */
  children: React.ReactNode;
  /** Spacing around the component (same as Text and Heading components) */
  spacing?: TypographySpacing;
  ariaLabelExternalIcon?: string;
};

export type LinkProps<C extends React.ElementType> = PolymorphicComponentProps<
  C,
  LinkBaseProps
>;

/**
 * @beta Experimental component - may have breaking changes in future releases
 */
export const Link = <C extends React.ElementType = 'a'>({
  external = false,
  ariaLabelExternalIcon = '(ekstern lenke)',
  className,
  spacing,
  children,
  as,
  ...rest
}: LinkProps<C>): JSX.Element => {
  const LinkElement: React.ElementType = as || 'a';
  return (
    <LinkElement
      className={classNames(
        'eds-text',
        'eds-text--link',
        getSpacingClasses(spacing, 'eds-text--link'),
        className,
      )}
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
};
