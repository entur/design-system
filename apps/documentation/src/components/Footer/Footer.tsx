import React, { RefObject } from 'react';
import classNames from 'classnames';
import {
  CookieFilledIcon,
  EmailIcon,
  FigmaIcon,
  GithubIcon,
} from '@entur/icons';
import { Link as GatsbyLink } from 'gatsby';
import { Heading, Link, Text } from '@entur/typography/beta';
import { Flex } from '@entur/layout/beta';
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
  const { openBanner, canOpenBanner } = useConsent();
  return (
    <footer
      ref={footerRef}
      className={classNames('footer', className, { 'eds-contrast': contrast })}
      {...rest}
    >
      <div className="footer__grid-container">
        <div>
          <Logo />
          <Text spacing={{ top: 'm' }}>
            Entur Linje er designsystemet til Entur. Det hjelper designere og
            utviklere å bygge konsistente digitale tjenester.
          </Text>
        </div>
        <Flex
          as="nav"
          aria-label="Om nettstedet"
          direction="column"
          align="start"
          gap="m"
        >
          <Heading as="h3" variant="subtitle-1">
            Om nettstedet
          </Heading>
          <Link href="https://uustatus.no/nb/erklaringer/publisert/7c5b8f79-7c24-4144-8084-afde897edded">
            Tilgjengelighetserklæring
          </Link>
          <Link as={GatsbyLink} to="/personvern">
            Personvern
          </Link>
          {/* Hidden when the consent solution is unreachable, since it could not do
              anything. The privacy link above explains the situation. */}
          {canOpenBanner && (
            <Link as="button" type="button" onClick={() => openBanner()}>
              <CookieFilledIcon inline aria-hidden="true" /> Endre hvilken
              informasjon vi får lagre
            </Link>
          )}
        </Flex>
        <Flex direction="column" align="start" gap="m">
          <Heading as="h3" variant="subtitle-1">
            Kontakt og ressurser
          </Heading>
          <Link href="https://entur.slack.com/archives/C899QSPB7">
            #talk-designsystem på Slack
          </Link>
          <Link href="mailto:teamdesignsystem@entur.org">
            <EmailIcon inline aria-hidden="true" /> teamdesignsystem@entur.org
          </Link>
          <Link href="https://github.com/entur/design-system">
            <GithubIcon inline aria-hidden="true" /> GitHub
          </Link>
          <Link href="https://www.figma.com/files/911324992315480847/team/903289363381269328">
            <FigmaIcon inline aria-hidden="true" /> Figma (krever innlogging)
          </Link>
        </Flex>
      </div>
      <div className="footer__entur-banner">
        <Text as="span" variant="label">
          © {new Date().getFullYear()} Entur AS
        </Text>
      </div>
    </footer>
  );
};

export default Footer;
