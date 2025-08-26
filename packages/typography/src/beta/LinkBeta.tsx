import React from 'react';
import classNames from 'classnames';
import { PolymorphicComponentProps } from '@entur/utils';
import { ExternalIcon } from '@entur/icons';
import { TypographySpacing } from './types';
import { getSpacingClasses } from './utils';

export type LinkOwnPropsBeta = {
  external?: boolean;
  /** HTML-elementet eller React-komponenten som rendres
   * @default "a"
   */
  as?: string | React.ElementType;
  /** Ekstra klassenavn */
  className?: string;
  /** Innholdet */
  children: React.ReactNode;
  /** Spacing around the component (same as Text and Heading components) */
  spacing?: TypographySpacing;
  ariaLabelExternalIcon?: string;
};

export type LinkPropsBeta<T extends React.ElementType = typeof defaultElement> =
  PolymorphicComponentProps<T, LinkOwnPropsBeta>;

const defaultElement = 'a';

export const LinkBeta = <E extends React.ElementType = typeof defaultElement>({
  external = false,
  ariaLabelExternalIcon = '(ekstern lenke)',
  className,
  spacing,
  children,
  as,
  ...rest
}: LinkPropsBeta<E>): JSX.Element => {
  const Element: React.ElementType = as || defaultElement;
  return (
    <Element
      className={classNames(
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
    </Element>
  );
};
