import React from 'react';
import {
  Heading3,
  Heading4,
  SubParagraph,
  Link,
  Label,
  LeadParagraph,
} from '@entur/typography';
import { Link as DoczLink } from 'docz';
import {
  FacebookIcon,
  TwitterIcon,
  InstagramIcon,
  LinkedinIcon,
} from '@entur/icons';
import { GridContainer, GridItem } from '@entur/grid';
import logo from './EnturLogo.svg';
import './FrontPageFooter.scss';
import Divider from './Divider';
import { IconButton } from '@entur/button';

function FrontPageFooter() {
  return (
    <div className="front-page-footer">
      <GridContainer
        spacing="extraLarge"
        className="front-page-footer__grid-container"
      >
        <GridItem small={6} medium={3}>
          <LeadParagraph>
            Entur leverer digitale <br /> tjenester til Norges <br />
            kollektivtransport.
          </LeadParagraph>
        </GridItem>
        <GridItem small={6} medium={3}>
          <Heading3>Sidestruktur</Heading3>
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
        <GridItem small={6} medium={3}>
          <Heading3>Kontakt</Heading3>
          <div className="front-page-footer__link">
            <Link href="">#talk-designsystem på Slack</Link>
          </div>
          <div className="front-page-footer__link">
            <Link href="">Send oss en email</Link>
          </div>
        </GridItem>
        <GridItem small={6} medium={3}>
          <Heading3>Følg oss på</Heading3>
          <div style={{ display: 'flex' }}>
            <IconButton as="a" style={{ width: 'unset', height: 'unset' }}>
              <FacebookIcon size="24" />
            </IconButton>
            <IconButton as="a" style={{ width: 'unset', height: 'unset' }}>
              <InstagramIcon size="24" />
            </IconButton>
            <IconButton as="a" style={{ width: 'unset', height: 'unset' }}>
              <TwitterIcon size="24" />
            </IconButton>
            <IconButton as="a" style={{ width: 'unset', height: 'unset' }}>
              <LinkedinIcon size="24" />
            </IconButton>
          </div>
        </GridItem>
      </GridContainer>
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
          <img src={logo} width="104px" />
        </div>
        <div style={{ float: 'right', padding: '2rem 0' }}>
          <Label>Entur.no</Label>
          <Label>© 2020 Entur AS</Label>
        </div>
      </div>
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
