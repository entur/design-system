import React from 'react';
import classNames from 'classnames';
import { PolymorphicComponentProps } from '@entur/utils';
import { ExternalIcon } from '@entur/icons';

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
  /** Hvor du vil ha marginer
   * @default "both"
   */
  margin?: 'top' | 'bottom' | 'both' | 'none';
  ariaLabelExternalIcon?: string;
};

export type LinkPropsBeta<T extends React.ElementType = typeof defaultElement> =
  PolymorphicComponentProps<T, LinkOwnPropsBeta>;

const defaultElement = 'a';

export const LinkBeta = <E extends React.ElementType = typeof defaultElement>({
  external = false,
  ariaLabelExternalIcon = '(ekstern lenke)',
  className,
  margin = 'both',
  children,
  as,
  ...rest
}: LinkPropsBeta<E>): JSX.Element => {
  const Element: React.ElementType = as || defaultElement;
  return (
    <Element
      className={classNames(
        'eds-text--link',
        {
          [`eds-text--link--margin-top`]: margin === 'top',
          [`eds-text--link--margin-bottom`]: margin === 'bottom',
          [`eds-text--link--margin-none`]: margin === 'none',
        },
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
      ) : (
        <></>
      )}
    </Element>
  );
};
