import React, { RefObject } from 'react';
import classNames from 'classnames';
import {
  CookieFilledIcon,
  EmailIcon,
  FigmaIcon,
  GithubIcon,
} from '@entur/icons';
import { Link as GatsbyLink } from 'gatsby';
import { Heading3, Link } from '@entur/typography';
import { Logo } from '@entur/menu';

import { useConsent } from '@providers/ConsentProvider';

import './Footer.scss';

const Footer = ({
  footerRef,
  className,
  contrast,
  ...rest
}: {
  footerRef?: RefObject<HTMLElement>;
  contrast?: boolean;
} & React.ComponentPropsWithoutRef<'footer'>) => {
  const { openBanner } = useConsent();
  return (
    <footer
      ref={footerRef}
      className={classNames('footer', className, { 'eds-contrast': contrast })}
      {...rest}
    >
      <div className="footer__grid-container">
        <div>
          <Logo />
          <p className="footer__description">
            Entur Linje er designsystemet til Entur. Det hjelper designere og
            utviklere å bygge konsistente digitale tjenester.
          </p>
        </div>
        <nav aria-label="Om nettstedet">
          <Heading3 margin="bottom">Om nettstedet</Heading3>
          <Link
            href="https://uustatus.no/nb/erklaringer/publisert/7c5b8f79-7c24-4144-8084-afde897edded"
            className="footer__link"
          >
            Tilgjengelighetserklæring
          </Link>
          <Link as={GatsbyLink} to="/personvern" className="footer__link">
            Personvern
          </Link>
          <Link
            as="button"
            type="button"
            onClick={() => openBanner()}
            className="footer__link"
          >
            <CookieFilledIcon inline aria-hidden="true" /> Endre hvilken
            informasjon vi får lagre
          </Link>
        </nav>
        <div>
          <Heading3 margin="bottom">Kontakt og ressurser</Heading3>
          <Link
            href="https://entur.slack.com/archives/C899QSPB7"
            className="footer__link"
          >
            #talk-designsystem på Slack
          </Link>
          <Link
            href="mailto:teamdesignsystem@entur.org"
            className="footer__link"
          >
            <EmailIcon inline aria-hidden="true" /> teamdesignsystem@entur.org
          </Link>
          <Link
            href="https://github.com/entur/design-system"
            className="footer__link"
          >
            <GithubIcon inline aria-hidden="true" /> GitHub
          </Link>
          <Link
            href="https://www.figma.com/files/911324992315480847/team/903289363381269328"
            className="footer__link"
          >
            <FigmaIcon inline aria-hidden="true" /> Figma (krever innlogging)
          </Link>
        </div>
      </div>
      <div className="footer__entur-banner">
        <span className="eds-label">© {new Date().getFullYear()} Entur AS</span>
      </div>
    </footer>
  );
};

export default Footer;
