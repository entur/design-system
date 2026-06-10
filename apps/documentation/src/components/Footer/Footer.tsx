import React, { RefObject } from 'react';
import { Link } from 'gatsby';
import classNames from 'classnames';
import { IconButton } from '@entur/button';
import { FacebookIcon, InstagramIcon, LinkedinIcon } from '@entur/icons';
import { Link as DSLink, Heading3 } from '@entur/typography';

import { Logo } from '@components/Logo/Logo';
import { Theme, useSettings } from '@providers/SettingsContext';

import './Footer.scss';

const Footer = ({
  forceColorMode,
  footerRef,
  className,
  contrast,
  ...rest
}: {
  footerRef?: RefObject<HTMLElement>;
  contrast?: boolean;
} & React.ComponentPropsWithoutRef<'footer'>) => {
  const { colorMode } = useSettings();
  return (
    <footer
      ref={footerRef}
      className={classNames('footer', className, { 'eds-contrast': contrast })}
      {...rest}
    >
      <div className="footer__grid-container">
        <div>
          <Logo colorMode={contrast ? "dark" : colorMode} />
          <p className="footer__description">
            Entur Linje er designsystemet til Entur. Det hjelper designere og
            utviklere å bygge konsistente digitale tjenester.
          </p>
          <div className="footer__social">
            <IconButton
              as="a"
              href="https://www.facebook.com/entur.org/"
              aria-label="Entur på Facebook (ekstern lenke)"
            >
              <FacebookIcon size="24" />
            </IconButton>
            <IconButton
              as="a"
              href="https://www.instagram.com/entur_as/"
              aria-label="Entur på Instagram (ekstern lenke)"
            >
              <InstagramIcon size="24" />
            </IconButton>
            <IconButton
              as="a"
              href="https://www.linkedin.com/company/entur-as"
              aria-label="Entur på LinkedIn (ekstern lenke)"
            >
              <LinkedinIcon size="24" />
            </IconButton>
          </div>
        </div>
        <nav aria-label="Om nettstedet">
          <Heading3 margin="bottom">Om nettstedet</Heading3>
          <DSLink as={Link} to="/kom-i-gang" className="footer__link">
            Kom i gang
          </DSLink>
          <DSLink as={Link} to="/identitet" className="footer__link">
            Identitet
          </DSLink>
          <DSLink as={Link} to="/komponenter" className="footer__link">
            Komponenter
          </DSLink>
          <DSLink as={Link} to="/tokens" className="footer__link">
            Tokens
          </DSLink>
          <DSLink as={Link} to="/universell-utforming" className="footer__link">
            Universell utforming
          </DSLink>
          <DSLink
            href="https://uustatus.no/nb/erklaringer/publisert/7c5b8f79-7c24-4144-8084-afde897edded"
            className="footer__link"
          >
            Tilgjengelighetserklæring
          </DSLink>
        </nav>
        <div>
          <Heading3 margin="bottom">Kom i kontakt med oss</Heading3>
          <DSLink
            href="https://entur.slack.com/archives/C899QSPB7"
            className="footer__link"
          >
            #talk-designsystem på Slack
          </DSLink>
          <DSLink
            href="https://github.com/entur/design-system"
            className="footer__link"
          >
            GitHub
          </DSLink>
          <DSLink
            href="mailto:teamdesignsystem@entur.org"
            className="footer__link"
          >
            teamdesignsystem@entur.org
          </DSLink>
        </div>
      </div>
      <div className="footer__entur-banner">
        <span className="eds-label footer__entur-banner__item">Entur.no</span>
        <span className="eds-label">© {new Date().getFullYear()} Entur AS</span>
      </div>
    </footer>
  );
};

export default Footer;
