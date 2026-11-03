import React, { RefObject } from 'react';
import classNames from 'classnames';
import { EmailIcon, FigmaIcon, GithubIcon } from '@entur/icons';
import { Link as GatsbyLink } from 'gatsby';
import { Link } from '@entur/typography/beta';
import { Footer as EnturFooter } from '@entur/layout/beta';
import { Logo } from '@entur/menu';

import { useConsent } from '@providers/ConsentProvider';

import './Footer.scss';

const Footer = ({
  footerRef,
  contrast,
  className,
  ...rest
}: {
  footerRef?: RefObject<HTMLElement>;
  contrast?: boolean;
} & React.ComponentPropsWithoutRef<'footer'>) => {
  const { openBanner, canOpenBanner } = useConsent();
  return (
    <EnturFooter
      ref={footerRef}
      contrast={contrast}
      className={classNames('footer', className)}
      {...rest}
    >
      <EnturFooter.Brand description="Entur Linje er designsystemet til Entur. Det hjelper designere og utviklere å bygge konsistente digitale tjenester.">
        <Logo productName="Linje" />
      </EnturFooter.Brand>
      <EnturFooter.LinkGroup heading="Om nettstedet">
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
            Endre hvilken informasjon vi får lagre
          </Link>
        )}
      </EnturFooter.LinkGroup>
      <EnturFooter.LinkGroup heading="Kontakt og ressurser">
        <Link href="https://entur.slack.com/archives/C899QSPB7">
          Slack (krever innlogging)
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
      </EnturFooter.LinkGroup>
    </EnturFooter>
  );
};

export default Footer;
