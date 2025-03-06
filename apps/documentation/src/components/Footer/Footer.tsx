import React, { RefObject } from 'react';
import { Link } from 'gatsby';
import { IconButton } from '@entur/button';
import { GridContainer, GridItem } from '@entur/grid';
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  TwitterIcon,
} from '@entur/icons';
import { Heading3, LeadParagraph, Link as DSLink } from '@entur/typography';
import { colors, space } from '@entur/tokens/dist';

import { Logo } from '@components/Logo/Logo';
import { Theme, useSettings } from '@providers/SettingsContext';

import './Footer.scss';

const Footer = ({
  forceColorMode,
  footerRef,
}: {
  forceColorMode?: Theme;
  footerRef?: RefObject<HTMLDivElement>;
}) => {
  const year = new Date();
  const { colorMode } = useSettings();
  return (
    <div ref={footerRef} className="footer">
      <GridContainer spacing="extraLarge" className="footer__grid-container">
        <GridItem small={12} medium={6} large={4}>
          <LeadParagraph margin="none" className="footer__lead">
            Entur leverer digitale tjenester til Norges kollektivtransport.
          </LeadParagraph>
        </GridItem>
        <GridItem small={12} medium={6} large={4}>
          <Heading3 margin="bottom">Sidestruktur</Heading3>
          <LinkWrapper to="/kom-i-gang" className="footer__link">
            Kom i gang
          </LinkWrapper>
          <LinkWrapper to="/identitet" className="footer__link">
            Identitet
          </LinkWrapper>
          <LinkWrapper to="/komponenter" className="footer__link">
            Komponenter
          </LinkWrapper>
          <LinkWrapper to="/tokens" className="footer__link">
            Tokens
          </LinkWrapper>
          <LinkWrapper
            to="/identitet/introduksjon/stil-og-tone"
            className="footer__link"
          >
            Stil og tone
          </LinkWrapper>
          <LinkWrapper to="/universell-utforming" className="footer__link">
            Universell utforming
          </LinkWrapper>
        </GridItem>
        <GridItem small={12} medium={6} large={4}>
          <Heading3 margin="bottom">Informasjon</Heading3>
          <div className="footer__link">
            <LinkWrapper
              external
              href="https://entur.slack.com/archives/C899QSPB7"
            >
              #talk-designsystem på Slack
            </LinkWrapper>
          </div>
          <div className="footer__link">
            <LinkWrapper
              external
              href="https://uustatus.no/nb/erklaringer/publisert/7c5b8f79-7c24-4144-8084-afde897edded"
            >
              Tilgjengelighetserklæring
            </LinkWrapper>
          </div>
          <SocialMediaLinks />
        </GridItem>
      </GridContainer>
      <div className="footer__entur-banner">
        <Logo colorMode={forceColorMode || colorMode} />
        <div style={{ float: 'right', position: 'relative', top: '0.9rem' }}>
          <span
            className="eds-label"
            style={{
              borderRight: `1px solid ${colors.greys.grey70}`,
              paddingRight: space.small,
            }}
          >
            Entur.no
          </span>
          <span className="eds-label" style={{ paddingLeft: space.small }}>
            © {year.getFullYear()} Entur AS
          </span>
        </div>
      </div>
    </div>
  );
};

const SocialMediaLinks = ({ style }: { style?: React.CSSProperties }) => {
  return (
    <>
      <Heading3 style={style} margin="bottom">
        Følg oss på
      </Heading3>
      <div style={{ display: 'flex' }}>
        <IconButton
          as="a"
          style={{ width: 'unset', height: 'unset' }}
          href="https://www.facebook.com/entur.org/"
          aria-label="Entur på Facebook (ekstern lenke)"
        >
          <FacebookIcon size="24" />
        </IconButton>
        <IconButton
          as="a"
          style={{ width: 'unset', height: 'unset' }}
          href="https://www.instagram.com/entur_as/"
          aria-label="Entur på Instagram (ekstern lenke)"
        >
          <InstagramIcon size="24" />
        </IconButton>
        <IconButton
          as="a"
          style={{ width: 'unset', height: 'unset' }}
          href="https://twitter.com/entur_as"
          aria-label="Entur på Twitter (ekstern lenke)"
        >
          <TwitterIcon size="24" />
        </IconButton>
        <IconButton
          as="a"
          style={{ width: 'unset', height: 'unset' }}
          href="https://www.linkedin.com/company/entur-as"
          aria-label="Entur på LinkedIn (ekstern lenke)"
        >
          <LinkedinIcon size="24" />
        </IconButton>
      </div>
    </>
  );
};

function LinkWrapper(props: any) {
  return (
    <DSLink as={Link} {...props}>
      {props.children}
    </DSLink>
  );
}

export default Footer;
