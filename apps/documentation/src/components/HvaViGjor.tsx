import React from 'react';
import './HvaViGjor.scss';

export const HvaViGjor: React.ReactNode = () => {
  return (
    <div className="hva-vi-gjor__grid">
      <div className="hva-vi-gjor__grid-item hva-vi-gjor__grid-item-first">
        <div className="hva-vi-gjor__grid-item-content">
          <div className="hva-vi-gjor__number">1</div>
          <span>
            Levere{' '}
            <span className="hva-vi-gjor__red-text">
              salgs- og billetteringsløsninger
            </span>{' '}
            til kollektivsektoren.
          </span>
        </div>
      </div>
      <div className="hva-vi-gjor__grid-item hva-vi-gjor__grid-item-second">
        <div className="hva-vi-gjor__grid-item-content">
          <div className="hva-vi-gjor__number">2</div>
          <span>
            Videreutvikle og drive en{' '}
            <span className="hva-vi-gjor__red-text">
              nasjonal konkurransenøytral reiseplanlegger.
            </span>
          </span>
        </div>
      </div>
      <div className="hva-vi-gjor__grid-item hva-vi-gjor__grid-item-third">
        <div className="hva-vi-gjor__grid-item-content">
          <div className="hva-vi-gjor__number">3</div>
          <span>
            Legge til rette for effektiv bruk av stadig økende mengder data i
            kollektivsektoren gjennom en åpen{' '}
            <span className="hva-vi-gjor__red-text">
              nasjonal digital plattform.
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};
