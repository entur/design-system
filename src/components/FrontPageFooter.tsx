import React from 'react';
import {
  Heading3,
  Heading4,
  SubParagraph,
  Link,
  Label,
} from '@entur/typography';
import { Link as DoczLink } from 'docz';
import { FacebookIcon, TwitterIcon } from '@entur/icons';
import { GridContainer, GridItem } from '@entur/grid';
import logo from './EnturLogo.svg';
import './FrontPageFooter.scss';
import Divider from './Divider';

function FrontPageFooter() {
  return (
    <div className="front-page-footer">
      <GridContainer>
        <GridItem medium={3}></GridItem>
        <GridItem medium={3}>
          <Heading3>Sidestruktur</Heading3>
          <div>
            <DoczLinkWrapper to="/kom-i-gang">Kom i gang</DoczLinkWrapper>
          </div>
          <div>
            <DoczLinkWrapper to="/stil-og-tone">Stil og tone</DoczLinkWrapper>
          </div>
          <div>
            <DoczLinkWrapper to="/visuell-identitet">
              Visuell identitet
            </DoczLinkWrapper>
          </div>
          <div>
            <DoczLinkWrapper to="/komponenter">Komponenter</DoczLinkWrapper>
          </div>
          <div>
            <DoczLinkWrapper to="/universell-utforming">
              Universell utforming
            </DoczLinkWrapper>
          </div>
        </GridItem>
        <GridItem medium={3}>
          <Heading3>Kontakt</Heading3>
          <div>
            <Link href="">#talk-designsystem på Slack</Link>
          </div>
          <div>
            <Link href="">Send oss en email</Link>
          </div>
        </GridItem>
        <GridItem medium={3}>
          <Heading3>Følg oss på</Heading3>
        </GridItem>
      </GridContainer>
      <Divider></Divider>

      <div>
        <img src={logo} />
        <div style={{ float: 'right' }}>
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
