import React from 'react';
import classNames from 'classnames';
import { PolymorphicComponentProps } from '@entur/utils';
import { ExternalIcon } from '@entur/icons';

export type LinkOwnProps = {
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

export type LinkProps<T extends React.ElementType = typeof defaultElement> =
  PolymorphicComponentProps<T, LinkOwnProps>;

const defaultElement = 'a';

export const Link = <E extends React.ElementType = typeof defaultElement>({
  external = false,
  ariaLabelExternalIcon = '(ekstern lenke)',
  className,
  margin = 'both',
  children,
  as,
  ...rest
}: LinkProps<E>): JSX.Element => {
  const Element: React.ElementType = as || defaultElement;
  return (
    <Element
      className={classNames(
        'eds-link',
        {
          [`eds-link--margin-top`]: margin === 'top',
          [`eds-link--margin-bottom`]: margin === 'bottom',
          [`eds-link--margin-none`]: margin === 'none',
        },
        className,
      )}
      {...rest}
    >
      {children}
      {external ? (
        <ExternalIcon
          className="eds-link--ext-icon"
          aria-label={ariaLabelExternalIcon}
        />
      ) : (
        <></>
      )}
    </Element>
  );
};
