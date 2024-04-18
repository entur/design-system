import React from 'react';
import { Link as DoczLink } from 'docz';

import { IconButton } from '@entur/button';
import { GridContainer, GridItem } from '@entur/grid';
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  TwitterIcon,
} from '@entur/icons';
import { Heading3, Label, LeadParagraph, Link } from '@entur/typography';
import { colors, space } from '@entur/tokens/dist';

import { Media } from '~/utils/MediaBreakpoint';
import logo from '~/components/logo.svg';
import logoDark from '~/components/logoDark.svg';

import { useSettings } from './SettingsContext';

import './FrontPageFooter.scss';

const FrontPageFooter = () => {
  const year = new Date();
  const { colorMode } = useSettings();
  return (
    <div className="front-page-footer">
      <GridContainer
        spacing="extraLarge"
        className="front-page-footer__grid-container"
      >
        <GridItem small={12} medium={6} large={3}>
          <LeadParagraph margin="none" className="front-page-footer__lead">
            Entur leverer digitale tjenester til Norges kollektivtransport.
          </LeadParagraph>
          <Media between={['desktop', 'wideDesktop']}>
            <SocialMediaLinks style={{ marginTop: '3rem' }} />
          </Media>
        </GridItem>
        <GridItem small={12} medium={3} large={3}>
          <Heading3 margin="bottom">Sidestruktur</Heading3>
          <div className="front-page-footer__link">
            <DoczLinkWrapper to="/kom-i-gang">Kom i gang</DoczLinkWrapper>
          </div>
          <div className="front-page-footer__link">
            <DoczLinkWrapper to="/identitet">Identitet</DoczLinkWrapper>
          </div>
          <div className="front-page-footer__link">
            <DoczLinkWrapper to="/komponenter">Komponenter</DoczLinkWrapper>
          </div>
          <div className="front-page-footer__link">
            <DoczLinkWrapper to="/tokens">Tokens</DoczLinkWrapper>
          </div>
          <div className="front-page-footer__link">
            <DoczLinkWrapper to="/universell-utforming">
              Universell utforming
            </DoczLinkWrapper>
          </div>
        </GridItem>
        <GridItem small={12} medium={3} large={3}>
          <Heading3 margin="bottom">Informasjon</Heading3>
          <div className="front-page-footer__link">
            <Link external href="https://entur.slack.com/archives/C899QSPB7">
              #talk-designsystem på Slack
            </Link>
          </div>
          <div className="front-page-footer__link">
            <Link
              external
              href="https://uustatus.no/nb/erklaringer/publisert/7c5b8f79-7c24-4144-8084-afde897edded"
            >
              Tilgjengelighetserklæring
            </Link>
          </div>
        </GridItem>
        <GridItem small={12} medium={6} large={3}>
          <Media greaterThanOrEqual="wideDesktop">
            <SocialMediaLinks />
          </Media>
          <Media lessThan="desktop">
            <SocialMediaLinks />
          </Media>
        </GridItem>
      </GridContainer>
      <div className="front-page-footer__entur-banner">
        <div>
          <img
            src={colorMode === 'dark' ? logoDark : logo}
            width="104px"
            alt="Entur sin logo"
          />
        </div>
        <div style={{ float: 'right', position: 'relative', top: '0.9rem' }}>
          <Label
            style={{
              borderRight: `1px solid ${colors.greys.grey70}`,
              paddingRight: space.small,
            }}
          >
            Entur.no
          </Label>
          <Label style={{ paddingLeft: space.small }}>
            © {year.getFullYear()} Entur AS
          </Label>
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

function DoczLinkWrapper(props: any) {
  return (
    <Link as={DoczLink} {...props}>
      {props.children}
    </Link>
  );
}

export default FrontPageFooter;
