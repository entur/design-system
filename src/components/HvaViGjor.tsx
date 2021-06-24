import { Contrast } from '@entur/layout';
import { Heading4 } from '@entur/typography';
import React from 'react';
import './HvaViGjor.scss';

export const HvaViGjor = () => {
  return (
    <div className="hva-vi-gjor__grid">
      <div className="hva-vi-gjor__grid-item hva-vi-gjor__grid-item-first">
        <div className="hva-vi-gjor__grid-item-content">
          <div className="hva-vi-gjor__number">1</div>
          <Contrast>
            <Heading4 as="span">
              Levere{' '}
              <span className="hva-vi-gjor__red-text">
                salgs- og billetteringsløsninger
              </span>{' '}
              til kollektivsektoren.
            </Heading4>
          </Contrast>
        </div>
      </div>
      <div className="hva-vi-gjor__grid-item hva-vi-gjor__grid-item-second">
        <div className="hva-vi-gjor__grid-item-content">
          <div className="hva-vi-gjor__number">2</div>
          <Contrast>
            <Heading4 as="span">
              Videreutvikle og drive en{' '}
              <span className="hva-vi-gjor__red-text">
                nasjonal konkurransenøytral reiseplanlegger.
              </span>
            </Heading4>
          </Contrast>
        </div>
      </div>
      <div className="hva-vi-gjor__grid-item hva-vi-gjor__grid-item-third">
        <div className="hva-vi-gjor__grid-item-content">
          <div className="hva-vi-gjor__number">3</div>
          <Contrast>
            <Heading4 as="span">
              Legge til rette for effektiv bruk av stadig økende mengder data i
              kollektivsektoren gjennom en åpen{' '}
              <span className="hva-vi-gjor__red-text">
                nasjonal digital plattform.
              </span>
            </Heading4>
          </Contrast>
        </div>
      </div>
    </div>
  );
};
