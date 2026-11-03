import React, { useId } from 'react';
import type { PolymorphicComponentProps } from '@entur/utils';
import { IconButton } from '@entur/button';
import { FacebookIcon, InstagramIcon, LinkedinIcon } from '@entur/icons';
import { Link } from '@entur/typography/beta';
import classNames from 'classnames';
import './Footer.scss';

// Unpacks fragments so each link gets its own list item; keys are prefixed to stay unique
const flattenChildren = (
  children: React.ReactNode,
  prefix = '',
): { key: string; child: React.ReactNode }[] =>
  React.Children.toArray(children).flatMap((child, index) => {
    const key = `${prefix}${
      React.isValidElement(child) && child.key != null ? child.key : index
    }`;
    if (React.isValidElement(child) && child.type === React.Fragment) {
      return flattenChildren(
        (child.props as { children?: React.ReactNode }).children,
        `${key}-`,
      );
    }
    return [{ key, child }];
  });

const ENTUR_DESCRIPTION =
  'Entur gjør det enklere å reise kollektivt i hele Norge.';

const socialMediaLinks = [
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/entur.org/',
    Icon: FacebookIcon,
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/entur_as/',
    Icon: InstagramIcon,
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/entur-as/',
    Icon: LinkedinIcon,
  },
];

export type FooterOwnProps = {
  /** Bruker kontrastvarianten. Velg variant etter produktets visuelle uttrykk.
   * Inne i en `Contrast`-wrapper er footeren alltid kontrast.
   * @default false
   */
  contrast?: boolean;
  /** Skjuler Entur-ikonene for sosiale medier i subfooteren */
  hideSocialMedia?: boolean;
  /** Tilgjengelig navn på listen med sosiale medier
   * @default "Entur i sosiale medier"
   */
  socialMediaLabel?: string;
  /** `Footer.Brand`, `Footer.LinkGroup` og `Footer.Column` */
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

export type FooterBrandOwnProps = {
  /** Produktbeskrivelse på én til to setninger
   * @default "Entur gjør det enklere å reise kollektivt i hele Norge."
   */
  description?: React.ReactNode;
  /** Logoen, for eksempel `<Logo productName="Navn" />` fra `@entur/menu` */
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

export type FooterColumnOwnProps = {
  /** En eller flere `Footer.LinkGroup` som skal stables i samme kolonne */
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

export type FooterLinkGroupOwnProps = {
  /** Overskrift for lenkegruppen. Brukes også som navn på navigasjonen. */
  heading: React.ReactNode;
  /** Overskriftsnivå. Velg det som passer dokumentstrukturen på siden.
   * @default "h2"
   */
  headingLevel?: 'h2' | 'h3' | 'h4';
  /** Lenkene i gruppen. Hvert element blir et punkt i en liste. */
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

const defaultFooterElement = 'footer';
const defaultBrandElement = 'div';
const defaultColumnElement = 'div';
const defaultLinkGroupElement = 'nav';

export type FooterProps<
  T extends React.ElementType = typeof defaultFooterElement,
> = PolymorphicComponentProps<T, FooterOwnProps>;

export type FooterBrandProps<
  T extends React.ElementType = typeof defaultBrandElement,
> = PolymorphicComponentProps<T, FooterBrandOwnProps>;

export type FooterColumnProps<
  T extends React.ElementType = typeof defaultColumnElement,
> = PolymorphicComponentProps<T, FooterColumnOwnProps>;

export type FooterLinkGroupProps<
  T extends React.ElementType = typeof defaultLinkGroupElement,
> = PolymorphicComponentProps<T, FooterLinkGroupOwnProps>;

type FooterRootComponent = (<
  E extends React.ElementType = typeof defaultFooterElement,
>(
  props: FooterProps<E> & { ref?: React.Ref<Element> },
) => React.ReactElement | null) & { displayName?: string };

type FooterBrandComponent = (<
  E extends React.ElementType = typeof defaultBrandElement,
>(
  props: FooterBrandProps<E> & { ref?: React.Ref<Element> },
) => React.ReactElement | null) & { displayName?: string };

type FooterColumnComponent = (<
  E extends React.ElementType = typeof defaultColumnElement,
>(
  props: FooterColumnProps<E> & { ref?: React.Ref<Element> },
) => React.ReactElement | null) & { displayName?: string };

type FooterLinkGroupComponent = (<
  E extends React.ElementType = typeof defaultLinkGroupElement,
>(
  props: FooterLinkGroupProps<E> & { ref?: React.Ref<Element> },
) => React.ReactElement | null) & { displayName?: string };

const FooterRoot: FooterRootComponent = React.forwardRef(
  <E extends React.ElementType = typeof defaultFooterElement>(
    {
      contrast = false,
      hideSocialMedia = false,
      socialMediaLabel = 'Entur i sosiale medier',
      children,
      className,
      as,
      ...rest
    }: FooterProps<E>,
    ref?: React.Ref<Element>,
  ) => {
    const Element: React.ElementType = as || defaultFooterElement;
    return (
      <Element
        ref={ref}
        className={classNames(
          'eds-footer',
          { 'eds-footer--contrast eds-contrast': contrast },
          className,
        )}
        {...rest}
      >
        <div className="eds-footer__content">{children}</div>
        <div className="eds-footer__subfooter">
          <p className="eds-footer__legal">
            <span>© {new Date().getFullYear()} Entur AS</span>
            <Link
              className="eds-footer__subfooter-link"
              href="https://entur.no"
            >
              Entur.no
            </Link>
          </p>
          {!hideSocialMedia && (
            <ul className="eds-footer__social" aria-label={socialMediaLabel}>
              {socialMediaLinks.map(({ label, href, Icon }) => (
                <li key={href}>
                  <IconButton
                    as="a"
                    href={href}
                    size="small"
                    aria-label={label}
                  >
                    <Icon />
                  </IconButton>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Element>
    );
  },
);

// Exported for the docs props generator only; not part of the package API
export const FooterBrand: FooterBrandComponent = React.forwardRef(
  <E extends React.ElementType = typeof defaultBrandElement>(
    {
      description = ENTUR_DESCRIPTION,
      children,
      className,
      as,
      ...rest
    }: FooterBrandProps<E>,
    ref?: React.Ref<Element>,
  ) => {
    const Element: React.ElementType = as || defaultBrandElement;
    return (
      <Element
        ref={ref}
        className={classNames('eds-footer__brand', className)}
        {...rest}
      >
        {children}
        <p className="eds-footer__description">{description}</p>
      </Element>
    );
  },
);

export const FooterColumn: FooterColumnComponent = React.forwardRef(
  <E extends React.ElementType = typeof defaultColumnElement>(
    { children, className, as, ...rest }: FooterColumnProps<E>,
    ref?: React.Ref<Element>,
  ) => {
    const Element: React.ElementType = as || defaultColumnElement;
    return (
      <Element
        ref={ref}
        className={classNames('eds-footer__column', className)}
        {...rest}
      >
        {children}
      </Element>
    );
  },
);

export const FooterLinkGroup: FooterLinkGroupComponent = React.forwardRef(
  <E extends React.ElementType = typeof defaultLinkGroupElement>(
    {
      heading,
      headingLevel = 'h2',
      children,
      className,
      as,
      ...rest
    }: FooterLinkGroupProps<E>,
    ref?: React.Ref<Element>,
  ) => {
    const Element: React.ElementType = as || defaultLinkGroupElement;
    const Heading = headingLevel;
    const headingId = `eds-footer-link-group${useId()}`;
    return (
      <Element
        ref={ref}
        className={classNames('eds-footer__link-group', className)}
        aria-labelledby={headingId}
        {...rest}
      >
        <Heading id={headingId} className="eds-footer__heading">
          {heading}
        </Heading>
        <ul className="eds-footer__links">
          {flattenChildren(children).map(({ key, child }) => (
            <li key={key}>{child}</li>
          ))}
        </ul>
      </Element>
    );
  },
);

export type FooterComponent = typeof FooterRoot & {
  Brand: typeof FooterBrand;
  Column: typeof FooterColumn;
  LinkGroup: typeof FooterLinkGroup;
};

/**
 * Footer for Entur-produkter. Subfooteren med copyright, lenke til entur.no og
 * Enturs sosiale medier er lik i alle produkter og kan ikke endres.
 */
export const Footer: FooterComponent = Object.assign(FooterRoot, {
  Brand: FooterBrand,
  Column: FooterColumn,
  LinkGroup: FooterLinkGroup,
});

Footer.displayName = 'Footer';
FooterBrand.displayName = 'Footer.Brand';
FooterColumn.displayName = 'Footer.Column';
FooterLinkGroup.displayName = 'Footer.LinkGroup';
