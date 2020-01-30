import React from 'react';
import { Heading3, Heading4, SubParagraph, Link } from '@entur/typography';
import { Link as DoczLink } from 'docz';
import logo from './EnturLogo.svg';
import './FrontPageFooter.scss';

function FrontPageFooter() {
  return (
    <div className="front-page-footer">
      <div className="front-page-footer__grid">
        <div className="front-page-footer__logo-container">
          <img src={logo} height="32"></img>
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
            <DoczLinkWrapper to="/kom-i-gang/bidra">
              Hvordan bidra?
            </DoczLinkWrapper>
          </Heading4>
          <Heading4
            as={Link}
            margin="none"
            href="https://share.goabstract.com/ecd2091b-ba8a-4fe6-9997-622265c6db64?sha=94121e0337062ce5a223384edef977dd0dfd22a5"
          >
            Sketch UI-Library
          </Heading4>
          <Heading4
            as={Link}
            margin="none"
            href="https://bitbucket.org/enturas/design-system/src/master/"
          >
            Bitbucket
          </Heading4>
          <Heading4 margin="none" as={Link} href="https://entur.no/">
            Entur.no
          </Heading4>
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
