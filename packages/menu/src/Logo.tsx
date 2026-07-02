import React from 'react';
import classNames from 'classnames';
import { PolymorphicComponentPropsWithRef, PolymorphicRef } from '@entur/utils';
import './Logo.scss';

export type LogoOwnProps = {
  /** Produktnavnet som vises etter Entur-logoen (f.eks. "Tavla", "Partner") */
  productName?: string;
  /** Størrelsen på logoen
   * @default 'medium'
   */
  size?: 'medium' | 'small';
  /** URL-en logoen lenker til. Gjør at komponenten rendres som en lenke */
  href?: string;
  /** HTML-elementet eller React-komponenten som brukes
   * @default 'div' (eller 'a' hvis href er satt)
   */
  as?: React.ElementType;
  /** Ekstra klassenavn */
  className?: string;
  children?: never;
};

export type LogoProps<T extends React.ElementType = typeof defaultElement> =
  PolymorphicComponentPropsWithRef<T, LogoOwnProps>;

export type LogoComponent = <
  E extends React.ElementType = typeof defaultElement,
>(
  props: LogoProps<E>,
) => React.ReactElement | null;

const defaultElement = 'div';

export const Logo: LogoComponent = React.forwardRef(
  <E extends React.ElementType = typeof defaultElement>(
    {
      productName,
      size = 'medium',
      href,
      as,
      className,
      ...rest
    }: LogoProps<E>,
    ref: PolymorphicRef<E>,
  ) => {
    const Element: React.ElementType = as || (href ? 'a' : defaultElement);

    return (
      <Element
        className={classNames('eds-logo', `eds-logo--${size}`, className)}
        ref={ref}
        href={typeof Element !== 'string' || Element === 'a' ? href : undefined}
        {...rest}
      >
        <EnturSvgLogo
          className="eds-logo__svg"
          label={productName ? `Entur ${productName} logo` : 'Entur logo'}
        />
        {productName && (
          <span className="eds-logo__product-name" aria-hidden="true">
            {productName}
          </span>
        )}
      </Element>
    );
  },
);

const EnturSvgLogo: React.FC<{ className?: string; label: string }> = ({
  className,
  label,
}) => (
  <svg
    className={className}
    viewBox="0 0 68.625 20.8254"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label={label}
    focusable="false"
  >
    {/* E */}
    <polygon
      className="eds-logo__entur-letter"
      points="10.422 14.49 10.422 12.036 2.707 12.036 2.707 8.533 9.552 8.533 9.552 6.079 2.707 6.079 2.707 2.455 10.422 2.455 10.422 0 0 0 0 14.49"
    />
    {/* n */}
    <polygon
      className="eds-logo__entur-letter"
      points="13.495 0 13.205 0 13.205 14.49 15.912 14.49 15.912 5.881 25.212 14.49 25.502 14.49 25.502 0 22.794 0 22.794 8.77"
    />
    {/* Red bar under EN */}
    <polygon
      className="eds-logo__entur-bar"
      points="25.501 17.824 0 17.824 0 20.052 25.501 20.052"
    />
    {/* T */}
    <polygon
      className="eds-logo__entur-letter"
      points="32.607 8.532 32.607 20.567 35.313 20.567 35.313 8.532 39.354 8.532 39.354 6.077 28.546 6.077 28.546 8.532"
    />
    {/* U */}
    <path
      className="eds-logo__entur-letter"
      d="M50.935 6.076v8.651c0 .726-.116 1.326-.348 1.802-.232.475-.519.85-.861 1.127-.341.278-.708.469-1.102.574-.392.107-.744.158-1.053.158-.309 0-.661-.051-1.054-.158-.393-.105-.76-.296-1.101-.574-.343-.277-.629-.652-.861-1.127-.232-.476-.348-1.076-.348-1.802v-8.651H41.5v8.651c0 .924.144 1.762.435 2.515.289.751.699 1.389 1.227 1.918.529.53 1.168.938 1.916 1.23.746.288 1.577.435 2.493.435.928 0 1.765-.147 2.513-.435.747-.292 1.384-.7 1.914-1.23.529-.529.935-1.167 1.218-1.918.284-.753.425-1.591.425-2.515v-8.651z"
    />
    {/* R */}
    <path
      className="eds-logo__entur-letter"
      d="M56.734 6.076v14.49h2.708v-4.612h2.679l3.277 4.612h3.227l-3.524-4.869c.438-.12.843-.328 1.211-.624.368-.296.678-.65.93-1.059.252-.41.448-.869.59-1.376.142-.507.214-1.033.214-1.573 0-.726-.121-1.397-.36-2.01-.238-.614-.57-1.141-.997-1.583-.425-.442-.939-.784-1.54-1.028-.503-.247-1.165-.369-1.888-.369zm2.708 2.456h3.083c.501 0 .929.065 1.281.198.354.13.642.309.866.533.227.225.394.489.503.792.108.304.163.632.163.991 0 .303-.038.603-.116.899-.076.298-.22.566-.433.802-.211.239-.501.43-.866.574-.368.145-.832.218-1.398.218h-3.083z"
    />
  </svg>
);
