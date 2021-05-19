import { VisuallyHidden } from '@entur/a11y/dist';
import { IconButton } from '@entur/button';
import { GridContainer, GridItem } from '@entur/grid';
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  TwitterIcon,
} from '@entur/icons';
import { Heading3, Label, LeadParagraph, Link } from '@entur/typography';
import { Link as DoczLink } from 'docz';
import React from 'react';
import Divider from './Divider';
import logo from './EnturLogo.svg';
import { Media } from '~/utils/MediaBreakpoint';
import './FrontPageFooter.scss';

function FrontPageFooter() {
  return (
    <div className="front-page-footer">
      <GridContainer
        spacing="extraLarge"
        className="front-page-footer__grid-container"
      >
        <GridItem small={12} className="front-page-footer__mobile-item">
          <Media at="mobile">
            <img src={logo} width="104px" alt="Entur sin logo" />
          </Media>
        </GridItem>
        <GridItem small={12} medium={6} large={3}>
          <LeadParagraph margin="none" className="front-page-footer__lead">
            Entur leverer digitale tjenester til Norges kollektivtransport.
          </LeadParagraph>
        </GridItem>
        <GridItem small={12} medium={6} large={3}>
          <Heading3 margin="bottom">Sidestruktur</Heading3>
          <div className="front-page-footer__link">
            <DoczLinkWrapper to="/kom-i-gang">Kom i gang</DoczLinkWrapper>
          </div>
          <div className="front-page-footer__link">
            <DoczLinkWrapper to="/stil-og-tone">Stil og tone</DoczLinkWrapper>
          </div>
          <div className="front-page-footer__link">
            <DoczLinkWrapper to="/visuell-identitet">
              Visuell identitet
            </DoczLinkWrapper>
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
        <GridItem small={12} medium={3}>
          <Heading3 margin="bottom">Kontakt</Heading3>
          <div className="front-page-footer__link">
            <Link href="">#talk-designsystem på Slack</Link>
          </div>
          <div className="front-page-footer__link">
            <Link href="">Send oss en email</Link>
          </div>
        </GridItem>
        <GridItem small={12} medium={3}>
          <Heading3 margin="bottom">Følg oss på</Heading3>
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
        </GridItem>
      </GridContainer>
      <Media greaterThanOrEqual="desktop">
        <Divider></Divider>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            maxWidth: '1328px',
            margin: '0 auto',
          }}
        >
          <div style={{ padding: '2rem 0' }}>
            <img src={logo} width="104px" alt="Entur sin logo" />
          </div>
          <div style={{ float: 'right', padding: '2rem 0' }}>
            <Label>Entur.no</Label>
            <Label>© 2020 Entur AS</Label>
          </div>
        </div>
      </Media>
    </div>
  );
}
function DoczLinkWrapper(props: any) {
  return (
    <Link as={DoczLink} {...props}>
      {props.children}
    </Link>
  );
}
export default FrontPageFooter;
