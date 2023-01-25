import React from 'react';
import { Link as DoczLink } from 'docz';

import { VisuallyHidden } from '@entur/a11y/dist';
import { IconButton } from '@entur/button';
import { GridContainer, GridItem } from '@entur/grid';
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  TwitterIcon,
  ExternalIcon,
} from '@entur/icons';
import { Heading3, Label, LeadParagraph, Link } from '@entur/typography';
import { colors, space } from '@entur/tokens/dist';

import { Media } from '~/utils/MediaBreakpoint';

import logo from './EnturLogo.svg';

import './FrontPageFooter.scss';

const FrontPageFooter = () => {
  const year = new Date();
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
            <DoczLinkWrapper to="/universell-utforming">
              Universell utforming
            </DoczLinkWrapper>
          </div>
        </GridItem>
        <GridItem small={12} medium={3} large={3}>
          <Heading3 margin="bottom">Informasjon</Heading3>
          <div className="front-page-footer__link">
            <Link href="https://entur.slack.com/archives/C899QSPB7">
              #talk-designsystem på Slack&nbsp;
              <ExternalIcon />
            </Link>
          </div>
          <div className="front-page-footer__link">
            <Link href="https://uustatus.no/nb/erklaringer/publisert/7c5b8f79-7c24-4144-8084-afde897edded">
              Tilgjengelighetserklæring&nbsp;
              <ExternalIcon />
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
          <img src={logo} width="104px" alt="Entur sin logo" />
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
        >
          <VisuallyHidden>Link til Facebook</VisuallyHidden>
          <FacebookIcon size="24" />
        </IconButton>
        <IconButton
          as="a"
          style={{ width: 'unset', height: 'unset' }}
          href="https://www.instagram.com/entur_as/"
        >
          <VisuallyHidden>Link til Instagram</VisuallyHidden>
          <InstagramIcon size="24" />
        </IconButton>
        <IconButton
          as="a"
          style={{ width: 'unset', height: 'unset' }}
          href="https://twitter.com/entur_as"
        >
          <VisuallyHidden>Link til Twitter</VisuallyHidden>
          <TwitterIcon size="24" />
        </IconButton>
        <IconButton
          as="a"
          style={{ width: 'unset', height: 'unset' }}
          href="https://www.linkedin.com/company/entur-as"
        >
          <VisuallyHidden>Link til LinkedIn</VisuallyHidden>
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
