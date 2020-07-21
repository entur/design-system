import React from 'react';
import { Heading3, Heading4, SubParagraph, Link } from '@entur/typography';
import { Link as DoczLink } from 'docz';
import { FacebookIcon, TwitterIcon } from '@entur/icons';
import logo from './EnturLogo.svg';
import './FrontPageFooter.scss';

function FrontPageFooter() {
  return (
    <div className="front-page-footer">
      <div className="front-page-footer__grid">
        <div className="front-page-footer__logo-container">
          <img src={logo} height="32" alt="Entur logo"></img>
        </div>

        <div>
          <Heading3>Entur AS</Heading3>
          <SubParagraph>
            Rådhusgate 5, 0151 Oslo <br />
            Postboks 1554 Vika, 0117 Oslo
            <br />
            <br />
            <Link as="a" href="mailto:post@entur.org">
              post@entur.org
            </Link>
          </SubParagraph>
        </div>
        <div>
          <Heading3>Kontakt</Heading3>
          <SubParagraph>
            Slack (#talk-designsystem) <br />
            <Link as="a" href="mailto:long.ngo@entur.org">
              Kontakt designansvarlig
            </Link>
          </SubParagraph>
        </div>
        <div className="front-page-footer__structure">
          <Heading3>Sidestruktur</Heading3>
          <Heading4 margin="none">
            <DoczLinkWrapper to="/kom-i-gang/om-entur">
              Om Entur
            </DoczLinkWrapper>
          </Heading4>
          <Heading4 margin="none">
            <DoczLinkWrapper to="/kom-i-gang/for-utviklere/bidra">
              Hvordan bidra?
            </DoczLinkWrapper>
          </Heading4>
          <Heading4 margin="none">
            <Link href="https://share.goabstract.com/ecd2091b-ba8a-4fe6-9997-622265c6db64?sha=94121e0337062ce5a223384edef977dd0dfd22a5">
              Sketch UI-Library
            </Link>
          </Heading4>
          <Heading4 margin="none">
            <Link href="https://bitbucket.org/enturas/design-system/src/master/">
              Bitbucket
            </Link>
          </Heading4>
          <Heading4 margin="none">
            <Link href="https://entur.no/">Entur.no</Link>
          </Heading4>
          <div style={{ marginTop: '2rem', display: 'flex' }}>
            <a
              href="https://www.facebook.com/entur.org/"
              className="front-page-footer__circular-icon"
            >
              <FacebookIcon />
            </a>
            <a
              href="https://twitter.com/Entur_AS"
              className="front-page-footer__circular-icon"
            >
              <TwitterIcon />
            </a>
          </div>
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
