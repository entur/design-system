import React from 'react';
import { Heading4, SubParagraph } from '@entur/typography';
import abstract from './images/Abstract.png';
import craft from './images/Craft.png';
import invision from './images/Invision.png';
import sketch from './images/Sketch.png';
import './DesignTools.scss';

function DesignTools() {
  return (
    <div className="design-tools">
      <div className="design-tools-presenter">
        <img
          className="design-tools-presenter__image"
          src={abstract}
          alt="Logo av programmet Abstract"
        />
        <div className="design-tools-presenter__text">
          <Heading4 as="span" className="design-tools-presenter--text-header">
            Abstract
          </Heading4>
          <SubParagraph>
            Lagring av Sketch-filer, versjonshåndtering, samarbeid,
            tilbake-melding, deling og specs til utviklere.
          </SubParagraph>
        </div>
      </div>
      <div className="design-tools-presenter">
        <img
          className="design-tools-presenter__image"
          src={sketch}
          alt="Logo av programmet Sketch"
        />
        <div className="design-tools-presenter__text">
          <Heading4 as="span" className="design-tools-presenter--text-header">
            Sketch
          </Heading4>
          <SubParagraph>Verktøy for å designe digitale skisser.</SubParagraph>
        </div>
      </div>
      <div className="design-tools-presenter">
        <img
          className="design-tools-presenter__image"
          src={craft}
          alt="Logo av programmet Craft"
        />
        <div className="design-tools-presenter__text">
          <Heading4 as="span" className="design-tools-presenter--text-header">
            Craft
          </Heading4>
          <SubParagraph>
            Plug-in som overfører skisser og publiserer prototyper direkte fra
            Sketch til Invision.
          </SubParagraph>
        </div>
      </div>
      <div className="design-tools-presenter">
        <img
          className="design-tools-presenter__image"
          src={invision}
          alt="Logo av programmet Invision"
        />
        <div className="design-tools-presenter__text">
          <Heading4 as="span" className="design-tools-presenter__text-header">
            Invision
          </Heading4>
          <SubParagraph>Brukertesting og utvikling av prototyper.</SubParagraph>
        </div>
      </div>
    </div>
  );
}

export default DesignTools;
