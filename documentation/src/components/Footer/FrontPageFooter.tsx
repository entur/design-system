import React from 'react';

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

import { Media } from '../../contexts/MediaBreakpoint';

import { useSettings } from '../../contexts/SettingsContext';

import './FrontPageFooter.scss';

const FrontPageFooter = () => {
  const year = new Date();
  //TODO: Images are missing
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
            <LinkWrapper to="/kom-i-gang">Kom i gang</LinkWrapper>
          </div>
          <div className="front-page-footer__link">
            <LinkWrapper to="/identitet">Identitet</LinkWrapper>
          </div>
          <div className="front-page-footer__link">
            <LinkWrapper to="/komponenter">Komponenter</LinkWrapper>
          </div>
          <div className="front-page-footer__link">
            <LinkWrapper to="/tokens">Tokens</LinkWrapper>
          </div>
          <div className="front-page-footer__link">
            <LinkWrapper to="/universell-utforming">
              Universell utforming
            </LinkWrapper>
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
            <LinkWrapper
              external
              href="https://uustatus.no/nb/erklaringer/publisert/7c5b8f79-7c24-4144-8084-afde897edded"
            >
              Tilgjengelighetserklæring
            </LinkWrapper>
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
            //src={colorMode === 'dark' ? logoDark : logo}
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

function LinkWrapper(props: any) {
  return (
    <Link as={Link} {...props}>
      {props.children}
    </Link>
  );
}

export default FrontPageFooter;
