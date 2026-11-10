import React, { useId } from 'react';
import { IconButton } from '@entur/button';
import { FacebookIcon, InstagramIcon, LinkedinIcon } from '@entur/icons';
import { Link } from '@entur/typography/beta';
// Package entry, so the beta bundle does not duplicate Logo and its styles
import { Logo } from '@entur/menu';
import classNames from 'classnames';
import './Footer.scss';

// Unpacks fragments so each link gets its own list item; prefixes keep nested keys unique
const toListItems = (
  children: React.ReactNode,
  prefix = '',
): React.ReactNode[] =>
  React.Children.toArray(children).flatMap((child, index) => {
    const key = `${prefix}${React.isValidElement(child) ? child.key : index}`;
    return React.isValidElement(child) && child.type === React.Fragment
      ? toListItems(
          (child.props as { children?: React.ReactNode }).children,
          `${key}-`,
        )
      : [<li key={key}>{child}</li>];
  });

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
  /** Viser Enturs sosiale medier i subfooteren. Bruk det bare i tjenester for reisende og andre privatpersoner (B2C).
   * @default false
   */
  showSocialMedia?: boolean;
  /** Tilgjengelig navn på listen med sosiale medier
   * @default "Entur i sosiale medier"
   */
  socialMediaLabel?: string;
  /** `Footer.Brand` og en eller flere `Footer.LinkGroup` */
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

export type FooterBrandOwnProps = {
  /** Produktnavnet som vises etter Entur-logoen (f.eks. "Tavla", "Partner") */
  productName?: string;
  /** Tekst under logoen, for eksempel en kort beskrivelse, adresse eller organisasjonsnummer.
   * Ren tekst og elementer får riktig typografi. Hvert element blir en egen linje.
   */
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

export type FooterLinkGroupOwnProps = {
  /** Overskrift for lenkegruppen. Brukes også som navn på navigasjonen. */
  title: React.ReactNode;
  /** Lenkene i gruppen. Hvert element blir et punkt i en liste. */
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

export type FooterProps = FooterOwnProps &
  Omit<React.ComponentPropsWithoutRef<'footer'>, keyof FooterOwnProps>;

export type FooterBrandProps = FooterBrandOwnProps &
  Omit<React.ComponentPropsWithoutRef<'div'>, keyof FooterBrandOwnProps>;

export type FooterLinkGroupProps = FooterLinkGroupOwnProps &
  Omit<React.ComponentPropsWithoutRef<'nav'>, keyof FooterLinkGroupOwnProps>;

const FooterRoot = React.forwardRef<HTMLElement, FooterProps>(
  (
    {
      contrast = false,
      showSocialMedia = false,
      socialMediaLabel = 'Entur i sosiale medier',
      children,
      className,
      ...rest
    },
    ref,
  ) => {
    return (
      <footer
        ref={ref}
        className={classNames(
          'eds-footer',
          { 'eds-footer--contrast eds-contrast': contrast },
          className,
        )}
        {...rest}
      >
        <div className="eds-footer__inner">
          <div className="eds-footer__content">{children}</div>
          <div className="eds-footer__subfooter">
            <p className="eds-footer__legal">
              <span>© {new Date().getFullYear()} Entur AS</span>
              <Link
                className="eds-footer__subfooter-link"
                href="https://entur.no"
              >
                entur.no
              </Link>
            </p>
            {showSocialMedia && (
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
        </div>
      </footer>
    );
  },
);

// FooterBrand and FooterLinkGroup are exported for the docs props generator only
export const FooterBrand = React.forwardRef<HTMLDivElement, FooterBrandProps>(
  ({ productName, children, className, ...rest }, ref) => (
    <div
      ref={ref}
      className={classNames('eds-footer__brand', className)}
      {...rest}
    >
      <Logo productName={productName} size="small" />
      {children}
    </div>
  ),
);

export const FooterLinkGroup = React.forwardRef<
  HTMLElement,
  FooterLinkGroupProps
>(({ title, children, className, ...rest }, ref) => {
  const headingId = `eds-footer-link-group${useId()}`;
  return (
    <nav
      ref={ref}
      className={classNames('eds-footer__link-group', className)}
      aria-labelledby={headingId}
      {...rest}
    >
      <h2 id={headingId} className="eds-footer__heading">
        {title}
      </h2>
      <ul className="eds-footer__links">{toListItems(children)}</ul>
    </nav>
  );
});

export type FooterComponent = typeof FooterRoot & {
  Brand: typeof FooterBrand;
  LinkGroup: typeof FooterLinkGroup;
};

/**
 * Footer for Entur-produkter. Subfooteren med copyright og lenke til entur.no er lik
 * i alle produkter og kan ikke endres.
 */
export const Footer: FooterComponent = Object.assign(FooterRoot, {
  Brand: FooterBrand,
  LinkGroup: FooterLinkGroup,
});

Footer.displayName = 'Footer';
FooterBrand.displayName = 'Footer.Brand';
FooterLinkGroup.displayName = 'Footer.LinkGroup';
