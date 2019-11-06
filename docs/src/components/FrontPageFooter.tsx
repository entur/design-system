import React from 'react';
import AbstractLogo from './Abstractlogo.png';
import BitbucketLogo from './Bitbucket-blue.svg';
import { Heading4, SubParagraph } from '@entur/typography';
import './FrontPageFooter.scss';

function FrontPageFooter() {
  return (
    <div className="front-page-footer">
      <a
        className="front-page-circle-link"
        href="https://share.goabstract.com/ecd2091b-ba8a-4fe6-9997-622265c6db64?sha=94121e0337062ce5a223384edef977dd0dfd22a5"
      >
        <div className="front-page-circle-link__circle">
          <img
            className="front-page-circle-link__circle-image"
            src={AbstractLogo}
            alt="Logo of the software Abstract"
            style={{ height: '50%' }}
          />
        </div>
        <div className="front-page-circle-link__text">
          <Heading4 style={{ lineHeight: '0' }}>Abstract UI Library</Heading4>
          <SubParagraph>
            Last ned Sketch-biblioteket for designere.
          </SubParagraph>
        </div>
      </a>

      <a
        className="front-page-circle-link"
        href="https://bitbucket.org/enturas/design-system/src/master/"
      >
        <div className="front-page-circle-link__circle">
          <img
            className="front-page-circle-link__circle--image"
            src={BitbucketLogo}
            alt="Logo of the website Bitbucket"
            style={{ width: '50%' }}
          />
        </div>
        <div className="front-page-circle-link__text">
          <Heading4 style={{ lineHeight: '0' }}>Bitbucket</Heading4>
          <SubParagraph>Utforsk kildekoden vår i Bitbucket.</SubParagraph>
        </div>
      </a>
    </div>
  );
}

export default FrontPageFooter;
